# Feature Overview
Valida que entradas e saídas não violam regras (conteúdo ofensivo, dados sensíveis), bloqueando e sinalizando quando necessário.

# Actors
- Serviço de moderação

# Main Use Cases
- Moderar entrada do usuário
- Moderar saída do bot antes de registrar/exibir
- Sinalizar e bloquear conteúdo proibido

# API Endpoints (if applicable)
- POST /moderation/check { text, role }
