import { type GraphState } from "./graph.ts";



export function identifyIntent(state: GraphState): GraphState {
    const inputMessage = state.messages.at(-1)
    console.log(inputMessage)
       const input = typeof inputMessage?.content === 'string' 
        ? inputMessage.content 
        : ""

    let command: GraphState['command'] = 'unknown'

    if (inputLower.includes('upper')) {
        command = 'uppercase'
    } else if(inputLower.includes('lower')) {
        command = 'lowercase'
    }


    return {
        ...state,
        command,
        output: input
    }

}