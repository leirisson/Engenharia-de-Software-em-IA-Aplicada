import { ChatPromptTemplate } from "@langchain/core/prompts"
import { ChatOpenAI } from '@langchain/openai'
import { StructuredOutputParser } from '@langchain/core/output_parsers'
import { z } from 'zod'
import { CONFIG } from './config'
import { describe } from "zod/v4/core"

const llmModel = new ChatOpenAI({ model: CONFIG.model})

// 1. Define o schema com Zod — campos, tipos e descrições
const schema = z.object({
    categoria: z.string().describe("categoria do produto em portugês, minusculo"),
    tags: z.array(z.string()).describe("lista de 2 a 4 palavras-chave"),
    score: z.number().min(0).max(1).describe("confiança da classificação entre 0 e 1"),
    disponivel: z.boolean().describe('se o produto parece estar disponivel no mercado')
})

// 2. Cria o parser a partir do schema
const parse = StructuredOutputParser.fromZodSchema(schema)

// 3. Busca as instruções geradas automaticamente para o prompt
const instrucoes = parse.getFormatInstructions()
// → "Return a JSON object with the following fields: categoria (string)..."


// 4. Injeta as instruções no prompt via {format_instructions}
const prompt = ChatPromptTemplate.fromMessages([
    ["system", "Você classifica produtos para um e-commerce.\n\n{format_instructions}"],
    ["human", "Produto: {descricao}"]
])

// 5. Chain completa
const chain = prompt.pipe(llmModel).pipe(parse)

const resultado = await chain.invoke({
    descricao: "Tênis de corrida com amortecimento extra e solado antiderrapante",
    format_instructions: instrucoes
})

console.log(resultado);
// {
//   categoria: "calcados",
//   tags: ["tenis", "corrida", "amortecimento", "esporte"],
//   score: 0.97,
//   disponivel: true
// }

// TypeScript sabe os tipos de cada campo — sem any, sem cast manual:
console.log(resultado.score.toFixed(2)); // "0.97"  ← number garantido
console.log(resultado.tags.length);      // 4       ← array garantido
console.log(resultado.disponivel);       // true    ← boolean garantido