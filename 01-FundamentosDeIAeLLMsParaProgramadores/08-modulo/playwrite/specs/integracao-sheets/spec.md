# Feature Overview
Grava os resultados da busca e seleção em Google Sheets com cabeçalhos padronizados, timestamp e opção de evitar duplicatas por link.

# Actors
- Robô de planilhas

# Main Use Cases
- Criar/validar cabeçalhos
- Inserir linhas com dados normalizados
- Evitar duplicatas pelo link (opcional)
- Confirmar contagem de inserções

# API Endpoints (if applicable)
- POST /sheets/write { rows, planilha_url, sheet_name }
- GET /sheets/health
