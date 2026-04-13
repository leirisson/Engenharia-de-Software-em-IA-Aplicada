import { ChatPromptTemplate } from '@langchain/core/prompts'
import { ChatOpenAI } from '@langchain/openai'
import { JsonOutputParser } from '@langchain/core/output_parsers'
import { CONFIG } from './config'

const llmModel = new ChatOpenAI({model: CONFIG.model})
const parse = new JsonOutputParser()

const prompt = ChatPromptTemplate.fromMessages([
    ["system", `
        
        você é um classificador de produtos para e-commerce.
        Retorne APENAS um JSON válido neste formato, sem texto extra:
        {{
            "categoria": "...",
            "tags": ["...", "..."],
            "score": 0.0
        }}
            Regras: categoria em português, minúsculo. Score de 0 a 1 indicando confiança.
        `],
        ["human", "Produto: {texto}"]
])

const chain = prompt.pipe(llmModel).pipe(parse)

const resultado = await chain.invoke({texto:  "Fone de ouvido sem fio com cancelamento de ruído e 30h de bateria",})

console.log(resultado);
// { categoria: "eletronicos", tags: ["fone", "bluetooth", "sem fio"], score: 0.95 }

// Você pode usar os campos diretamente no seu código:
if (resultado.score > 0.8) {
  console.log(`Categoria confirmada: ${resultado.categoria}`);
  console.log(`Tags: ${resultado.tags.join(", ")}`);
}