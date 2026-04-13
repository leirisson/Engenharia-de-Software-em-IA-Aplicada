import * as env from 'dotenv'
// Carrega as variáveis do arquivo .env 
env.config();

export type ConfigModel = {
    model: string;
    apiKey :string;
    temperature: number;
    verbose: boolean
}

export const CONFIG: ConfigModel = {
    model: "gpt-4.1-nano",
    apiKey: process.env.OPENAI_API_KEY!,
    temperature: 0.3,
    verbose: true
}