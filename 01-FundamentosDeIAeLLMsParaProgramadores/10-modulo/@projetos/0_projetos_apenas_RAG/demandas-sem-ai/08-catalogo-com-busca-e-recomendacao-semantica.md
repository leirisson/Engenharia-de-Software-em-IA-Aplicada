# Projeto — Catálogo com Busca e Recomendação Semântica (Full-Stack)

## Visão geral
Aplicação full-stack para cadastrar itens de um catálogo (ex.: livros, cursos, produtos) e permitir:
- busca semântica (encontrar itens semelhantes por descrição)
- recomendação “itens parecidos”
- painel administrativo para CRUD

## Objetivo
Treinar:
- embeddings em dados estruturados (nome + descrição + categoria)
- “similar items” (vector-to-vector)
- experiência de busca no frontend (autocomplete, filtros, paginação simples)

## Personas e fluxos
- Admin:
  - cria/edita itens do catálogo
  - ajusta descrições e tags
- Usuário:
  - busca itens por texto livre
  - entra em um item e vê recomendações relacionadas

## Regras/Restrições
- Embeddings rodando localmente.
- Neo4j como base vetorial e também como base de relacionamento.
- Deve haver pelo menos 2 categorias e filtros no frontend.

## Requisitos funcionais
- CRUD de itens:
  - `name`, `description`, `category`, `tags[]`, `price?` (opcional)
- Busca semântica:
  - query → topK
  - filtros: categoria, tag
- Recomendações:
  - dado um `itemId`, retornar topK itens similares

## Backend (escopo sugerido)
### Endpoints
- `GET /api/items`
- `POST /api/items`
- `PUT /api/items/:id`
- `DELETE /api/items/:id`
- `POST /api/search`
  - body: `{ query, topK, category?, tag? }`
- `GET /api/items/:id/recommendations?topK=5`

### Tarefas (backend)
- Modelar `Item` no Neo4j (nó + propriedades + embedding).
- Gerar embedding no create/update:
  - texto base: `name + " - " + description + " " + tags.join(" ")`
- Implementar busca semântica com filtros de metadados.
- Implementar recomendações:
  - calcular embedding do item alvo (ou reutilizar embedding salvo)
  - rodar busca por similaridade e excluir o próprio item
- Implementar validação de payload e erros consistentes.

## Frontend (escopo sugerido)
### Telas
- Catálogo (lista + busca + filtros)
- Detalhe do item (com recomendações)
- Admin (CRUD)

### Tarefas (frontend)
- Página de lista com:
  - campo de busca
  - filtros de categoria/tag
  - renderização de resultados
- Página de detalhe com seção “recomendados para você”.
- Área admin com formulários de criação/edição e feedback de sucesso/erro.

## Critérios de aceite
- Admin cadastra 20 itens e consegue:
  - achar itens relevantes por busca semântica (mesmo com sinônimos/paráfrases)
  - ver recomendações coerentes na página de detalhe
- Filtros funcionam em conjunto com a busca.

