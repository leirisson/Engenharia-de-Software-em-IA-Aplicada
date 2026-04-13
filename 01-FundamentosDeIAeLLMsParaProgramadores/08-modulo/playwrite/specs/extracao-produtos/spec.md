# Feature Overview
Extrai campos dos cards e das páginas de produto: nome, preço, link, vendedor e descrição. Aplica seletores robustos para lidar com variações do DOM e normaliza os campos antes de retornar.

# Actors
- Robô de extração

# Main Use Cases
- Extrair nome e preço do card
- Abrir página do produto
- Extrair vendedor e descrição
- Normalizar campos (remover espaços desnecessários, truncar descrição)

# API Endpoints (if applicable)
- GET /product?url=...
- POST /product/extract { url }
