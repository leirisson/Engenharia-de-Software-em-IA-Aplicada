import * as readlineSync from 'readline-sync';
import { HuggingFaceTransformersEmbeddings } from '@langchain/community/embeddings/huggingface_transformers';
import { CONFIG } from './config.ts'
import { DocumentProcessor } from './DocumentProcessor.ts';
import { type PretrainedModelOptions } from '@huggingface/transformers';
import { Neo4jVectorStore } from '@langchain/community/vectorstores/neo4j_vector';
import { displayResults, formatContent } from './util.ts';

let _NEO4J_VECTOR_STORE = null


function chunkArray<T>(items: T[], size: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < items.length; i += size) {
        chunks.push(items.slice(i, i + size))
    }
    return chunks
}

async function ensureChunkIdConstraint(vectorStore: Neo4jVectorStore, nodeLabel: string) {
    await vectorStore.query(`
        CREATE CONSTRAINT chunkId_unique IF NOT EXISTS
        FOR (n:${nodeLabel})
        REQUIRE n.chunkId IS UNIQUE
    `)
}

async function getExistingContentHashes(
    vectorStore: Neo4jVectorStore,
    nodeLabel: string,
    chunkIds: string[]
): Promise<Map<string, string | null>> {
    if (chunkIds.length === 0) return new Map()
    const rows = await vectorStore.query(
        `
        MATCH (n:${nodeLabel})
        WHERE n.chunkId IN $chunkIds
        RETURN n.chunkId AS chunkId, n.contentHash AS contentHash
        `,
        { chunkIds }
    )
    const map = new Map<string, string | null>()
    for (const row of rows as any[]) {
        map.set(row.chunkId, row.contentHash ?? null)
    }
    return map
}

async function upsertDocumentsIncremental(
    vectorStore: Neo4jVectorStore,
    nodeLabel: string,
    embeddings: HuggingFaceTransformersEmbeddings,
    docs: Array<{ pageContent: string; metadata?: Record<string, any> }>
) {
    const normalized = docs.map((doc, idx) => {
        const chunkId = doc.metadata?.chunkId ?? `${idx}`
        const contentHash = doc.metadata?.contentHash ?? null
        return {
            doc,
            chunkId,
            contentHash,
        }
    })

    const idBatches = chunkArray(normalized.map(n => n.chunkId), 500)
    const existingMap = new Map<string, string | null>()
    for (const batch of idBatches) {
        const partial = await getExistingContentHashes(vectorStore, nodeLabel, batch)
        for (const [k, v] of partial.entries()) existingMap.set(k, v)
    }

    const toUpsert = normalized.filter(n => existingMap.get(n.chunkId) !== (n.contentHash ?? null))
    if (toUpsert.length === 0) {
        console.log("nenhum documento novo/alterado para inserir")
        return
    }

    const batches = chunkArray(toUpsert, 50)
    for (const [batchIndex, batch] of batches.entries()) {
        console.log(`upsert batch ${batchIndex + 1}/${batches.length}`)
        const texts = batch.map(b => b.doc.pageContent)
        const vectors = await embeddings.embedDocuments(texts)

        const rows = batch.map((b, i) => ({
            chunkId: b.chunkId,
            text: b.doc.pageContent,
            embedding: vectors[i],
            contentHash: b.contentHash,
            sourceType: b.doc.metadata?.sourceType ?? null,
            file: b.doc.metadata?.file ?? null,
            rowIndex: b.doc.metadata?.rowIndex ?? null,
            chunkIndex: b.doc.metadata?.chunkIndex ?? null,
        }))

        await vectorStore.query(
            `
            UNWIND $rows AS row
            MERGE (n:${nodeLabel} { chunkId: row.chunkId })
            ON CREATE SET n.createdAt = datetime()
            SET n.text = row.text,
                n.embedding = row.embedding,
                n.contentHash = row.contentHash,
                n.sourceType = row.sourceType,
                n.file = row.file,
                n.rowIndex = row.rowIndex,
                n.chunkIndex = row.chunkIndex,
                n.updatedAt = datetime()
            `,
            { rows }
        )
    }
}


try {
    console.log("carregando os dados")

    const documentProcessor = new DocumentProcessor(
        CONFIG.dados.csv,
        CONFIG.textSplitter
    )

    const docs = await documentProcessor.loadAndSplit()
    const embeddings = new HuggingFaceTransformersEmbeddings({
        model: CONFIG.embedding.modelName,
        pretrainedOptions: CONFIG.embedding.pretrainedOptions as PretrainedModelOptions,

    })

    /**
     * carrega os dados no neo4j
     */
    _NEO4J_VECTOR_STORE = await Neo4jVectorStore.fromExistingGraph(
        embeddings,
        CONFIG.neo4j,
    )

    await ensureChunkIdConstraint(_NEO4J_VECTOR_STORE, CONFIG.neo4j.nodeLabel)
    await upsertDocumentsIncremental(_NEO4J_VECTOR_STORE, CONFIG.neo4j.nodeLabel, embeddings, docs)

    console.log("todos os documentos foram adicionados no neo4j")

    const question: string = readlineSync.question('Please enter your question: ');


    // realizar querys no neo4j
    const results = await _NEO4J_VECTOR_STORE.similaritySearch(question)

    displayResults(results)






} catch (error) {
    console.log(error)
} finally {

}
