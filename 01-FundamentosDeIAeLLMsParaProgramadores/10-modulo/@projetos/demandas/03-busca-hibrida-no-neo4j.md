# Projeto — Busca híbrida (vetorial + palavras-chave) no Neo4j

## Objetivo
Implementar e comparar duas estratégias de recuperação:
- Vetorial pura (embeddings)
- Híbrida: embeddings + busca por palavras-chave/FTS (full-text search)

## Cenário
Algumas perguntas funcionam melhor com semântica (vetorial), outras exigem termos exatos (nomes, siglas, fórmulas).
Busca híbrida tende a melhorar cobertura.

## Regras/Restrições
- Mesmo corpus (PDF) e mesma lista de queries.
- Deve ser possível alternar o modo de busca via configuração/flag.

## Entregáveis
- CLI com opção `--mode vector|hybrid`.
- Comparativo simples por query: topK de cada modo e indicação do “melhor” resultado.

## Tarefas
- Ingerir o PDF e persistir os chunks no Neo4j com:
  - texto do chunk (para FTS)
  - embedding do chunk (para vetorial)
- Criar índice full-text no Neo4j para as propriedades de texto.
- Implementar modo `vector` usando `similaritySearch`.
- Implementar modo `hybrid` combinando:
  - score vetorial (similaridade)
  - score de texto (FTS)
  - uma regra de fusão (ex.: normalização + soma ponderada)
- Montar 10 queries de teste:
  - 5 semânticas (paráfrases)
  - 5 que dependem de termo exato
- Registrar resultados e concluir quando o híbrido vale a pena.

