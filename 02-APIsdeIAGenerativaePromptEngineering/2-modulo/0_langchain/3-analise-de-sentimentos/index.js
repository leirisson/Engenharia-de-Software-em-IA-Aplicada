import { ChatPromptTemplate } from '@langchain/core/prompts'
import { ChatOpenAI } from '@langchain/openai'
import { StringOutputParser } from '@langchain/core/output_parsers'
import * as env from 'dotenv'
// Carrega as variáveis do arquivo .env 
env.config();

const model = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    model: "gpt-4.1-nano",
    temperature: 0.3,
    verbose: true
})

const parse = new StringOutputParser()


// construção do prompt
// Prompt 1 — extrai informações brutas do feedback
const promptAnalise = ChatPromptTemplate.fromMessages([
    ["system", "Você é um analista de CX. Identifique:  sentimento, promlemas principal e urgência."],
    ["human", "Feedback do cliente: {feedback}"]
])

// Prompt 2 — recebe a análise bruta e formata como relatório
const promptRelatorio = ChatPromptTemplate.fromMessages([
    ["system", "Você transforma analise em relatorio curtos e claros para equipes de suporte"],
    ["human", "com base nessa analise:\n\n{analise}\n\nGere um relatorio de 3 linhas."]
])


// Chain longa: prompt1 → model → prompt2 → model → parser
const chain = promptAnalise
    .pipe(model)
    .pipe(parse)   // extrai texto da 1ª resposta
    .pipe((analise) => promptRelatorio.invoke({analise})) // passa para o 2º prompt
    .pipe(model)
    .pipe(parse)  // extrai texto final

const relatorio = await chain.invoke({
    feedback: "Fiz o pedido há 10 dias e nada chegou. Péssimo atendimento, nunca mais compro aqui."
})

console.log(relatorio)
// "Sentimento: muito negativo
//  Problema principal: atraso na entrega (10 dias sem receber)
//  Ação recomendada: contato imediato + rastreio do pedido"