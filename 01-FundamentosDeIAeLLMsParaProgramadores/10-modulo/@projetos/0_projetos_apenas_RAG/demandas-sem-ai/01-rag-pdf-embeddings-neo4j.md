# Projeto — RAG multi-fonte (dados reais de empresa) + Embeddings + Neo4j

## Objetivo
Construir um pipeline completo que:
1) ingere conteúdos de fontes diferentes (simulando sistemas de empresa)
2) normaliza tudo em `Document`s com metadados úteis
3) divide textos longos em chunks quando necessário
4) gera embeddings localmente (Transformers.js)
5) armazena e consulta embeddings no Neo4j (índice vetorial)
6) exibe os trechos mais relevantes no terminal

## Cenário
Você precisa responder perguntas internas como:
- “Qual é o procedimento quando o cliente pede estorno?”
- “O que fazer quando aparece o erro 502 no gateway?”
- “Quais campos são obrigatórios no cadastro de fornecedor?”

Só que o conhecimento está espalhado em fontes diferentes, por exemplo:
- Base de conhecimento (artigos em Markdown/HTML exportados do Confluence)
- Tickets de suporte (CSV/JSON exportado do Jira/Zendesk)
- Políticas internas (PDF ou DOCX convertido para texto)

O objetivo do RAG aqui é recuperar os trechos mais relevantes usando busca vetorial e apresentar no terminal (sem IA geradora).

## Regras/Restrições
- Embeddings devem ser gerados localmente (Transformers.js).
- Persistência e busca devem acontecer no Neo4j via LangChain `Neo4jVectorStore`.
- A ingestão deve ser repetível (rodar do zero sem duplicar dados).
- Metadados devem permitir rastrear a origem: `sourceType`, `sourceId`, `sourcePath` (quando houver), `createdAt` (quando houver).
- Evitar dados sensíveis reais: use amostras fictícias (mas com formato realista).

## Entregáveis
- Script CLI que faz ingestão + consulta.
- Logs claros mostrando: quantidade de itens ingeridos por fonte, quantidade de chunks, progresso de ingestão, topK resultados.
- Resultados exibindo preview + metadados de origem (tipo, id, data, tags).

## Tarefas
- Subir Neo4j via Docker Compose.
- Criar `.env` com NEO4J_URI/USER/PASSWORD e EMBEDDING_MODEL.
- Criar uma pasta `./data` com 3 fontes simuladas:
  - `kb/*.md` (artigos de base de conhecimento)
  - `tickets.csv` (tickets com `id`, `subject`, `description`, `tags`, `createdAt`)
  - `policies/*.txt` (políticas internas em texto)
- Implementar carregadores por fonte (ex.: ler MD/TXT, parse CSV) e mapear para `Document` com metadata consistente.
- Implementar split com `RecursiveCharacterTextSplitter` somente para textos longos (policies/kb), mantendo tickets como “1 registro = 1 doc” (ou chunking mínimo).
- Implementar embeddings com `HuggingFaceTransformersEmbeddings`.
- Criar/usar índice vetorial no Neo4j com `Neo4jVectorStore.fromExistingGraph`.
- Implementar rotina de reset (apagar nós do label do projeto) para evitar duplicação.
- Adicionar chunks no Neo4j (`addDocuments`) com logs de progresso.
- Implementar consulta (`similaritySearchWithScore`) e exibir topK com formatação legível (texto + score + metadata).
- Rodar 6 consultas diferentes (misturando processos, erros técnicos e regras de cadastro) e validar se os trechos retornados fazem sentido.
