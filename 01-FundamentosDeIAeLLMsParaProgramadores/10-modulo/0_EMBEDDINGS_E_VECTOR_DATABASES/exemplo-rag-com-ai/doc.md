# Exemplo RAG com Embeddings + Neo4j (Aula)

Pasta do projeto:
`01-FundamentosDeIAeLLMsParaProgramadores/10-modulo/0_EMBEDDINGS_E_VECTOR_DATABASES/exemplo-rag-com-ai`

Este projeto demonstra, na prática, o pipeline clássico de RAG:

1. Carregar um documento (PDF)
2. Quebrar o texto em chunks
3. Gerar embeddings para cada chunk
4. Persistir embeddings em um Vector Store (Neo4j)
5. Consultar por similaridade (topK)
6. Montar um prompt com contexto recuperado e pedir a um LLM para responder

Atualmente, o pipeline já executa o fluxo completo de RAG: carrega e “splita” o PDF, grava embeddings no Neo4j, recupera os topK trechos por similaridade e chama um LLM (via OpenRouter) para gerar a resposta usando um template de prompt.

## Pré-requisitos

- Node.js (o `package.json` indica `v22.13.1`)
- Docker + Docker Compose (para subir o Neo4j)
- Uma chave do OpenRouter (para o LLM) e um modelo de embeddings para o Transformers.js

## Visão rápida da estrutura

- `src/index.ts`: orquestra o fluxo (ingestão → embeddings → Neo4j → perguntas)
- `src/config.ts`: centraliza configurações e lê `.env` + prompts
- `src/documentProcessor.ts`: carrega `tensores.pdf` e faz split em chunks
- `src/ai.ts`: “casca” da cadeia RAG (recuperação + geração)
- `src/prompts/answerPrompt.json`: regras/metadata do prompt (role, task, constraints)
- `src/prompts/template.txt`: template do prompt que será preenchido
- `docker-compose.yml`: infraestrutura local do Neo4j
- `tensores.pdf`: documento de entrada para ingestão

## Passo a passo para rodar

### 1) Instalar dependências

Na raiz do projeto (`exemplo-rag-com-ai`):

```bash
npm ci
```

### 2) Subir a infraestrutura (Neo4j)

```bash
npm run infra:up
```

O `docker-compose.yml` sobe:

- Neo4j Browser: http://localhost:7474
- Bolt (driver): bolt://localhost:7687
- Credenciais padrão do compose: `neo4j/password`

### 3) Criar o arquivo `.env`

O start usa `node --env-file .env`, então o projeto espera um `.env` na raiz.

Exemplo de `.env` mínimo:

```bash
# Neo4j (bate com docker-compose.yml por padrão)
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password

# Embeddings (Transformers.js / Xenova)
EMBEDDING_MODEL=Xenova/all-MiniLM-L6-v2

# LLM via OpenRouter
OPENROUTER_API_KEY=SEU_TOKEN_AQUI
NLP_MODEL=openai/gpt-4o-mini

# Recomendado pelo OpenRouter para identificação do app
OPENROUTER_SITE_URL=http://localhost
OPENROUTER_SITE_NAME=exemplo-rag-com-ai
```

Observações:

- Você pode trocar `EMBEDDING_MODEL` por outro modelo suportado pelo Transformers.js.
- Você pode trocar `NLP_MODEL` por qualquer modelo disponível no OpenRouter.

### 4) Rodar o projeto

```bash
npm run start
```

Ao executar, o projeto também salva as respostas geradas em arquivos Markdown dentro da pasta `./respostas` (configurada em `src/config.ts`).

Modo “watch”:

```bash
npm run dev
```

### 5) Derrubar a infraestrutura (opcional)

```bash
npm run infra:down
```

## O que acontece por baixo dos panos (fluxo do código)

### Passo A — Configuração e prompts

Em `src/config.ts`:

