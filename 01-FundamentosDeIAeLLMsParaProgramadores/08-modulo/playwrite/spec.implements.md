# Automação de Busca no Mercado Livre com Intervalo de Preço

## Visão Geral

- Objetivo: permitir que o usuário informe o nome do produto e um intervalo de preço (mínimo/máximo) para buscar no Mercado Livre e retornar os melhores resultados conforme critérios definidos.
- Abrangência: coleta, extração de detalhes, filtragem por preço, ranking e persistência opcional em Google Sheets.
- Referência de fluxo: ver [docs.go.md](../playwrite/prompts/docs.go.md).

## Entradas

- produto: texto com o nome do item a buscar (ex.: “notebook”, “monitor 27”).
- preco_min: valor mínimo aceitável (>= 0).
- preco_max: valor máximo aceitável (>= preco_min).
- top_n: quantidade de resultados finais (padrão 10).
- salvar_planilha: booleano para habilitar escrita em Google Sheets (padrão true).
- planilha_url: URL de planilha, quando salvar_planilha = true.
- sheet_name: nome/aba alvo, opcional; se não informado, usa a aba ativa.

## Saídas

- Lista de itens no formato:
  - produto
  - preco (texto original)
  - preco_num (valor normalizado)
  - link (absoluto)
  - vendedor (nome)
  - vendedor_tipo (ex.: “Loja oficial” quando detectável)
  - descricao (resumo, truncado para 400 caracteres)
  - data (timestamp YYYY-MM-DD HH:mm:ss)
  - fonte (ex.: “Mercado Livre”)
  - pagina_origem (URL da busca)

## Fluxo de Execução

- Entrada: coletar produto, preco_min, preco_max, top_n e parâmetros de planilha.
- Busca: construir a URL de pesquisa com o termo informado e carregar resultados.
- Coleta inicial: extrair links únicos de produtos e metadados básicos (nome, preço).
- Detalhes: abrir cada produto e extrair vendedor e descrição, com seletores robustos.
- Normalização: converter preço textual para número (preco_num).
- Filtro: aplicar intervalo [preco_min, preco_max], excluindo “N/A”.
- Ranking: ordenar por menor preço, priorizando lojas oficiais; selecionar top_n.
- Persistência: inserir resultados na planilha com cabeçalhos e timestamp.
- Evidência: registrar métricas e, se possível, capturas de tela de busca e planilha.

## Módulos

- Entrada do Usuário: parâmetros e validações.
- Busca Mercado Livre: navegação e paginação básica.
- Extração de Produtos: parsing de cards e páginas de produto.
- Filtros de Preço: normalização e aplicação de intervalo.
- Ranking e Seleção: ordenação e priorização.
- Integração com Planilhas: escrita em Google Sheets.

## Regras de Negócio

- Intervalo inclusivo: preco_min <= preco_num <= preco_max.
- Itens sem preço (“N/A”) não devem ser considerados por padrão.
- Deduplicar produtos por link absoluto.
- Preferir lojas oficiais quando identificável (impacta ranking).
- Limitar itens por execução (padrão 20 coletados, 10 finais).

## Regras de Validação

- produto com pelo menos 3 caracteres.
- preco_min >= 0 e preco_max >= preco_min.
- top_n > 0 e <= quantidade filtrada.
- link deve ser absoluto (http/https) e válido.
- preco_num deve ser numérico após normalização.

## Tarefas de Implementação

- Entrada
  - ler parâmetros produto, preco_min, preco_max, top_n, salvar_planilha, planilha_url, sheet_name
  - validar parâmetros e fornecer mensagens claras de erro
  - persistir parâmetros em memória de execução
- Busca e Coleta
  - construir URL de busca com o termo do usuário (encoding apropriado)
  - carregar página e aguardar contêiner de resultados (ex.: ol.ui-search-layout)
  - extrair âncoras com padrões (/MLB, /p/MLB) e coletar nome/preço do card
  - deduplicar links, limitar N itens brutos (ex.: 20)
- Detalhes por Produto
  - abrir cada link e extrair campos: nome completo, preço atualizado, vendedor, descrição
  - aplicar fallback entre variantes de seletores
  - truncar descrição a 400 caracteres
- Normalização e Filtros
  - converter preço textual (“R$ 1.234,56”) em preco_num (ex.: 1234.56)
  - excluir itens sem preço válido e aplicar intervalo min/max
- Ranking e Seleção
  - enriquecer itens com flags (ex.: vendedor_tipo = “Loja oficial” quando detectável)
  - ordenar por preco_num ascendente; em empates, priorizar loja oficial e ordem de coleta
  - selecionar top_n
