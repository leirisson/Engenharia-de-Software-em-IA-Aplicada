# Feature Overview
Ordena os produtos por critérios definidos (preço, tipo de vendedor), devolvendo o top-N mais relevante. Padrão: menor preço com prioridade para lojas oficiais quando identificável.

# Actors
- Motor de ranking

# Main Use Cases
- Ordenar por menor preço
- Priorizar lojas oficiais
- Resolver empates
- Selecionar top-N

# API Endpoints (if applicable)
- POST /rank { items, top_n, criterios }
