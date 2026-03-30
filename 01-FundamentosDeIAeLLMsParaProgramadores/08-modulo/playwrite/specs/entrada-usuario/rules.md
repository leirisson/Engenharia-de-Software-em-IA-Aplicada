# Business Rules
- O produto deve identificar claramente o item (ex.: “notebook”, “monitor 27”).
- Preço mínimo e máximo orientam os filtros de resultados.
- Parâmetros opcionais: top_n (quantidade final de resultados), salvar_planilha (booleano), planilha_url e sheet_name quando salvar_planilha = true.

# Validation Rules
- preco_min >= 0
- preco_max >= preco_min
- produto com pelo menos 3 caracteres
- top_n > 0
