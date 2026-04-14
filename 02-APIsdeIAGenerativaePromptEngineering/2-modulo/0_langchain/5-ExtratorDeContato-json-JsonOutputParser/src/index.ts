import { ChatPromptTemplate } from '@langchain/core/prompts'
import { ChatOpenAI } from '@langchain/openai'
import { JsonOutputParser } from '@langchain/core/output_parsers'
import { CONFIG } from './config.ts'


const modelLLM = new ChatOpenAI({
    model: CONFIG.model,
})

const parse = new JsonOutputParser()

const prompt = ChatPromptTemplate.fromMessages([
    [
        "system",
        `
        Você estrai dados de contatos de textos.
        Retorne APENAS um JSON válido neste formato, sem texto extra:
            {{
            "nome": "",
            "email": "",
            "telefone": ""
    }}
        Se algum dado não existir, use null
        `
    ],
    ["human", "{texto}"]
])

const chain = prompt.pipe(modelLLM).pipe(parse)

const contato = await chain.invoke({
    texto: "Oi, me chamo Ana Lima. Pode me mandar um email em ana@exemplo.com ou ligar.",
})

console.log(contato);
// { nome: "Ana Lima", email: "ana@exemplo.com", telefone: "11 99999-1234" }

// Agora você acessa os campos diretamente — sem .content, sem split:
console.log(contato.email); // "ana@exemplo.com"
// Agora você acessa os campos diretamente — sem .content, sem split:
console.log(contato.nome); // Ana Lima"