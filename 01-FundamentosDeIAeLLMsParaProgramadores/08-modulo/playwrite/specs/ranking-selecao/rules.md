# Business Rules
- Padrão: ordenar por preco_num ascendente.
- Empates resolvidos por prioridade: loja oficial > reputação (se disponível) > ordem de coleta.
- top_n limita o retorno aos itens mais relevantes após ordenação.

# Validation Rules
- top_n > 0 e <= quantidade filtrada.
- Campos usados no ranking devem existir (ex.: preco_num, vendedor_tipo).
