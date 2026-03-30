# Business Rules
- Se preço não for legível, marcar como “N/A” e sinalizar o item.
- Descrição pode ser truncada para tamanho controlado (ex.: 400 caracteres).
- Título do produto deve ser preenchido; em falha, usar fallback do card.

# Validation Rules
- Seletores devem cobrir variações (andes-money-amount, price-tag, ui-pdp-title etc.).
- Link deve ser absoluto e válido (http/https).
- Remover caracteres indesejados e normalizar espaços.
