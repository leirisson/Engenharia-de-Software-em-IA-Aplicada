import { ChatOpenAI } from "@langchain/openai"
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { JsonOutputParser } from '@langchain/core/output_parsers'
import { CONFIG } from './config'


const model = new ChatOpenAI({model: CONFIG.model})
const parse = new JsonOutputParser()

const prompt = ChatPromptTemplate.fromMessages([
    ["system", `
        você é um assitente expecialista em extrator de dados de contratos, você
        deve ler os dados do contrados e a saida esperada é:
        {{
        contratante:"",
        contratado:"",
        objetivo:"",
        valor:0,
        inicio:"",
        vigencia_meses: ""
        }}

        `],
        ["human", "{texto}"]
])

const chain = prompt.pipe(model).pipe(parse)
const contrato = await chain.invoke({
    texto: `
    PARTES: João Silva contrata Maria Oliveira para execução do seguinte objeto: desenvolvimento de um site institucional.
    VALOR E PAGAMENTO: O valor total acordado é de R$ 5.000,00, a ser pago conforme combinado entre as partes.
    PRAZO: O contrato inicia em 01/05/2026 e terá vigência de 6 meses.
    OBRIGAÇÕES: Maria Oliveira se compromete a executar o objeto com qualidade e João Silva a efetuar os pagamentos no prazo.
    RESCISÃO: O descumprimento de qualquer cláusula autoriza a rescisão antecipada, sem prejuízo de perdas e danos.
`
})

console.log(contrato)