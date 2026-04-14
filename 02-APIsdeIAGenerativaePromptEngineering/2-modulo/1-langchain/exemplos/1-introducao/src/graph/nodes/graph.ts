import { Command, END, Graph, MessagesZodMeta, START, StateGraph } from '@langchain/langgraph'
import { withLangGraph } from '@langchain/langgraph/zod'
import { BaseMessage } from 'langchain'
import {z} from 'zod/v3'


const graphState = z.object({
    messages: withLangGraph(
        z.custom<BaseMessage[]>(), MessagesZodMeta
    ),
    output: z.string(),
    command: z.enum(['uppercase', 'lowercase', 'unknown'])
})

export type GraphState = z.infer<typeof graphState>

export function buildGraph(){
    const workFlow =  new StateGraph({
        stateSchema: graphState
    })


    .addNode("identifyIntent", (state: GraphState) => {
        return{
            ...state,
            output: "teste"
        }
    })
    .addEdge(START, "identifyIntent")
    .addEdge("identifyIntent",END )


    return workFlow.compile()
}