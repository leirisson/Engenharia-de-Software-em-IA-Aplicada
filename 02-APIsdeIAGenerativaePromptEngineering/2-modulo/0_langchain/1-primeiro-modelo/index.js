import { ChatOpenAI } from "@langchain/openai";
import * as dotenv from "dotenv";

// Carrega as variáveis do arquivo .env [3]
dotenv.config();

const model = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    model: "gpt-4.1-nano",
    temperature: 0.3,
    verbose:true
})

const response = await model.invoke("olá como é o nome do presidente do brasil ?")

console.log(response.content)