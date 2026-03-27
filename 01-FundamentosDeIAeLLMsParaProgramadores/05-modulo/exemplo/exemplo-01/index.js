
const aiContext = {
    session: null,
    abortController: null,
    isGenerating: false,
    needsDownload: false,
};

const MODEL_LANGUAGES = ["pt","en"];

const elements = {
    temperature: document.getElementById('temperature'),
    temperatureValue: document.getElementById('temp-value'),
    topKValue: document.getElementById('topk-value'),
    topK: document.getElementById('topK'),
    form: document.getElementById('question-form'),
    questionInput: document.getElementById('question'),
    output: document.getElementById('output'),
    button: document.getElementById('ask-button'),
    year: document.getElementById('year'),
}

function showFatalError(error) {
    const message = error?.message ?? String(error);
    if (message.includes('A listener indicated an asynchronous response by returning true')) {
        console.warn('Non-app error detected (likely browser extension):', message);
        return;
    }
    console.error(error);
    elements.output.textContent = `⚠️ Erro: ${message}`;
    elements.button.disabled = true;
}

window.addEventListener('error', (event) => {
    showFatalError(event?.error ?? event?.message);
});

window.addEventListener('unhandledrejection', (event) => {
    showFatalError(event?.reason ?? event);
});

async function setupEventListeners() {

    // Update display values for range inputs
    elements.temperature.addEventListener('input', (e) => {
        elements.temperatureValue.textContent = e.target.value;
    });

    elements.topK.addEventListener('input', (e) => {
        elements.topKValue.textContent = e.target.value;
    });

    elements.form.addEventListener('submit', async function (event) {
        event.preventDefault();

        if (aiContext.isGenerating) {
            toggleSendOrStopButton(false)
            return;
        }

        await onSubmitQuestion();
    });
}

async function onSubmitQuestion() {
    const output = elements.output;
    let didStartGeneration = false;

    try {
        const questionInput = elements.questionInput;
        const question = questionInput.value;

        if (!question.trim()) {
            if (aiContext.needsDownload) {
                output.textContent = 'O modelo ainda não está instalado. Digite qualquer coisa e clique em "Enviar" para iniciar o download.';
            }
            return;
        }

        const temperature = parseFloat(elements.temperature.value);
        const topK = parseInt(elements.topK.value);
        console.log('Using parameters:', { temperature, topK });

        const isReady = await ensureModelReady();
        if (!isReady) {
            return;
        }

        toggleSendOrStopButton(true)
        didStartGeneration = true;

        output.textContent = 'Processing your question...';
        const aiResponseChunks = await askAI(question, temperature, topK);
        output.textContent = '';

        for await (const chunk of aiResponseChunks) {
            if (aiContext.abortController.signal.aborted) {
                break;
            }
            console.log('Received chunk:', chunk);
            output.textContent += chunk;
        }
    } catch (error) {
        console.error('onSubmitQuestion error:', error);
        output.textContent = `⚠️ Erro: ${error?.message ?? String(error)}`;
    } finally {
        if (didStartGeneration) {
            toggleSendOrStopButton(false);
        }
    }
}

function toggleSendOrStopButton(isGenerating) {
    if (isGenerating) {
        // Switch to stop mode
        aiContext.isGenerating = isGenerating;
        elements.button.textContent = 'Parar';
        elements.button.classList.add('stop-button');
    } else {
        // Switch to send mode
        aiContext.abortController?.abort();
        try {
            aiContext.session?.destroy?.();
        } catch (error) {
            console.warn('Error destroying session:', error);
        } finally {
            aiContext.session = null;
        }
        aiContext.isGenerating = isGenerating;
        elements.button.textContent = 'Enviar';
        elements.button.classList.remove('stop-button');
    }
}
async function* askAI(question, temperature, topK) {
    aiContext.abortController?.abort();
    aiContext.abortController = new AbortController();

    // Destroy previous session and create new one with updated parameters
    if (aiContext.session) {
        aiContext.session.destroy();
    }

    const session = await LanguageModel.create({
        expectedInputLanguages: MODEL_LANGUAGES,
        temperature: temperature,
        topK: topK,
        initialPrompts: [
            {
                role: 'system', content: `
                Você é um assistente de IA que responde de forma clara e objetiva.
                Responda sempre em formato de texto ao invés de markdown`

            },
        ],
    });
    aiContext.session = session;

    const responseStream = await session.promptStreaming(
        [
            {
                role: 'user',
                content: question,
            },
        ],
        {
            signal: aiContext.abortController.signal,
        }
    );

    for await (const chunk of responseStream) {
        if (aiContext.abortController.signal.aborted) {
            break;
        }
        yield chunk;
    }
}

