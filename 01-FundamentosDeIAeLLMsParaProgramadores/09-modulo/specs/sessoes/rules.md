# Business Rules
- Cada usuário pode ter 0..N sessões simultâneas.
- Sessão ativa aceita mensagens; sessão encerrada não aceita.
- Estados de sessão: active | closed.

# Validation Rules
- sessionId deve ser UUID ou identificador único válido.
- Ao encerrar, o estado muda para closed e data de encerramento é registrada.