- Integração com Planilhas
  - garantir cabeçalhos: produto, preco, preco_num, link, vendedor, data, descricao
  - inserir linhas de A2 em diante, respeitando colunas e timestamp
  - opcional: evitar duplicatas por link na planilha (consulta prévia)
- Observabilidade
  - registrar métricas (tempo total, itens coletados/filtrados/gravados)
  - salvar evidências (ex.: screenshot da busca e da planilha após inserção)

## Estrutura de Dados (Registro)

- produto: string
- preco: string
- preco_num: number
- link: string
- vendedor: string
- vendedor_tipo: string | null
- descricao: string
- data: string (YYYY-MM-DD HH:mm:ss)
- fonte: string (“Mercado Livre”)
- pagina_origem: string

## Seletores e Extração

- Cards de resultado (lista):
  - contêiner: ol.ui-search-layout, .ui-search
  - título: h2, .poly-item__title, .ui-search-item__title
  - preço: .price-tag-fraction, .andes-money-amount__fraction
  - centavos: .price-tag-cents, .andes-money-amount__cents
  - símbolo: .price-tag-symbol, .andes-money-symbol
- Página de produto (detalhes):
  - título: h1.ui-pdp-title, h1
  - preço: .andes-money-amount__fraction, .price-tag-fraction
  - centavos: .andes-money-amount__cents, .price-tag-cents
  - símbolo: .andes-money-symbol, .price-tag-symbol
  - vendedor: a.ui-pdp-seller__nickname, .ui-pdp-seller__name, [data-testid="store-name"], .seller-info__nickname, .ui-pdp-seller__header__title
  - descrição: .ui-pdp-description__content, .ui-pdp-description, [data-testid="description"], #description

## Ranking e Seleção

- Ordenação padrão por preco_num ascendente.
- Empates resolvidos por prioridade:
  - loja oficial > maior reputação (quando disponível) > ordem de coleta.
- Retorno: top_n itens finalizados.

## Integração com Google Sheets

- Cabeçalhos exigidos: produto, preco, preco_num, link, vendedor, data, descricao.
- Timestamp em formato YYYY-MM-DD HH:mm:ss.
- Inserção sequencial em A2, com tabs e quebras de linha quando via automação web.
- Evitar duplicatas por link (opcional, via busca prévia na planilha).

## Observabilidade e Evidências

- Logs: quantidade coletada, filtrada, gravada; tempo total; erros de seletor.
- Evidências: prints da página de resultados e da planilha após a escrita.
- Sinalização de itens descartados (ex.: “N/A”, fora do intervalo).

## Critérios de Aceite

- Aceita parâmetros válidos e rejeita inválidos com feedback.
- Retorna pelo menos top_n itens dentro do intervalo quando disponíveis.
- Deduplicação por link garantida na lista final.
- Escreve na planilha com cabeçalhos e timestamp.

## Riscos e Mitigações

- Variações de DOM: usar seletores múltiplos/fallback e esperas curtas.
- Navegação instável: aguardar domcontentloaded e aplicar pequenos timeouts.
- Itens não-relacionados: filtrar por título contendo o termo do produto.
- Limitação de preço: normalizar corretamente formatos “R$” e separadores.

## Configuração e Parametrização

- Parâmetros em JSON/YAML ou coletados via prompt/CLI.
- Defaults: top_n = 10; salvar_planilha = true.
- planilha_url pode ser fixa no ambiente do operador e alterada sob demanda.

## Plano de Testes

- Caso 1: produto “notebook”, preco_min = 2000, preco_max = 6000, top_n = 10 → 10 itens válidos gravados.
- Caso 2: produto “monitor 27”, faixa estreita (ex.: 800–900) → poucos itens; valida comportamento de retorno.
- Caso 3: preços “N/A” e valores fora do intervalo → itens excluídos corretamente.
- Caso 4: duplicatas de link → deduplicação funcionando.
- Caso 5: escrita em planilha com cabeçalhos ausentes → criação/validação de cabeçalhos.

## Organização Recomendada de Specs

- specs/entrada-usuario/ { spec.md, rules.md, tasks.md }
- specs/busca-mercado-livre/ { spec.md, rules.md, tasks.md }
- specs/extracao-produtos/ { spec.md, rules.md, tasks.md }
- specs/filtros-preco/ { spec.md, rules.md, tasks.md }
- specs/ranking-selecao/ { spec.md, rules.md, tasks.md }
- specs/integracao-sheets/ { spec.md, rules.md, tasks.md }

## Execução Operacional (Resumo)

- Coletar parâmetros do usuário (produto, min, max, top_n, planilha).
- Rodar busca e coletar até 20 links únicos.
- Extrair detalhes, normalizar preço e aplicar filtros min/max.
- Ordenar, selecionar top_n e (opcionalmente) gravar na planilha.
- Registrar evidências e métricas.

