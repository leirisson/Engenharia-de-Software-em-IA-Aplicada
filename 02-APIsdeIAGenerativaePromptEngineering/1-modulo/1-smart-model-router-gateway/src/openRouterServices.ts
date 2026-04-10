import { OpenRouter } from '@openrouter/sdk';
import { CONFIG, type ModelConfig } from './config.ts';
import { type ChatGenerationParams } from '@openrouter/sdk/models';

type LLMResponse = {
    model: string;
    content: string
}


export class OpenRouterService {
    private client: OpenRouter
    private config: ModelConfig

    constructor(configOverride: ModelConfig) {
        this.config = configOverride ?? CONFIG
        this.client = new OpenRouter({
            apiKey: CONFIG.apiKey,
            httpReferer: CONFIG.httpRefer,
            xTitle: CONFIG.xTitle
        })

    }

    async generate(prompt: string): Promise<LLMResponse> {
        const response = await this.client.chat.send(
            {
                models: this.config.models,
                messages: [
                    { role: "system", content: this.config.systemPrompt },
                    { role: 'user', content: prompt }
                ],
                temperature: this.config.temperature,
                maxTokens: this.config.maxTokens,
                provider: this.config.provider as ChatGenerationParams['provider']
            }
        )

        const content = String(response.choices.at(0)?.message.content) ?? ""
        console.log("content: ", content)
        return {
            model: response.model,
            content
        }
    }
}