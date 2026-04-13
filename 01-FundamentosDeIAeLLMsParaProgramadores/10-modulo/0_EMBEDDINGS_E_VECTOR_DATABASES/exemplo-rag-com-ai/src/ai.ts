import { type Neo4jVectorStore } from "@langchain/community/vectorstores/neo4j_vector"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { RunnableSequence } from "@langchain/core/runnables"
import { ChatOpenAI } from "@langchain/openai"






// tipos para os parametros

/**
 * langchain: 
 * explicação do lanhchaing aqui
 */


interface ChainState {
    question: string
    context?: string
    topScore?: number
    error?: string
    answer?: string
}


type DebugLog = (...args: unknown[]) => void

type Parametros = {
    debuglog: DebugLog,
    vectorStore: Neo4jVectorStore,
    nlpModel: ChatOpenAI,
    promptConfig: any,
    templateText: string,
    topK: number
}


/**
 * explicação da classe AI:
 * 
 */
export class AI {
    private params: Parametros

    constructor(params: Parametros) {
        this.params = params
    }

    /**
     * 
     */
    async retriveVectorSearchResult(input: ChainState): Promise<ChainState> {
        this.params.debuglog("Buscando no vector store do neo4j...🔎")
        const vectorResults = await this.params.vectorStore
            .similaritySearchWithScore(
                input.question,
                this.params.topK
            )

        if (!vectorResults || vectorResults.length === 0) {
            this.params.debuglog("Nenhuma resposta encontrada no vector store do neo4j")
            return {
                ...input,
                error: "Nenhuma resposta encontrada no vector store do neo4j"
            }
        }

        const topScore = vectorResults[0]![1]


        const context = vectorResults
            .filter(([doc]) => doc)
            .map(([doc]) => doc.pageContent)
            .join("\n\n")

        return {
            ...input,
            context,
            topScore
        }
    }

    /**
     * retornar os valores do vetor
* 
*/
    async generateNLPResponse(input: ChainState): Promise<ChainState> {
        if(input.error) return input

        console.log("gerando a resposta com AI...🤖")

        if (!this.params.promptConfig) {
            return {
                ...input,
                error: "promptConfig não foi carregado"
            }
        }

        if (!this.params.templateText) {
            return {
                ...input,
                error: "templateText está vazio"
            }
        }

        if (!this.params.nlpModel) {
            return {
                ...input,
                error: "nlpModel não foi configurado"
            }
        }

        const responsePrompt = ChatPromptTemplate.fromTemplate(
            this.params.templateText
        )

        const responseChain = responsePrompt
        .pipe(this.params.nlpModel)
        .pipe(new StringOutputParser())

        try {
            const rawResponse = await responseChain.invoke({
                role: this.params.promptConfig.role,
                task: this.params.promptConfig.task,
                tone: this.params.promptConfig.constraints?.tone,
                language: this.params.promptConfig.constraints?.language,
                format: this.params.promptConfig.constraints?.format,
                instructions: (this.params.promptConfig.instructions ?? [])
                    .map((instruction: string, idx: number) => `${idx + 1}. ${instruction}`)
                    .join("\n"),
                question: input.question,
                context: input.context ?? ""
            })

            console.log(rawResponse)

            return {
                ...input,
                answer: rawResponse
            }
        } catch (error) {
            const message = error instanceof Error
                ? error.message
                : typeof error === "string"
                    ? error
                    : JSON.stringify(error)

            return {
                ...input,
                error: `Falha ao chamar o LLM: ${message}`
            }
        }
    }

    /**
     * 
     * @param question 
     */
    async answerQuestions(question: string) {
        const chain = RunnableSequence.from([
            this.retriveVectorSearchResult.bind(this),
            this.generateNLPResponse.bind(this)
        ])

        const results = await chain.invoke({
            question
        })

        this.params.debuglog("🎤  pergunta")
        this.params.debuglog(question + "\n")
        this.params.debuglog("🤔💭  : Resposta: ")
        this.params.debuglog(results.answer || results.error, "\n")
        
        return results
    }
}
