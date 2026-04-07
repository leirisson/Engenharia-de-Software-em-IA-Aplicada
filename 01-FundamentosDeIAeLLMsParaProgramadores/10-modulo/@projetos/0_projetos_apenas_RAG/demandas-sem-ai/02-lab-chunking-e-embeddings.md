# Projeto — Laboratório de Chunking e Embeddings (qualidade de recuperação)

## Objetivo
Medir como configurações de chunking e escolha de embedding impactam a qualidade da busca vetorial (recuperação) no Neo4j.

## Cenário
Com o mesmo PDF, a qualidade do topK pode variar muito dependendo de:
- `chunkSize` e `chunkOverlap`
- modelo de embedding (dimensões e comportamento semântico)
- tipo de distância (quando aplicável)

## Regras/Restrições
- O experimento deve rodar localmente e ser reexecutável.
- O resultado precisa ser comparável entre execuções (mesma lista de queries e mesmos K).

## Entregáveis
- Um relatório em JSON ou CSV com as métricas por configuração.
- Um comando/arquivo que rode todos os experimentos automaticamente.

## Métricas sugeridas
- Recall@K (manual ou semi-automático): para cada query, se ao menos 1 chunk “correto” apareceu no topK.
- MRR@K (opcional): posição do primeiro chunk correto.
- Tempo total de ingestão e de consulta (latência média por query).

## Tarefas
- Definir um conjunto fixo de 10 queries (perguntas) sobre o PDF.
- Definir “golden answers” (quais páginas/trechos são considerados corretos) de forma manual.
- Criar uma matriz de configurações:
  - chunkSize: 300 / 600 / 1000
  - overlap: 50 / 150 / 250
  - embeddingModel: pelo menos 2 opções
- Para cada configuração:
  - limpar dados no Neo4j (label/índice do experimento)
  - ingerir novamente o PDF
  - executar as 10 queries com topK fixo (ex.: 3 e 5)
  - coletar métricas e salvar resultados
- Comparar resultados e escolher a melhor configuração para o caso de uso.

