import Fastify from "fastify";
import { buildGraph } from "./graph/nodes/graph.ts";
import { HumanMessage } from "langchain";

export const app = Fastify()

const graph = buildGraph()

    app.post('/chat', {
        schema: {
            body: {
                type: 'object',
                required: ['question'],
                properties: {
                    question: {
                        type: 'string',
                        minLength: 5
                    }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const { question } = request.body as { question: string }
            const response = await graph.invoke({
                messages: [new HumanMessage(question)]
            })

            return reply.send(response.output)
        } catch (error) {
            console.error('Error handing /chat request: ', error)
            return reply.code(500)
        }
    })