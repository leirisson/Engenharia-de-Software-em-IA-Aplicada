import type { DataType, PretrainedModelOptions } from "@huggingface/transformers";

export interface TextSplitterConfig {
    // Tamanho alvo (aproximado) de cada chunk em caracteres.
    chunkSize: number;
    // Quantidade de caracteres reaproveitados entre chunks consecutivos.
    // Ajuda a não “cortar” conceitos no meio e melhora recuperação (RAG).
    chunkOverlap: number;
}

// Configuração central do projeto.
// A maior parte vem de variáveis de ambiente (.env) para facilitar trocar infra/modelos sem mexer no código.
export const CONFIG = Object.freeze({
    neo4j: {
        // Conexão com Neo4j via Bolt.
        // Exemplo local: bolt://localhost:7687
        url: process.env.NEO4J_URI!,
        // Credenciais do Neo4j. Para docker-compose padrão: neo4j/password
        username: process.env.NEO4J_USER!,
        password: process.env.NEO4J_PASSWORD!,
        // Nome do índice vetorial que o Neo4j/LangChain vai usar/criar.
        indexName: "tensors_index",
        // "vector": busca puramente vetorial. (Existe "hybrid" no LangChain, quando combinado com texto/FTS.)
        searchType: "vector" as const,
        // Propriedades do nó que guardam o texto do chunk.
        // O VectorStore usa isso na query de recuperação para devolver o conteúdo do Document.
        textNodeProperties: ["text"],
        // Label do nó no Neo4j que representa um chunk.
        nodeLabel: "Chunk",
    },
    openRouter: {
        // Modelo “NLP/LLM” (via OpenRouter). Esta base prepara a config, mas o uso depende do seu fluxo.
        nlpModel: process.env.NLP_MODEL,
        // Endpoint padrão do OpenRouter.
        url: "https://openrouter.ai/api/v1",
        // Chave do OpenRouter.
        apiKey: process.env.OPENROUTER_API_KEY,
        // Temperatura controla aleatoriedade (0 = mais determinístico).
        temperature: 0.3,
        // Quantas tentativas antes de falhar (ex.: instabilidade de rede).
        maxRetries: 2,
        defaultHeaders: {
            // Recomendado pelo OpenRouter para identificar o app.
            "HTTP-Referer": process.env.OPENROUTER_SITE_URL,
            "X-Title": process.env.OPENROUTER_SITE_NAME,
        }
    },
    pdf: {
        // PDF de entrada para ingestão.
        path: "./tensores.pdf",
    },
    textSplitter: {
        // Esses valores controlam o equilíbrio “contexto vs. precisão” na recuperação.
        // Ajuste se o topK estiver vindo com trechos curtos demais (aumente chunkSize)
        // ou irrelevantes (reduza chunkSize / aumente overlap com cuidado).
        chunkSize: 1000,
        chunkOverlap: 200,
    },
    embedding: {
        // Modelo de embeddings (Transformers.js). Exemplo: Xenova/all-MiniLM-L6-v2
        modelName: process.env.EMBEDDING_MODEL!,
        pretrainedOptions: {
            // dtype afeta qualidade x performance:
            // - fp32: melhor qualidade (maior uso de RAM/CPU)
            // - fp16: mais rápido/leve em alguns cenários
            // - quantizados (q8/q4/...): bem mais leves, com possível perda de qualidade
            dtype: "fp32" as DataType, // Options: 'fp32' (best quality), 'fp16' (faster), 'q8', 'q4', 'q4f16' (quantized)
        } satisfies PretrainedModelOptions,
    },
    similarity: {
        // topK = quantos chunks serão retornados por uma consulta de similaridade.
        // Em RAG, normalmente você passa esses chunks para um LLM responder com base neles.
        topK: 3,
    },
});
