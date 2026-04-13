# Business Rules
- JSON como formato de troca.
- Rate limit básico por sessionId (ex.: 1 req/s).
- Retornos padronizados com status e mensagem.

# Validation Rules
- Content-Type: application/json.
- sessionId obrigatório nos endpoints de mensagem/histórico/encerrar.
- Validar corpo e parâmetros antes de processar.
- Usar Zod para validar body/params/query com safeParse.
- Em caso de erro de validação, retornar 422 com lista de issues e path de campos.
