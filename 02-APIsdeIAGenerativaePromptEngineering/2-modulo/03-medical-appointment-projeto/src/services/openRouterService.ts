import { ChatOpenAI } from '@langchain/openai'
import { config, type ModelConfig } from '../config.ts';
import { z } from 'zod'
import { createAgent, HumanMessage, providerStrategy, SystemMessage } from 'langchain';
import { success } from 'zod/v4';



export class OpenRaouterService {
    private config: ModelConfig
    private llmClient: ChatOpenAI
    constructor(configOverride?: ModelConfig) {
        this.config = configOverride ?? config

        this.llmClient = new ChatOpenAI({
            apiKey: this.config.apiKey,
            model: this.config.models.at(0),
            temperature: this.config.temperature,
            configuration: {
                baseURL: "https://openrouter.ai/api/v1",
                defaultHeaders: {
                    'HTTP-Referer': this.config.httpReferer,
                    'X-Title': this.config.xTitle
                }
            },

            // aqui vai a confgiuração do openRouter
            modelKwargs: {
                models: this.config.models,
                provider: this.config.provider
            }

        }
        )
    }


    async generateStructured<T>(
        userPrompt: string,
        systemPrompt: string,
        schema: z.ZodSchema<T>
    ) {
        const agent = createAgent({
            model: this.llmClient,
            tools: [],
            responseFormat: providerStrategy(schema)
        })

        try {
            const messages = [
                new SystemMessage(systemPrompt),
                new HumanMessage(userPrompt)
            ]

            const data = await agent.invoke({ messages })
            return {
                success: true,
                data: data.structuredResponse
            }
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : String(error)
            }
        }
    }
}