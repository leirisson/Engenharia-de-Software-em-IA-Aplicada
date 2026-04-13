# Business Rules
- Mensagens são anexadas ao histórico em ordem temporal.
- Histórico contém mensagens do usuário e do bot (role:user|bot).
- Mensagens do bot são geradas e registradas pelo serviço de respostas.

# Validation Rules
- text obrigatório, 1..500 caracteres.
- sessionId deve existir e estar ativa.
- Normalizar texto (trim) antes de salvar.
- Validar entrada com Zod (MessageInputSchema) garantindo limites e formato.
