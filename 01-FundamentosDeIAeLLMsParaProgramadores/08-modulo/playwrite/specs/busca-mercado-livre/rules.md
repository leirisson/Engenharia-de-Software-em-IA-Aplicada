# Business Rules
- Preferir resultados orgânicos; anúncios podem ser incluídos com sinalização (flag).
- Deduplicar links por produto (normalizar URLs).
- Limitar quantidade de itens por execução (ex.: 20).

# Validation Rules
- URL de busca deve ser construída corretamente (encoding adequado do termo).
- Verificar presença do contêiner de resultados antes da extração (ex.: ol.ui-search-layout).
- Validar que cada link coletado é absoluto e válido (http/https). 
