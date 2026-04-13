import { ChatOpenAI } from '@langchain/openai'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import {StringOutputParser} from '@langchain/core/output_parsers'
import { CONFIG } from './config'

const llmModel = new  ChatOpenAI({model: CONFIG.model})

const prompt = ChatPromptTemplate.fromMessages([
    ["system", "Voce e um advogado especialista em cobranca. Escreva uma notificacao extrajudicial formal." ],
    ['human', " com os dados: {devedor}, {valor}, {vencimento}, {credor}"]
])

const parser = new StringOutputParser();

const chain =  prompt.pipe(llmModel).pipe(parser)

const result = await chain.invoke({
    devedor: "Maria do carmo",
    valor: 4500,
    vencimento: "20/05/2026",
    credor: "Dr.Marcos da silva"
})

console.log(result)