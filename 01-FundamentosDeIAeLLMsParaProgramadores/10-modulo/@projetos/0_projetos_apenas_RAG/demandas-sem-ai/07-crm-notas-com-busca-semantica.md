# Projeto — CRM de Notas com Busca Semântica (Full-Stack)

## Visão geral
Aplicação full-stack onde um usuário cria “notas” (texto curto/ médio) e depois busca por significado usando embeddings + Neo4j.
Inclui autenticação simples e um painel (CRUD + busca).

## Objetivo
Treinar:
- CRUD tradicional (REST + UI)
- indexação vetorial para dados “nativos” (não só PDF)
- busca semântica com filtros (por tags, data, autor)

## Personas e fluxos
- Usuário autenticado:
  - cria/edita/exclui notas
  - adiciona tags
  - busca por texto (“reunião sobre orçamento”) e encontra notas relacionadas mesmo sem termos exatos

## Regras/Restrições
- Embeddings gerados localmente (Transformers.js).
- Neo4j armazena vetores + metadados.
- O sistema deve permitir filtrar busca por tag e período.

## Requisitos funcionais
- Auth (mínimo): login/logout (pode ser token simples).
- CRUD de notas:
  - `title`, `content`, `tags[]`, `createdAt`, `updatedAt`
- Busca semântica:
  - query textual → topK resultados
  - filtros: tag (opcional), intervalo de datas (opcional)
- Página de detalhe da nota.

## Backend (escopo sugerido)
### Endpoints
- `POST /api/auth/login`
- `GET /api/notes`
- `POST /api/notes`
- `PUT /api/notes/:id`
- `DELETE /api/notes/:id`
- `POST /api/notes/search`
  - body: `{ query, topK, tag?, fromDate?, toDate? }`

### Tarefas (backend)
- Implementar camada de auth simples (token em header).
- Modelar no Neo4j:
  - Nó `Note` com `title`, `content`, `tags`, timestamps
  - Propriedade de embedding (vetor)
- Ao criar/editar nota:
  - gerar embedding do conteúdo (ou title+content)
  - salvar/atualizar vetor
- Implementar busca:
  - vetorial (topK)
  - aplicar filtros de metadados no Cypher (tag/data)
- Padronizar respostas e erros em JSON.

## Frontend (escopo sugerido)
### Telas
- Login
- Lista de notas (com busca + filtros)
- Editor de nota (criar/editar)
- Detalhe da nota

### Tarefas (frontend)
- Fluxo de login com armazenamento seguro do token (storage local simples).
- CRUD completo com feedback de loading/erro.
- UI de busca semântica:
  - campo de query
  - topK
  - filtros de tag e datas
- Exibir resultados com destaque de tags e data.

## Critérios de aceite
- Usuário consegue criar 10 notas e encontrar notas relacionadas via busca semântica.
- Editar nota atualiza embedding e altera resultados de busca.
- Filtros (tag/data) reduzem resultados corretamente.

