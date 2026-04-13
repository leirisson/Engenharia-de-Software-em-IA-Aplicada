# Feature Overview
Classifica a intenção básica de uma mensagem (saudação, ajuda, faq simples, fallback) usando regras e pattern matching.

# Actors
- Serviço de NLU
- Serviço de respostas

# Main Use Cases
- Detectar intenção a partir do texto
- Retornar rótulo de intenção para o pipeline de resposta

# API Endpoints (if applicable)
- POST /nlu/intent { text }
