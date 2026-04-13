import { ChatOpenAI } from "@langchain/openai";
import * as dotenv from "dotenv";
import { StringOutputParser } from '@langchain/core/output_parsers'
import { ChatPromptTemplate } from '@langchain/core/prompts'


// Carrega as variáveis do arquivo .env 
dotenv.config();

// 1. Modelo
const model = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    model: "gpt-4.1-nano",
    temperature: 0.3,
    verbose: true
})

// 2. Prompt com duas variáveis
const prompt = ChatPromptTemplate.fromMessages([
    ["system", "Você é agente que escreve bios curtas para redes sociais"],
    ["human", "Crie uma bio para {nome}, que trabalha como {profissao}"]
])


// 3. Parser — transforma AIMessage em string limpa
const parse = new StringOutputParser()

// 4. criando a Chain completa
const chain = prompt.pipe(model).pipe(parse)

// 5. Invocar
const bio = await chain.invoke({
    nome:"Leirisson",
    profissao: "aplied AI developer"
})

console.log(bio)
