# Preprocessamento e inferência (preprocessImage + runInference)

## 1) Problema real
O modelo YOLO não “entende” canvas diretamente: ele precisa de um tensor com:
- tamanho fixo (ex.: 640×640)
- valores normalizados (0…1)
- dimensão de batch (ex.: `[1, 640, 640, 3]`)

Se você mandar qualquer coisa diferente, o erro pode ser:
- shape incompatível
- previsão sem sentido (porque escala/cores erradas)
- memória subindo a cada frame

Trechos analisados:
- [worker.js:L27-L35](file:///c:/Users/leiri/Documents/GitHub/Engenharia-de-Software-em-IA-Aplicada/01-FundamentosDeIAeLLMsParaProgramadores/04-modulo/exemplos/01_exemplo/machine-learning/worker.js#L27-L35)
- [worker.js:L38-L60](file:///c:/Users/leiri/Documents/GitHub/Engenharia-de-Software-em-IA-Aplicada/01-FundamentosDeIAeLLMsParaProgramadores/04-modulo/exemplos/01_exemplo/machine-learning/worker.js#L38-L60)

## 2) A dor sem o conceito
Perguntas para você “sentir” o problema:
- Se eu não der `dispose`, o que acontece com memória depois de 2 minutos?
- Se eu não normalizar (`/255`), por que os scores ficam estranhos?
- Se eu não fizer `expandDims`, por que o modelo reclama do shape?

## 3) Conceito como solução: pipeline de dados + gestão de memória
Dois conceitos resolvem 80% dos bugs aqui:
- “pipeline” de transformação de imagem → tensor esperado pelo modelo
- descarte explícito de tensores (ou `tf.tidy`) para evitar vazamento

## 4) Aplicação ao vivo

### preprocessImage(input)
Trecho: [worker.js:L27-L35](file:///c:/Users/leiri/Documents/GitHub/Engenharia-de-Software-em-IA-Aplicada/01-FundamentosDeIAeLLMsParaProgramadores/04-modulo/exemplos/01_exemplo/machine-learning/worker.js#L27-L35)

O que cada etapa faz:
- `tf.browser.fromPixels(input)`: transforma a imagem (bitmap) em tensor `[H, W, 3]` (RGB).
- `resizeBilinear(..., [640, 640])`: força tamanho fixo do YOLO.
- `.div(255)`: normaliza pixels para 0…1.
- `.expandDims(0)`: vira batch 1 → `[1, 640, 640, 3]`.

Por que existe `tf.tidy(() => { ... })`:
- tudo que for tensor criado dentro dele e não for “retornado” é automaticamente descartado.
- isso é essencial em loops contínuos (a cada 200ms).

### runInference(tensor)
Trecho: [worker.js:L38-L60](file:///c:/Users/leiri/Documents/GitHub/Engenharia-de-Software-em-IA-Aplicada/01-FundamentosDeIAeLLMsParaProgramadores/04-modulo/exemplos/01_exemplo/machine-learning/worker.js#L38-L60)

O que está acontecendo:
- `_model.executeAsync(tensor)` roda a inferência.
- `tf.dispose(tensor)` descarta o tensor de entrada (o preprocessamento já acabou).
- o retorno `output` é um array de tensores; o código pega os 3 primeiros:
  - `box`: coordenadas normalizadas
  - `scores`: confiança
  - `classes`: id da classe
- `.data()` transforma tensores em arrays tipados no JS (CPU).
- `output.forEach(...dispose)` garante que os tensores do resultado não ficam vivos.

Uma consequência importante:
- chamar `.data()` traz os resultados para CPU e pode custar tempo. Faz sentido porque você precisa desses números para decidir onde clicar.

## 5) Comparação antes vs depois
- Sem `tf.tidy`/`dispose`: memória cresce, FPS cai, a aba pode travar.
- Com `tf.tidy`/`dispose`: o sistema fica estável em execução contínua.

## 6) Desafio prático
Experimento guiado:
- Aumente o intervalo para 100ms e observe: o worker aguenta? O jogo trava?
- Diminua o `INPUT_MODEL_DIMENSIONS` (se o modelo aceitar) e observe trade-off: desempenho vs precisão.

## 7) Consolidação
- Preprocessamento é “contrato” entre o mundo (canvas) e o modelo (tensor).
- `tf.tidy` e `dispose` são obrigatórios quando você faz inferência em loop.
- “Executar modelo” é só metade: o resto é transformar saída em decisão.
