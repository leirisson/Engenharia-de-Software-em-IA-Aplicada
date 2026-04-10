

console.assert(
    process.env.OPENROUTER_API_KEY,
    'Precisamos da chave de API da OPEN ROuter'
)


export type ModelConfig = {
    apiKey: string;
    httpRefer: string;
    xTitle: string;
    models: string[];
    port: number;
    maxTokens: number;
    temperature: number;
    systemPrompt: string;
    stream: false;

    provider: {
        sort: {
            by: string,
            partition: string
        }
    }
}



export const CONFIG: ModelConfig = {
    apiKey: process.env.OPENROUTER_API_KEY!,
    httpRefer: "httl://localhost",
    xTitle: "SmartModelGateway",
    models: [
        'nvidia/nemotron-3-super-120b-a12b:free'
    ],
    port: 3000,
    maxTokens: 100,
    temperature: 0.3,
    stream: false,
    systemPrompt: "you are helpful assitent",
    provider: {
        sort: {
            by: "price",
            partition: "none"
        }
    }
}