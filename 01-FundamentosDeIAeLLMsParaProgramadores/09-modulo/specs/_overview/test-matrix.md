# Matriz de Testes (Vitest + Zod)
- Padrão: Red → Green → Refactor obrigatório em todas as features.
- Runner: Vitest com cobertura reportada; meta mínima: domain/application ≥ 75%.
- Validação: Zod em todos os DTOs (safeParse); erros 422 com issues detalhadas (path, message).
- Isolamento: testes determinísticos, sem dependência de ordem; DB reset entre casos (SQLite).

# Convenções
- Nomenclatura: <modulo>.<capacidade>.<comportamento esperado>.
- Estrutura: Given/When/Then nas descrições.
- Mocks/Fakes: repositórios Prisma, serviços NLU/moderação; evitar I/O real em unitários.

# Sessões (Session)
- createSession
  - cria sessão ativa com id único e createdAt definido
  - falha se provider de id retornar vazio (tratamento de erro)
  - estado inicial: active
- getSession
  - retorna sessão existente por id
  - 404 para id inexistente
- closeSession
  - transiciona de active → closed
  - não aceita close em sessão já closed (erro de negócio)
  - idempotência: segundo close retorna estado closed sem efeitos colaterais

# Mensagens (Message + Histórico)
- appendMessage
  - aceita role:user com text válido (1..500), trim aplicado
  - rejeita text vazio/fora dos limites (422 via Zod)
  - rejeita sessionId inexistente/closed (erro de negócio)
- getHistory
  - retorna mensagens ordenadas por timestamp ascendente
  - inclui role:bot quando presente
  - vazio quando não há mensagens
- integridade
  - timestamps crescentes; sem reordenação indevida
  - tamanho máximo respeitado e sanitização aplicada

# NLU/Intenções
- greeting
  - detecta “olá”, “oi”, “bom dia” (case-insensitive, acentuação)
- help
  - detecta “ajuda”, “como usar”, “dúvida”
- faq-basic
  - detecta termos configurados na lista de FAQ
- fallback
  - retorna fallback quando nenhum padrão casa
- robustez
  - ignora pontuações/espacos extras; normaliza texto

# Respostas
- templates
  - greeting: resposta curta e acolhedora
  - help: instruções iniciais e opções
  - faq-basic: responde com item correspondente
  - fallback: mensagem educada oferecendo ajuda
- limites
  - comprimento ≤ 300 caracteres
  - sanitização aplicada
- integração
  - registra resposta no histórico (role:bot)

# Moderação
- bloqueio
  - intercepta termos ofensivos/sensíveis (case-insensitive)
  - relata motivo e trecho identificado
- permitido
  - não bloqueia mensagens normais
- pipeline
  - aplica na entrada (user) e na saída (bot) antes de persistir/exibir

# API (Fastify)
- contratos
  - POST /chat/session: cria sessão e retorna id
  - POST /chat/message: valida body (Zod), executa pipeline NLU → moderação → resposta
  - GET /chat/history/:sessionId: valida params (Zod), retorna histórico
  - DELETE /chat/session/:sessionId: encerra sessão
- validação
  - Content-Type application/json obrigatório
  - 422 em erro de validação (lista de issues/path)
  - 404 para recursos inexistentes
- rate limit
  - respeita limite básico por sessionId (mock/fake de limiter)

# E2E (Pipeline)
- fluxo completo
  - criar sessão → enviar mensagem greeting → receber resposta → consultar histórico
  - enviar mensagem com conteúdo bloqueado → obter erro/moderação adequada
- persistência
  - verificar gravação em SQLite via Prisma (migrations aplicadas)
- resiliência
  - erros mapeados para status HTTP corretos (400/404/422/500)

# Performance/Health
- healthcheck
  - retorna 200 OK e checa conexão com DB
- latência
  - smoke test p95 local para rotas principais (não flake)

# Cobertura e Relatórios
- metas
  - domain/application ≥ 75% linhas/branches
  - interface/infrastructure ≥ 60% como base inicial
- relatórios
  - saída de cobertura integrada ao CI local (scripts npm)
