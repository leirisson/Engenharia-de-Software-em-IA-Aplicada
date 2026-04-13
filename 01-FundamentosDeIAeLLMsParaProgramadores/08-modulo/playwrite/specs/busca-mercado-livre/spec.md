# Feature Overview
Executa a busca no Mercado Livre com base nos parâmetros informados pelo usuário, navega pelos resultados e coleta links únicos de produtos relevantes.

# Actors
- Automação de busca (robô)

# Main Use Cases
- Construir URL de busca a partir do termo
- Carregar resultados iniciais
- Paginar quando necessário
- Capturar links únicos de produtos com metadados básicos

# API Endpoints (if applicable)
- GET /search?produto=...&page=...
- POST /search/run { produto, preco_min, preco_max, top_n }