- Lê `src/prompts/answerPrompt.json` (JSON com role/task/instructions/constraints)
- Lê `src/prompts/template.txt` (template de prompt com placeholders)
- Lê variáveis do `.env` (Neo4j, OpenRouter, embeddings)
- Define parâmetros do split (`chunkSize`, `chunkOverlap`) e do topK

Arquivos:

- `src/prompts/answerPrompt.json`
- `src/prompts/template.txt`

### Passo B — Ingestão do PDF e split em chunks

Em `src/documentProcessor.ts`:

1. `PDFLoader` carrega o PDF em uma lista de `Document` (LangChain)
2. `RecursiveCharacterTextSplitter` divide os textos em chunks, respeitando:
   - `chunkSize` (tamanho alvo do chunk)
   - `chunkOverlap` (quantidade de sobreposição entre chunks)

O console mostra algo como:

- `✂️ - cortado em N chunks`

### Passo C — Gerar embeddings

Em `src/index.ts`:

- Cria `HuggingFaceTransformersEmbeddings`
  - `model`: vem de `EMBEDDING_MODEL`
  - `pretrainedOptions`: no projeto está configurado com `dtype: fp32`

No início do arquivo, define um cache curto para o Transformers.js:

- `env.cacheDir = os.tmpdir()/hf-transformers-cache`

Isso ajuda bastante no Windows por causa de caminhos longos de cache.

### Passo D — Criar/usar Vector Store no Neo4j

Ainda em `src/index.ts`:

1. Conecta no Neo4j com `Neo4jVectorStore.fromExistingGraph(embeddings, CONFIG.neo4j)`
2. Limpa os nós antigos do label configurado (por padrão `Chunk`)
3. Para cada chunk, grava no Neo4j via `_neo4jVectorStore.addDocuments([document])`

Logs típicos:

- `clearing all nodes from neo4j vector store`
- `✅ Adicinando documento 1/N ...`

### Passo E — Perguntas e recuperação por similaridade

O `src/index.ts` define um array de perguntas e chama:

- `ai.answerQuestions(question)`

O objetivo do `AI` (`src/ai.ts`) é montar uma cadeia com 2 etapas:

1. `retriveVectorSearchResult`: buscar no Neo4j os topK chunks mais similares à pergunta
2. `generateNLPResponse`: preencher o template com `{role, task, instructions, question, context...}` e chamar o LLM

Situação atual:

- A etapa de recuperação já roda via `RunnableSequence` e usa `similaritySearchWithScore`, retornando `topScore` e um `context` concatenado a partir dos chunks mais relevantes.
- A etapa `generateNLPResponse` monta um `ChatPromptTemplate` a partir de `src/prompts/template.txt`, chama o modelo (`ChatOpenAI` via OpenRouter) e faz parse para string com `StringOutputParser`.
- As chaves passadas no `.invoke(...)` precisam bater com os placeholders do template. No template atual (`src/prompts/template.txt`) os placeholders usados são `{role}`, `{task}`, `{tone}`, `{language}`, `{format}`, `{instructions}`, `{question}`, `{context}`.
- A resposta final é retornada como string em `answer` e também é salva em arquivo em `./respostas`.

## Checklist de troubleshooting

- Erro de conexão com Neo4j:
  - Confirme `npm run infra:up`
  - Confirme `NEO4J_URI`, `NEO4J_USER`, `NEO4J_PASSWORD`
  - Confirme portas `7474/7687` livres
- Embeddings falhando no Windows:
  - Esse projeto já reduz o cache via `env.cacheDir` em `src/index.ts`
- LLM não responde:
  - Confirme `OPENROUTER_API_KEY` e `NLP_MODEL`
  - Confirme `OPENROUTER_SITE_URL` e `OPENROUTER_SITE_NAME` (headers)
  - Confirme se as variáveis do template (`src/prompts/template.txt`) batem com as chaves passadas no `.invoke(...)` do `src/ai.ts`
  - Se aparecer `401 User not found`, a causa mais comum é `OPENROUTER_API_KEY` inválida/ausente (ou o `NLP_MODEL` não existe para sua conta)
