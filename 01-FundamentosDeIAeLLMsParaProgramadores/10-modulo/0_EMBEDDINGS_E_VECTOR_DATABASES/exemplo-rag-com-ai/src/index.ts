import { CONFIG } from "./config.ts";
import { DocumentProcessor } from "./documentProcessor.ts";
import os from "node:os";
import path from "node:path";
import { env, type PretrainedModelOptions } from "@huggingface/transformers";
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
import { Neo4jVectorStore } from "@langchain/community/vectorstores/neo4j_vector";
import { ChatOpenAI } from "@langchain/openai";
import { AI } from "./ai.ts";
import { mkdir, writeFile } from "node:fs/promises";

env.cacheDir = path.join(os.tmpdir(), "hf-transformers-cache");
// Transformers.js faz cache dos arquivos baixados (modelos/tokenizers/onnx).
// No Windows, o cache padrão pode acabar em caminhos longos e causar falhas de IO.
// Definindo um cache curto e absoluto, o download do ONNX tende a ficar mais estável.


// Guardamos a instância fora do try para conseguir fechar o driver no finally.
let _neo4jVectorStore: Neo4jVectorStore | null = null


async function clearAllNodes(VECTOR_STORE: Neo4jVectorStore, NODE_LABEL: string) {
    console.log("clearing all nodes from neo4j vector store")
    // Remove todos os nós do label usado para armazenar os chunks.
    // Útil para “resetar” a base durante testes/demonstrações.
    //
    // Atenção: NODE_LABEL entra diretamente no Cypher (string template).
    // Mantenha esse valor controlado pelo código/config, não por input de usuário.
    await VECTOR_STORE.query(`
        MATCH (n:${NODE_LABEL})
        DETACH DELETE n
        `)
    console.log("all nodes REMOVIDOS from neo4j vector store")
    console.log("all nodes REMOVIDOS from neo4j vector store")
}

try {
    console.log("🎉  inicializando o sistema de Embeddings com neo4j ...")
    // 1) Ingestão do PDF e split em chunks.
    // A ideia é transformar um documento grande em vários trechos menores para:
    // - aumentar a chance do trecho certo aparecer no topK
    // - manter contexto suficiente no chunk (via chunkOverlap)
    const documentPtocessor = new DocumentProcessor(
        CONFIG.pdf.path,
        CONFIG.textSplitter,
        
    )

    // Cada item é um Document (LangChain):
    // - pageContent: texto do chunk
    // - metadata: metadados (ex.: número da página do PDF)
    const documents = await documentPtocessor.loadAndSplit()

    /**
     * construção do embeddings
     */

    // 2) Embeddings: texto -> vetor numérico.
    // Isso permite busca por “significado” (similaridade) ao invés de busca literal por palavras.
    const embeddings = new HuggingFaceTransformersEmbeddings({
        model: CONFIG.embedding.modelName,
        pretrainedOptions: CONFIG.embedding.pretrainedOptions as PretrainedModelOptions
    })

    /**
     * instanciando a AI
     */
    const nlpModel = new ChatOpenAI({
        temperature: CONFIG.openRouter.temperature,
        maxRetries: CONFIG.openRouter.maxRetries,
        model: CONFIG.openRouter.nlpModel,
        openAIApiKey: CONFIG.openRouter.apiKey,
        configuration: {
            baseURL: CONFIG.openRouter.url,
            defaultHeaders: CONFIG.openRouter.defaultHeaders
        }
    })


    // // const response = await embeddings.embedQuery('javascript')
    // const response = await embeddings.embedDocuments(['javascript'])
    // console.log(response)

    /**
     * construção do vector store
     * 1. embeddings
     * 2. neo4j config
     * 3. node label
     * 4. vector threshold
     * 5. vector store config
     * 6. vector store
     * 7. clear all nodes
     * 8. add documents to vector store
     * 9. query vector store
     * criar uma query para buscar os documentos mais semelhantes
     * para uma consulta de texto
     * a variavel abaixo tem como função criar uma
     * query para buscar os documentos mais semelhantes
     */
    // 3) Vector store no Neo4j:
    // - cria/usa o índice vetorial indicado por CONFIG.neo4j.indexName
    // - persiste chunks como nós com label CONFIG.neo4j.nodeLabel
    // - armazena o texto em CONFIG.neo4j.textNodeProperties
    _neo4jVectorStore = await Neo4jVectorStore.fromExistingGraph(
        embeddings,
        CONFIG.neo4j,
    )

    /**
     * limpando os nodes 
     */
    await clearAllNodes(_neo4jVectorStore, CONFIG.neo4j.nodeLabel)

    /**
     * adicionando os documentos ao vector store
     * para as consultas de texto
     */

    // 4) Persistência dos chunks:
    // Para cada documento, gera o embedding e grava no Neo4j.
    for (const [index, document] of documents.entries()) {
        console.log(`✅ Adicinando documento ${index + 1}/${documents.length}`)
        await _neo4jVectorStore.addDocuments([document])
    }

    console.log(`base de dados carregada com sucesso`)

    // ================ passo 2 buscando a similaridade ========
    // 5) Consulta por similaridade:
    // - a query também vira embedding
    // - o Neo4j retorna os topK chunks mais próximos
    // - displayResults só formata a saída para você validar rapidamente o resultado
    // const query = 'o que é hot encoding e quando usar ?'
    const questions = [
        'o que significa treinar uma rede neural?',
        'qual a diferença entre machine learning e deep learning?',
        'o que é overfitting em modelos de machine learning?',
        'o que é underfitting e como evitar?',
        'o que são dados de treino, validação e teste?',
        'o que é um modelo supervisionado?',
        // 'qual a diferença entre aprendizado supervisionado e não supervisionado?',
        // 'o que são features em um modelo de machine learning?',
        // 'o que é um dataset e como preparar um?',
        // 'o que é normalização de dados?',
        // 'o que é uma função de perda (loss function)?',
    ]

    const ai = new AI({
        nlpModel,
        debuglog: console.log,
        vectorStore: _neo4jVectorStore,
        promptConfig: CONFIG.promptConfig,
        templateText: CONFIG.templateText,
        topK: CONFIG.similarity.topK
    })

    await mkdir(CONFIG.output.answerFolder, { recursive: true })

    for (const [index, question] of questions.entries()) {
        // console.log(`\n${'='.repeat(80)}`)
        // console.log(`🚨  =>  PERGUNTA: ${question} \n`)
        // // console.log(`\n${'='.repeat(80)}`)
        const results = await ai.answerQuestions(question)
        if (results.error) {
            console.log(`❌ ${results.error}`)
            continue
        }
        if (!results.answer) {
            console.log(`❌ resposta vazia`)
            continue
        }

        console.log(results.answer)

        const fileName = path.join(
            CONFIG.output.answerFolder,
            `${CONFIG.output.fileName}-${index}-${Date.now()}.md`
        )
        await writeFile(fileName, results.answer, 'utf-8')
    }

    // const results = await _neo4jVectorStore.similaritySearch(question, CONFIG.similarity.topK)
    // displayResults(results)
}
catch (error) {
    console.log(error)
} finally {
    // 6) Encerramento:
    // Fecha o driver do Neo4j para evitar conexões abertas/processo “pendurado”.
    _neo4jVectorStore?.close()
}
