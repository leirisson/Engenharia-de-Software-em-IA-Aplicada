# Implementation Tasks
- RED: escrever testes Vitest para appendMessage e getHistory
- definir modelo Message { id, sessionId, role, text, timestamp }
- implementar repositório in-memory de mensagens
- service de append e leitura de histórico
- endpoints REST de envio e histórico
- testes de validação de entrada, ordenação e limites de tamanho
- definir Zod MessageInputSchema { sessionId, text } e aplicar na camada de interface
- GREEN: implementar mínimo para passar nos testes
- REFACTOR: limpar código mantendo testes verdes
