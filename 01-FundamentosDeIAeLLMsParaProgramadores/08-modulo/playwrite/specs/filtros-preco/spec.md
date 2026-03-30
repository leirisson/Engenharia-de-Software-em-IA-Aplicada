# Feature Overview
Aplica filtros de preço sobre os itens coletados, convertendo o preço textual em valor numérico (preco_num) e mantendo apenas os itens dentro do intervalo [preco_min, preco_max].

# Actors
- Motor de filtragem

# Main Use Cases
- Converter preço textual para número
- Aplicar intervalo min/max
- Excluir itens sem preço válido (“N/A”)

# API Endpoints (if applicable)
- POST /filter/price { items, preco_min, preco_max }
