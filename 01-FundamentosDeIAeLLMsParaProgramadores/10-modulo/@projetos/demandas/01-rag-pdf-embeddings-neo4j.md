# Projeto — RAG com PDF + Embeddings + Neo4j

## Objetivo
Construir um pipeline completo que:
1) lê um PDF local
2) divide o texto em chunks
3) gera embeddings localmente (Transformers.js)
4) armazena e consulta embeddings no Neo4j (índice vetorial)
5) exibe os trechos mais relevantes no terminal

## Cenário
Você tem o PDF `tensores.pdf` e quer fazer uma pergunta em linguagem natural (ex.: “o que significa treinar uma rede neural?”) e recuperar os trechos mais similares usando busca vetorial.

## Regras/Restrições
- Embeddings devem ser gerados localmente (Transformers.js).
- Persistência e busca devem acontecer no Neo4j via LangChain `Neo4jVectorStore`.
- A ingestão deve ser repetível (rodar do zero sem duplicar dados).

## Entregáveis
- Script CLI que faz ingestão + consulta.
- Logs claros mostrando: quantidade de chunks, progresso de ingestão, topK resultados.
- Documentos recuperados exibindo preview e metadados relevantes (quando existirem).

## Tarefas
- Subir Neo4j via Docker Compose.
- Criar `.env` com NEO4J_URI/USER/PASSWORD e EMBEDDING_MODEL.
- Implementar carregamento do PDF com `PDFLoader`.
- Implementar split com `RecursiveCharacterTextSplitter` (chunkSize + overlap configuráveis).
- Implementar embeddings com `HuggingFaceTransformersEmbeddings`.
- Criar/usar índice vetorial no Neo4j com `Neo4jVectorStore.fromExistingGraph`.
- Implementar rotina de reset (apagar nós do label do projeto) para evitar duplicação.
- Adicionar chunks no Neo4j (`addDocuments`) com logs de progresso.
- Implementar consulta (`similaritySearch`) e exibir topK com formatação legível.
- Rodar 3 consultas diferentes e validar se os trechos retornados fazem sentido.