async function ensureModelReady() {
    if (!('LanguageModel' in self)) {
        elements.output.innerHTML = [
            "⚠️ As APIs nativas de IA não estão ativas.",
            "Ative a seguinte flag em chrome://flags/:",
            "- Prompt API for Gemini Nano (chrome://flags/#prompt-api-for-gemini-nano)",
            "Depois reinicie o Chrome e tente novamente."
        ].join('<br/>');
        elements.button.disabled = true;
        return false;
    }

    let availability;
    try {
        availability = await LanguageModel.availability({ languages: MODEL_LANGUAGES });
        console.log('Language Model Availability:', availability);
    } catch (error) {
        console.error('Error checking availability:', error);
        elements.output.textContent = `⚠️ Erro ao verificar disponibilidade do modelo: ${error?.message ?? String(error)}`;
        return false;
    }

    if (availability === 'available') {
        aiContext.needsDownload = false;
        return true;
    }

    if (availability === 'unavailable') {
        elements.output.textContent = '⚠️ O seu dispositivo não suporta modelos de linguagem nativos de IA.';
        elements.button.disabled = true;
        return false;
    }

    if (availability === 'downloading') {
        elements.output.textContent = '⚠️ O modelo está sendo baixado. Aguarde alguns minutos e tente novamente.';
        return false;
    }

    if (availability !== 'downloadable') {
        elements.output.textContent = `⚠️ Estado inesperado de disponibilidade do modelo: ${availability}`;
        return false;
    }

    aiContext.needsDownload = true;
    return downloadModel();
}

async function downloadModel() {
    elements.button.disabled = true;
    elements.output.textContent = 'Baixando modelo... 0% (acompanhe também o console do Chrome)';

    try {
        const session = await LanguageModel.create({
            expectedInputLanguages: MODEL_LANGUAGES,
            monitor(m) {
                m.addEventListener('downloadprogress', (e) => {
                    const percent = e.total ? ((e.loaded / e.total) * 100).toFixed(0) : '0';
                    console.log(`Downloaded ${percent}%`, e);
                    elements.output.textContent = `Baixando modelo... ${percent}%`;
                });
            }
        });

        await session.prompt('Olá');
        session.destroy();

        const newAvailability = await LanguageModel.availability({ languages: MODEL_LANGUAGES });
        console.log('Language Model Availability (after download):', newAvailability);
        if (newAvailability === 'available') {
            aiContext.needsDownload = false;
            elements.output.textContent = 'Modelo instalado. Pode perguntar.';
            elements.button.disabled = false;
            return true;
        }

        elements.output.textContent = `⚠️ O download não foi concluído. Estado atual: ${newAvailability}`;
        elements.button.disabled = false;
        return false;
    } catch (error) {
        console.error('Error downloading model:', error);
        elements.output.textContent = `⚠️ Erro ao baixar o modelo: ${error?.message ?? String(error)}`;
        elements.button.disabled = false;
        return false;
    }
}

async function checkRequirements() {
    const errors = [];
    const returnResults = () => errors.length ? errors : null;

    // @ts-ignore
    const isChrome = !!window.chrome;
    if (!isChrome)
        errors.push("⚠️ Este recurso só funciona no Google Chrome ou Chrome Canary (versão recente).");
    if (!isSecureContext) {
        errors.push("⚠️ Esta página precisa estar em contexto seguro (https) ou em localhost.");
    }
    if (!('LanguageModel' in self)) {
        errors.push("⚠️ As APIs nativas de IA não estão ativas.");
        errors.push("Ative a seguinte flag em chrome://flags/:");
        errors.push("- Prompt API for Gemini Nano (chrome://flags/#prompt-api-for-gemini-nano)");
        errors.push("Depois reinicie o Chrome e tente novamente.");
        return returnResults();
    }

    const availability = await LanguageModel.availability({ languages: MODEL_LANGUAGES });
    console.log('Language Model Availability:', availability);
    if (availability === 'available') {
        return returnResults();
    }

    if (availability === 'unavailable') {
        errors.push(`⚠️ O seu dispositivo não suporta modelos de linguagem nativos de IA.`);
    }

    if (availability === 'downloading') {
        errors.push(`⚠️ O modelo de linguagem de IA está sendo baixado. Por favor, aguarde alguns minutos e tente novamente.`);
    }

    if (availability === 'downloadable') {
        aiContext.needsDownload = true;
    }

    return returnResults();

}

(async function main() {
    elements.year.textContent = new Date().getFullYear();
    elements.output.textContent = 'Inicializando...';

    const reqErrors = await checkRequirements();
    if (reqErrors) {
        elements.output.innerHTML = reqErrors.join('<br/>');
        elements.button.disabled = true;
        return;
    }

    if (aiContext.needsDownload) {
        elements.output.innerHTML = [
            '⚠️ O modelo de linguagem ainda não está instalado neste navegador.',
            'Digite uma pergunta e clique em "Enviar" para iniciar o download.'
        ].join('<br/>');
    }

    let params;
    try {
        params = await LanguageModel.params();
        console.log('Language Model Params:', params);
    } catch (error) {
        console.error('Error reading LanguageModel params:', error);
        params = {
            defaultTemperature: 1,
            defaultTopK: 3,
            maxTemperature: 2,
            maxTopK: 128,
        };
    }

    elements.topK.max = params.maxTopK;
    elements.topK.min = 1;
    elements.topK.value = params.defaultTopK;
    elements.topKValue.textContent = params.defaultTopK;

    elements.temperatureValue.textContent = params.defaultTemperature;
    elements.temperature.max = params.maxTemperature;
    elements.temperature.min = 0;
    elements.temperature.value = params.defaultTemperature;
    return setupEventListeners()
})();
