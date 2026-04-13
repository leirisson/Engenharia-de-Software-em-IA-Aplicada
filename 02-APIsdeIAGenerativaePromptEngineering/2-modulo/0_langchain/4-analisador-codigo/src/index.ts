import { ChatPromptTemplate  } from '@langchain/core/prompts'
import { ChatOpenAI } from '@langchain/openai'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { CONFIG, ConfigModel } from './config.ts'

const modelo = new ChatOpenAI({
    apiKey: CONFIG.apiKey,
    model: CONFIG.model,
    temperature: CONFIG.temperature,
    verbose: CONFIG.verbose 
})


const parse = new StringOutputParser()

// Prompt 1 — diagnostica o erro tecnicamente
const promptDiagnostico = ChatPromptTemplate.fromMessages([
  ["system", "Você é um analisador de código. Identifique o erro e explique tecnicamente em 2 linhas."],
  ["human", "Linguagem: {linguagem}\n\nCódigo:\n{codigo}"],
]);

// Prompt 2 — transforma o diagnóstico em explicação para o nível do aluno
const promptExplicacao = ChatPromptTemplate.fromMessages([
    ['system', 'você é analisar de código. Identifique o erro e explique tecnicamente em 2 linhas.'],
    ['human', 'O diagnostico técnico do codigo é: \n\n{diagnostico}\n\nAgora explique de forma simples.']
])

// Chain longa com dois modelos diferentes
const chain = promptDiagnostico
.pipe(modelo)
.pipe(parse)
.pipe((diagnostico) => promptExplicacao.invoke({diagnostico, nivel:"iniciante"}))
.pipe(modelo)
.pipe(parse)


const explicacao = await chain.invoke({
    linguagem: "javascript",
    codigo: `
    function soma(a,b){
    let resultado = a + b
    }

    console.log(soma(5,2))
    `
})


// "Você esqueceu o 'return' na função! Em javascript, quando você cria
//  uma função, ela precisa usar 'return' para devolver o resultado.
//  Sem ele, a função faz o cálculo mas joga fora — e retorna undefined.
//  Corrija assim: return resultado"
console.log(explicacao);