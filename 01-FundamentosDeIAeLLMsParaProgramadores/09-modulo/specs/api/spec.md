# Feature Overview
Exposição de endpoints REST simples para controlar sessões e mensagens do chatbot.

# Actors
- Cliente HTTP (front/CLI)

# Main Use Cases
- Iniciar sessão
- Enviar mensagem e obter resposta
- Consultar histórico
- Encerrar sessão

# API Endpoints (if applicable)
- POST /chat/session
- POST /chat/message
- GET /chat/history/:sessionId
- DELETE /chat/session/:sessionId
