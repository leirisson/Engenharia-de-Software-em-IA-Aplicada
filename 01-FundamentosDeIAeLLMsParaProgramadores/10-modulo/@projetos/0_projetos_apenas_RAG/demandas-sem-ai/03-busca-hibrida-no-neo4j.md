# Projeto — Busca híbrida (vetorial + palavras-chave) no Neo4j

## Objetivo
Implementar e comparar duas estratégias de recuperação:
- Vetorial pura (embeddings)
- Híbrida: embeddings + busca por palavras-chave/FTS (full-text search)

## Cenário
Em empresa, várias consultas precisam misturar “significado” com “termo exato”, por exemplo:
- “Como resolver erro HTTP 502 no gateway?” (semântica + termo exato 502)
- “Qual é o SLA do P1?” (termo exato: P1 / SLA)
- “Como reemitir NF-e?” (semântica; pode aparecer como “nota fiscal”, “NFe”, “danfe”)
- “Qual ticket menciona o cliente ACME e ‘webhook timeout’?” (entidade + termo exato)

Busca híbrida tende a melhorar cobertura porque:
- Vetorial recupera paráfrases e sinônimos
- Full-text recupera códigos, siglas, ids e nomes

## Regras/Restrições
- Mesmo corpus (multi-fonte) e mesma lista de queries.
- Deve ser possível alternar o modo de busca via configuração/flag.

## Entregáveis
- CLI com opção `--mode vector|hybrid`.
- Comparativo simples por query: topK de cada modo e indicação do “melhor” resultado.

## Tarefas
- Ingerir o corpus multi-fonte e persistir os chunks no Neo4j com:
  - texto do chunk (para FTS)
  - embedding do chunk (para vetorial)
- Persistir metadados úteis para filtros e análise:
  - `sourceType`, `sourceId`, `team`, `createdAt`, `tags[]` (quando houver)
- Criar índice full-text no Neo4j para as propriedades de texto.
- Implementar modo `vector` usando `similaritySearch`.
- Implementar modo `hybrid` combinando:
  - score vetorial (similaridade)
  - score de texto (FTS)
  - uma regra de fusão (ex.: normalização + soma ponderada)
- Montar 10 queries de teste:
  - 5 semânticas (paráfrases)
  - 5 que dependem de termo exato (siglas, códigos, ids)
- Registrar resultados e concluir quando o híbrido vale a pena.
