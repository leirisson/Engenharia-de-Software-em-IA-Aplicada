# Projeto — Laboratório de Chunking e Embeddings com fontes reais (qualidade de recuperação)

## Objetivo
Medir como configurações de chunking e escolha de embedding impactam a qualidade da busca vetorial (recuperação) no Neo4j.

## Cenário
Em empresa, o corpus não é “um PDF só”. Você vai ter mistura de:
- textos curtos (tickets, chats, e-mails)
- textos médios (notas internas, runbooks)
- textos longos (políticas, contratos exportados para texto)
- textos com estrutura (CSV com colunas, FAQ em tabela)

A qualidade do topK pode variar muito dependendo de:
- estratégia de chunking por tipo de fonte (registro vs documento longo)
- `chunkSize` e `chunkOverlap` (para documentos longos)
- modelo de embedding (dimensões e comportamento semântico)
- normalização do texto (limpeza de assinatura de e-mail, markdown, etc.)

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
- Definir 3 conjuntos fixos de queries (10 no total), cobrindo:
  - 4 queries de processo (“como pedir estorno”, “como cadastrar fornecedor”)
  - 3 queries técnicas (“erro 502”, “timeout no webhook”, “credencial inválida”)
  - 3 queries com termo exato (“SLA P1”, “ID do ticket”, “sigla interna”)
- Definir “golden answers” por fonte (quais `sourceId`/trechos são corretos), de forma manual.
- Criar uma matriz de configurações por tipo de fonte:
  - documentos longos: chunkSize 300 / 600 / 1000 e overlap 50 / 150 / 250
  - registros curtos (tickets/chats): sem chunking vs chunking mínimo (ex.: 1 chunk por registro)
  - limpeza: com/sem normalização (remoção de assinatura, markdown, etc.)
  - embeddingModel: pelo menos 2 opções
- Para cada configuração:
  - limpar dados no Neo4j (label/índice do experimento)
  - ingerir novamente o corpus multi-fonte
  - executar as 10 queries com topK fixo (ex.: 3 e 5)
  - coletar métricas e salvar resultados
- Comparar resultados e escolher a melhor configuração para o caso de uso.
