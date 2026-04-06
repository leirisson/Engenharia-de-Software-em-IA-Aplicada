# Projeto — Portal Web de RAG (PDF → Neo4j → Busca Semântica)

## Visão geral
Aplicação full-stack onde o usuário faz upload de um PDF, o sistema:
1) extrai texto
2) divide em chunks
3) gera embeddings localmente
4) armazena no Neo4j
5) permite consultar via busca semântica e visualizar os trechos (com página/fonte)

## Objetivo
Treinar ingestão, embeddings, indexação vetorial e consumo via frontend com UX simples.

## Personas e fluxos
- Usuário:
  - envia PDF
  - vê status de processamento (chunks, progresso)
  - faz pergunta e recebe topK trechos

## Regras/Restrições
- Backend deve expor API REST (ou HTTP simples) para ingestão e busca.
- Embeddings devem rodar localmente (Transformers.js).
- Neo4j é o banco de vetores.
- Upload deve aceitar pelo menos 1 arquivo PDF por vez.

## Requisitos funcionais
- Upload de PDF com validação de tamanho/extensão.
- Ingestão assíncrona (retorna jobId e permite acompanhar status).
- Busca semântica com topK configurável.
- Tela de “Resultados” com:
  - trecho (preview)
  - source (arquivo)
  - página (se disponível)

## Requisitos não funcionais
- Logs úteis no backend (início/fim de ingestão, erros por etapa).
- Tratamento de erros padronizado em JSON.
- Reexecução segura: reprocessar o mesmo arquivo não pode duplicar tudo sem controle (dedup ou reset por documento).

## Backend (escopo sugerido)
### Endpoints
- `POST /api/documents`
  - upload multipart
  - resposta: `{ documentId, status: "queued" }`
- `GET /api/documents/:id`
  - resposta: `{ status, chunksTotal, chunksProcessed, error? }`
- `POST /api/search`
  - body: `{ documentId, query, topK }`
  - resposta: `{ results: [{ text, metadata, score? }] }`

### Tarefas (backend)
- Implementar upload multipart e salvar arquivo em disco (pasta temporária).
- Implementar `DocumentProcessor` (PDFLoader + splitter) preservando `pageNumber` no metadata.
- Implementar embeddings com modelo definido em `.env`.
- Implementar `Neo4jVectorStore`:
  - criação/uso de índice vetorial por documento
  - estratégia de reset ou dedup por `documentId`
- Implementar fila simples de ingestão (in-memory) com status por `documentId`.
- Implementar busca com `similaritySearch` e retorno dos topK.
- Implementar fechamento de conexões do Neo4j ao encerrar processos.

## Frontend (escopo sugerido)
### Telas
- Upload + status (barra de progresso baseada no polling do backend).
- Busca (campo de pergunta + seletor topK).
- Resultados (cards com trecho + metadados).

### Tarefas (frontend)
- Formulário de upload com validação e feedback de erro.
- Polling do status do documento até `ready` (ou falha).
- Formulário de busca e renderização do topK.
- UI para copiar trecho e destacar termos da query (opcional).

## Critérios de aceite
- Upload + ingestão funciona em PDF de exemplo.
- O status muda: queued → processing → ready.
- Busca retorna trechos coerentes e a UI exibe metadados.
- Erros (Neo4j offline, PDF inválido) aparecem de forma clara no frontend.

