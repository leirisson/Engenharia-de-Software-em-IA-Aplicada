# Feature Overview
Recebe mensagens do usuário, valida e registra no histórico da sessão, permitindo consulta posterior.

# Actors
- Usuário
- Serviço de chat

# Main Use Cases
- Enviar mensagem
- Registrar mensagem no histórico
- Listar histórico da sessão

# API Endpoints (if applicable)
- POST /chat/message { sessionId, text }
- GET /chat/history/:sessionId
