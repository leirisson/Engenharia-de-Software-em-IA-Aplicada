# Feature Overview
Captura as entradas do usuário para parametrizar a busca no Mercado Livre: nome do produto e intervalo de preço mínimo e máximo. Pode incluir parâmetros adicionais como top_n, salvar em planilha e identificação da aba/planilha alvo.

# Actors
- Usuário final

# Main Use Cases
- Informar produto
- Informar preço mínimo
- Informar preço máximo
- Confirmar execução da busca
- Opcional: definir top_n e preferências de persistência (salvar_planilha, planilha_url, sheet_name)

# API Endpoints (if applicable)
- POST /input { produto, preco_min, preco_max, top_n, salvar_planilha, planilha_url, sheet_name }
- GET /input/status
