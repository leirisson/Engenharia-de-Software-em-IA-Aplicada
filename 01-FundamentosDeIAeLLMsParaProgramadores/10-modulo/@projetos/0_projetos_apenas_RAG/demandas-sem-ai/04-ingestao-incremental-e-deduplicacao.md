# Projeto — Ingestão incremental e deduplicação de chunks

## Objetivo
Evoluir o pipeline para suportar ingestão incremental (sem apagar tudo) e deduplicar chunks, permitindo atualizar o banco quando o documento muda.

## Cenário
Você quer:
- reprocessar o PDF quando ele for atualizado
- não duplicar chunks no Neo4j
- ter rastreabilidade (de qual versão do documento veio cada chunk)

## Regras/Restrições
- Evitar `DELETE` total como estratégia padrão.
- Cada chunk deve ter um identificador estável (para upsert/dedup).

## Entregáveis
- Processo de ingestão incremental que:
  - cria novos chunks quando necessário
  - atualiza chunks alterados
  - remove chunks que não existem mais (opcional)

## Tarefas
- Definir um esquema de IDs:
  - `documentId` (ex.: nome do arquivo + hash do conteúdo do PDF)
  - `chunkId` (ex.: hash do texto do chunk + número do chunk)
- Persistir metadados mínimos por chunk:
  - `documentId`, `chunkId`, `source`, `createdAt`, `chunkIndex`
- Implementar `upsert` no Neo4j:
  - se `chunkId` existe: atualizar texto/embedding se mudou
  - se não existe: criar nó e salvar embedding
- Implementar limpeza seletiva:
  - remover chunks do `documentId` antigo quando o PDF muda (opcional)
- Validar rodando ingestão 2 vezes:
  - 1ª vez: cria N chunks
  - 2ª vez: não cria duplicados e mantém N (ou atualiza apenas o necessário)

