import { END, MessagesZodMeta, START, StateGraph } from '@langchain/langgraph'
import { withLangGraph } from '@langchain/langgraph/zod'
import { BaseMessage } from 'langchain'
import {z} from 'zod/v3'
import { identifyIntent } from './identifyIntentNode.ts'



// 1 - configurando o GrapState
const GraphState = z.object({
    messages: withLangGraph(
        z.custom<BaseMessage[]>(),
        MessagesZodMeta
    ),
    output: z.string(),
    command: z.enum(["uppercase", "lowercase", "unknown"])
})

//2 - exportando o type State
export type GraphState = z.infer<typeof GraphState>




export function buildGraph() {
    const workflow = new StateGraph({
        stateSchema: GraphState
    })

    // adicionando os Nodes - Nós
    .addNode("identifyIntent", identifyIntent)
    .addEdge(START, "identifyIntent")
    .addEdge("identifyIntent", END)

    return workflow.compile()
}