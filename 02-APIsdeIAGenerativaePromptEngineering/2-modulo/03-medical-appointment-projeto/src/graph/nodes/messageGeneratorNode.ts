import { getSystemPrompt, getUserPromptTemplate, MessageSchema } from '../../prompts/v1/messageGenerator.ts';
import { OpenRaouterService } from '../../services/openRouterService.ts';
import type { GraphState } from '../graph.ts';
import { AIMessage } from 'langchain';

export function createMessageGeneratorNode(llmClient: OpenRaouterService) {
    return async (state: GraphState): Promise<Partial<GraphState>> => {
        console.log(`💬 Generating response message...`);

        try {


            const haSuccess = state.actionSuccess ? 'success' : "error"
            const scenario = `${state.intent ?? 'unknown'}_${haSuccess}`
            const details = {
                profetionalName: state.professionalName,
                datetime: state.datetime,
                patientName: state.patientName,
                error: state.error
            } 

            const systemPrompt = getSystemPrompt()
            const userPrompt = getUserPromptTemplate({scenario, details})


            const result = await llmClient.generateStructured(
                systemPrompt,
                userPrompt,
                MessageSchema
            )

            console.log(`✅📄 - Message generate: ${result.data?.message ?? result.data ?? result}`)

            if(result.error){
                console.log("Deu erro em alguam coisa do sistema: " + result.error)
                return {
                    messages: [
                        ...state.messages,
                        new AIMessage("Desculpe Errei...🤖📄")
                    ]
                }
            }

            return {
                messages: [
                    ...state.messages,
                    new AIMessage(result.data!.message)
                ],
            };
        } catch (error) {
            console.error('❌ Error in messageGenerator node:', error);
            return {
                ...state,
                messages: [
                    ...state.messages,
                    new AIMessage('An error occurred while processing your request.')
                ],
            };
        }
    };
}
