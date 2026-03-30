# Business Rules
- Cabeçalhos exigidos: produto, preco, preco_num, link, vendedor, data, descricao.
- Timestamp em formato YYYY-MM-DD HH:mm:ss.
- Evitar duplicatas por link quando habilitado.

# Validation Rules
- Link único por linha (não inserir duplicata).
- preco_num deve ser numérico após normalização.
- Validar planilha_url e sheet_name quando salvar_planilha estiver habilitado.
