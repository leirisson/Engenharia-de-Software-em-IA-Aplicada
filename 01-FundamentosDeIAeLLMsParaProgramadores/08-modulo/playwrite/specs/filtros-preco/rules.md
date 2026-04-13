# Business Rules
- Itens com preço “N/A” são excluídos por padrão.
- Intervalo inclusivo: preco_min <= preco_num <= preco_max.
- preco_num deve ser derivado corretamente de formatos “R$” com separadores de milhar e decimais.

# Validation Rules
- Conversão de preço deve considerar localidade (ex.: vírgula como separador decimal).
- Preços negativos são inválidos.
- Validar que preco_min <= preco_max antes de filtrar.
