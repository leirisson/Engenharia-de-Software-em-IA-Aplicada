# Carregamento do modelo no Worker (loadModelAndLabels)

## 1) Problema real
Modelos de visão são pesados para carregar e, se você começar a inferir “antes da hora”, tudo falha silenciosamente:
- `_model` ainda é `null`
- pesos ainda não foram baixados
- primeira inferência demora muito (compilação/aquecimento)

Trecho analisado: [worker.js:L11-L24](file:///c:/Users/leiri/Documents/GitHub/Engenharia-de-Software-em-IA-Aplicada/01-FundamentosDeIAeLLMsParaProgramadores/04-modulo/exemplos/01_exemplo/machine-learning/worker.js#L11-L24)

## 2) A dor sem o conceito
Pergunta: como você garantiria que o jogo só “confia” na IA depois que ela está pronta?
Sem um sinal explícito de prontidão, você fica com bugs intermitentes: às vezes funciona, às vezes não.

## 3) Conceito como solução: “boot” do modelo + evento de prontidão
O padrão usado aqui tem 3 etapas:
- garantir runtime do TF pronto (`tf.ready()`)
- carregar artefatos (`labels.json` + `model.json` + shards `.bin`)
- avisar o mundo externo: “pode usar” (`postMessage({ type: 'model-load' })`)

## 4) Aplicação ao vivo (linha a linha)

### `await tf.ready()`
Garante que o TensorFlow.js terminou inicialização interna. É uma “barreira” pra não sair criando tensores cedo demais.

### `_labels = await (await fetch(LABELS_PATH)).json()`
Carrega o mapeamento `id → nome da classe`.
- No YOLO treinado em COCO, isso costuma ser algo como `0: person`, `1: bicycle`, etc.
- Aqui o filtro no pós-processamento usa texto de classe (ex.: `'kite'`).

### `_model = await tf.loadGraphModel(MODEL_PATH)`
Carrega um modelo TFJS no formato GraphModel (é comum quando você exporta de um modelo original para web).

### Aquecimento (warm-up)
Trecho: [worker.js:L18-L21](file:///c:/Users/leiri/Documents/GitHub/Engenharia-de-Software-em-IA-Aplicada/01-FundamentosDeIAeLLMsParaProgramadores/04-modulo/exemplos/01_exemplo/machine-learning/worker.js#L18-L21)

O que acontece aqui:
- cria um tensor “fake” com o shape esperado pela entrada do modelo
- roda uma execução para “aquecer” o pipeline
- descarta o tensor

Por que isso existe:
- a primeira execução costuma ser mais lenta porque o backend prepara kernels/rotas internas
- no jogo, você não quer que o primeiro “tiro” demore 2–3s por causa desse custo

## 5) Comparação antes vs depois
- Sem warm-up: primeira previsão é lenta e parece “lag”.
- Com warm-up: as previsões ficam mais consistentes depois que o modelo carregou.

## 6) Desafio prático
Olhe o console e responda:
- Qual é o tempo da primeira previsão com warm-up vs sem warm-up?
- O modelo está usando WebGL, WASM ou CPU? (dica: no TFJS você consegue inspecionar backend)

## 7) Consolidação
- “Carregar modelo” e “inferir” são fases diferentes e precisam de sincronização.
- `postMessage({ type: 'model-load' })` é o gancho ideal para habilitar o modo IA no jogo.
- Warm-up é uma otimização de experiência do usuário (menos surpresa na primeira inferência).
