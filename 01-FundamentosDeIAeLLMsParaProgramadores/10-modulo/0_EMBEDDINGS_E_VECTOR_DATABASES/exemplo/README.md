# Exemplo — Embeddings + Neo4j (Vector Database)

Este diretório é uma base de projeto (template) para demonstrar o pipeline de:

1) carregar um PDF (`tensores.pdf`)
2) dividir o texto em “chunks”
3) gerar embeddings
4) armazenar e consultar esses embeddings em um Neo4j (índice vetorial)

Atualmente, esta base contém a infraestrutura (Neo4j), configuração e utilitários; o arquivo de entrada principal (`src/index.ts`) está vazio e serve como ponto de integração do pipeline.

## Estrutura

- `docker-compose.yml`: sobe um Neo4j Community com o plugin APOC habilitado.
- `package.json`: scripts de execução e dependências (LangChain, HuggingFace, Neo4j driver, parser de PDF).
- `src/config.ts`: configurações centralizadas (Neo4j, PDF, splitter, embedding e parâmetros de similaridade).
- `src/util.ts`: utilitário para exibir resultados (lista trechos e página quando disponível).
- `src/index.ts`: ponto de entrada (no momento, arquivo vazio).
- `tensores.pdf`: documento exemplo para ingestão.
- `script.txt`: checklist/roteiro de estudo do que implementar/validar no pipeline.

## Como rodar a infraestrutura (Neo4j)

1) Instale as dependências:

```bash
npm ci
```

2) Suba o Neo4j via Docker:

```bash
npm run infra:up
```

3) Acesse o Neo4j Browser:

- http://localhost:7474
- Usuário/senha padrão do `docker-compose.yml`: `neo4j` / `password`

4) Para desligar e remover volumes:

```bash
npm run infra:down
```

## Como o projeto executa TypeScript

Os scripts `start` e `dev` usam o Node.js (v22.x) com:

- `--experimental-strip-types`: executa arquivos `.ts` sem “build” (não gera `dist/`).
- `--env-file .env`: carrega variáveis de ambiente de um arquivo `.env` local.

Exemplo:

```bash
npm run dev
```

Observação: este diretório não inclui um `.env` pronto; você precisa criar o seu com as variáveis listadas abaixo.

## Configuração (src/config.ts)

O arquivo [config.ts](file:///c:/Users/leiri/Documents/GitHub/Engenharia-de-Software-em-IA-Aplicada/01-FundamentosDeIAeLLMsParaProgramadores/10-modulo/0_EMBEDDINGS_E_VECTOR_DATABASES/exemplo/src/config.ts) concentra os parâmetros do pipeline:

- **Neo4j**
  - `NEO4J_URI`: URL Bolt (ex.: `bolt://localhost:7687`)
  - `NEO4J_USER`: usuário (ex.: `neo4j`)
  - `NEO4J_PASSWORD`: senha (ex.: `password`)
  - `indexName`: nome do índice vetorial (padrão: `tensors_index`)
  - `nodeLabel`: rótulo do nó a persistir (padrão: `Chunk`)
  - `textNodeProperties`: propriedades com texto (padrão: `["text"]`)

- **PDF**
  - `pdf.path`: caminho do PDF a ingerir (padrão `./tensores.pdf`)

- **Text Splitter**
  - `chunkSize`: tamanho alvo do trecho (padrão `1000`)
  - `chunkOverlap`: sobreposição entre trechos (padrão `200`)

- **Embeddings**
  - `EMBEDDING_MODEL`: nome do modelo de embeddings
  - `pretrainedOptions.dtype`: precisão (`fp32`, `fp16`, quantizados etc.)

- **Similaridade**
  - `topK`: quantidade de trechos retornados numa busca (padrão `3`)

- **OpenRouter (opcional)**
  - `OPENROUTER_API_KEY`, `OPENROUTER_SITE_URL`, `OPENROUTER_SITE_NAME`, `NLP_MODEL`
  - Esta seção está preparada para uso de um modelo de linguagem via OpenRouter, mas não há integração pronta nesta base.

## Variáveis de ambiente esperadas (.env)

Crie um arquivo `.env` na raiz deste diretório com, no mínimo:

```bash
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password
EMBEDDING_MODEL=<nome-do-modelo>
```

Se for usar OpenRouter (somente quando o pipeline integrar isso):

```bash
OPENROUTER_API_KEY=...
OPENROUTER_SITE_URL=...
OPENROUTER_SITE_NAME=...
NLP_MODEL=...
```

## Utilitário de saída (src/util.ts)

O [util.ts](file:///c:/Users/leiri/Documents/GitHub/Engenharia-de-Software-em-IA-Aplicada/01-FundamentosDeIAeLLMsParaProgramadores/10-modulo/0_EMBEDDINGS_E_VECTOR_DATABASES/exemplo/src/util.ts) exporta `displayResults(results)`, que:

- imprime quantos trechos foram encontrados
- mostra um preview do texto (até 200 caracteres por padrão)
- se existir `metadata.pageNumber`, exibe a página do PDF

Isso é útil ao validar uma busca vetorial (topK) e inspecionar rapidamente a qualidade dos chunks retornados.

## Estado atual e próximos passos

- O arquivo [index.ts](file:///c:/Users/leiri/Documents/GitHub/Engenharia-de-Software-em-IA-Aplicada/01-FundamentosDeIAeLLMsParaProgramadores/10-modulo/0_EMBEDDINGS_E_VECTOR_DATABASES/exemplo/src/index.ts) está vazio: esta base ainda não implementa a ingestão do PDF, geração de embeddings e persistência/consulta no Neo4j.
- O roteiro do que implementar está descrito em [script.txt](file:///c:/Users/leiri/Documents/GitHub/Engenharia-de-Software-em-IA-Aplicada/01-FundamentosDeIAeLLMsParaProgramadores/10-modulo/0_EMBEDDINGS_E_VECTOR_DATABASES/exemplo/script.txt): `documentProcessor`, visualização de embeddings, `VectorStoreManager` (`addDocuments`, `clearAll`) e a integração final no `index.ts`.

