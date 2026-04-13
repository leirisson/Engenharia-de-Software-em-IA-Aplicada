# Tutorial — Passo a passo (AI Knowledge Base: Embeddings + Neo4j)

Objetivo do exercício: montar um pipeline que pega uma fonte de dados (PDF neste projeto), quebra em chunks, gera embeddings localmente e salva/consulta no Neo4j usando o `Neo4jVectorStore` (LangChain). No final, você faz perguntas e vê os topK trechos mais relevantes no terminal.

## Checklist do que já foi feito

[✅] Criada a pasta `passo-a-passo/` e este arquivo `tutorial.md` com roteiro completo  
[✅] Implementado `DocumentProcessor` com `fs/promises` (leitura linha-a-linha de CSV)  
[✅] Geração de chunks com `RecursiveCharacterTextSplitter` usando `CONFIG.textSplitter`  
[✅] Metadados por chunk: `sourceType`, `file`, `rowIndex`, `chunkIndex`  
[✅] IDs estáveis por chunk: `chunkId` (sha256) e `contentHash` para deduplicação  
[✅] Ingestão incremental (upsert) no `src/index.ts`:
- constraint única em `chunkId`
- consulta dos `contentHash` existentes
- cálculo de embeddings só do que mudou
- `MERGE` com atualização seletiva via Cypher
[✅] Removida dependência de “apagar tudo sempre”; sem duplicar dados nas re-execuções  
[✅] Entrada de pergunta dinâmica via `readline-sync` e busca com `similaritySearch`  
[✅] Logs de progresso na ingestão e na atualização incremental  
## Resumo final

O projeto passou a ingerir os CSVs gerando chunks com IDs estáveis e fazer upsert incremental no Neo4j. Assim, rodar o pipeline novamente não apaga tudo nem duplica dados: apenas chunks novos ou alterados têm embeddings recalculados e são atualizados no banco.
