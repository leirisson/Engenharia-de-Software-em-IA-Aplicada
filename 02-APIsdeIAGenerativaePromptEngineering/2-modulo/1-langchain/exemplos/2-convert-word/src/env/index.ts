import { z } from 'zod'


export const EnvSchema = z.object({
    PORT: z.coerce.number().default(30008),
    OPENROUTER_API_KEY: z.string(),
    LANGSMITH_API_KEY: z.string(),
    LANGCHAIN_TRACING_V2: z.boolean(),
    LANGCHAIN_PROJECTS: z.string()
})

const _env = EnvSchema.safeParse(EnvSchema)

if(_env.success === false){
    throw new Error("🚨📄   ERRO NAS VARIAVEIS DE AMBIENTE DO PROJETO.")
}

export const env = _env.data

