# Feature Overview
Especificação geral de arquitetura e configurações do projeto do chatbot. Define stack tecnológica, padrões de engenharia e diretrizes operacionais para escalar com segurança e qualidade.

- Stack: Node.js (LTS), TypeScript (strict), Fastify, Prisma ORM, SQLite, Zod (validação), Vitest (testes).
- Padrões: TDD, DDD, Clean Code, Clean Architecture.
- Objetivo: prover base consistente para módulos de sessões, mensagens, NLU/intenções, respostas, moderação e API.

# Actors
- Desenvolvedor
- Serviço de API (Fastify)
- Camada de Domínio (Use Cases, Entidades)
- Camada de Infraestrutura (Prisma/SQLite, log, config)

# Main Use Cases
- Bootstrap do projeto (configuração, dependências, estrutura de pastas).
- Desenvolvimento guiado por testes (TDD) com cobertura mínima estabelecida.
- Exposição de endpoints via Fastify conforme módulos definidos.
- Persistência via Prisma/SQLite com migrations controladas.
- Observabilidade básica (logs, healthcheck).

# API Endpoints (if applicable)
- Endpoints principais ficam nos módulos:
  - /chat/session (POST, GET, DELETE)
  - /chat/message (POST)
  - /chat/history/:sessionId (GET)
  - /nlu/intent (POST)
  - /response/generate (POST)
  - /moderation/check (POST)
