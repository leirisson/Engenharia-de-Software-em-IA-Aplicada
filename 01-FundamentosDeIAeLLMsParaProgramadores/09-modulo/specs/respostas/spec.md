# Feature Overview
Gera respostas simples baseadas na intenção (greeting/help/faq/fallback) usando templates e regras, registrando no histórico da sessão.

# Actors
- Serviço de respostas
- Serviço de mensagens

# Main Use Cases
- Compor resposta por intenção
- Aplicar templates e pequenas variações
- Registrar resposta no histórico

# API Endpoints (if applicable)
- POST /response/generate { intent, context }
