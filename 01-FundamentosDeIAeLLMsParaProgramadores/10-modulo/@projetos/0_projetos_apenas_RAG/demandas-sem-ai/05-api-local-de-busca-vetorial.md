# Projeto — API local de busca vetorial (ingestão + search)

## Objetivo
Criar um serviço local que expõe endpoints HTTP para:
- iniciar ingestão (PDF -> chunks -> embeddings -> Neo4j)
- consultar a base via busca vetorial (topK)

## Cenário
Em vez de rodar tudo no terminal, você quer um serviço que possa ser consumido por qualquer cliente (frontend, Postman, outro script).

## Regras/Restrições
- Não precisa de framework web; pode usar `node:http` (para treinar fundamentos).
- Deve validar entrada e retornar erros claros em JSON.

## Endpoints sugeridos
- `POST /ingest`
  - body: `{ "pdfPath": "./tensores.pdf", "reset": true }`
  - resposta: `{ "chunks": 123, "status": "ok" }`
- `POST /search`
  - body: `{ "query": "…", "topK": 3 }`
  - resposta: `{ "results": [{ "text": "...", "score": "...", "metadata": {...} }] }`

## Entregáveis
- Servidor HTTP rodando localmente com documentação mínima de como chamar endpoints.
- Respostas consistentes e logs úteis.

## Tarefas
- Criar servidor HTTP com roteamento básico (`/ingest`, `/search`).
- Implementar parser de JSON do request body com tratamento de erros.
- Conectar a mesma lógica do pipeline:
  - ingestão (com opção de reset)
  - consulta por similaridade no Neo4j
- Padronizar resposta em JSON:
  - `status`, `data`, `error`
- Adicionar 5 casos de teste manual (curl/Postman) e validar:
  - ingestão funciona
  - busca retorna topK
  - erro de body inválido é tratado
  - erro de Neo4j indisponível é tratado
  - query vazia é rejeitada

