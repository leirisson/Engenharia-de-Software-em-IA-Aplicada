# Pós-processamento: do bounding box até “mirar e atirar”

## 1) Problema real
YOLO retorna “muita coisa”:
- várias caixas por frame
- scores variando
- classes diferentes
- coordenadas normalizadas (0…1), não pixels

E o jogo precisa de algo simples:
- um ponto (x,y) para posicionar a mira e disparar

Trechos analisados:
- [worker.js:L62-L93](file:///c:/Users/leiri/Documents/GitHub/Engenharia-de-Software-em-IA-Aplicada/01-FundamentosDeIAeLLMsParaProgramadores/04-modulo/exemplos/01_exemplo/machine-learning/worker.js#L62-L93)
- [machine-learning/main.js:L9-L24](file:///c:/Users/leiri/Documents/GitHub/Engenharia-de-Software-em-IA-Aplicada/01-FundamentosDeIAeLLMsParaProgramadores/04-modulo/exemplos/01_exemplo/machine-learning/main.js#L9-L24)

## 2) A dor sem o conceito
Pergunte a si mesmo:
- O que acontece quando aparecem 3 caixas no mesmo pato?
- O que acontece se o modelo “erra a classe” mas acerta a posição?
- Como você escolheria “o melhor alvo” num frame?

## 3) Conceito como solução: filtro + conversão de coordenadas
O arquivo implementa um pós-processamento bem pragmático:
- filtra por confiança (`CLASS_TRASHOLD`)
- filtra por classe (texto em `_labels`)
- converte coords normalizadas em pixels
- escolhe o centro do retângulo como ponto de mira

Isso não é “o YOLO”: é a regra de negócio do seu projeto.

## 4) Aplicação ao vivo (entendendo processPrediction)
Trecho: [worker.js:L62-L93](file:///c:/Users/leiri/Documents/GitHub/Engenharia-de-Software-em-IA-Aplicada/01-FundamentosDeIAeLLMsParaProgramadores/04-modulo/exemplos/01_exemplo/machine-learning/worker.js#L62-L93)

### Loop por previsão
O código percorre `scores.length`. Para cada índice:
- se `scores[index] < CLASS_TRASHOLD`, ignora
- pega o rótulo textual: `const label = _labels[classes[index]]`
- se não for o rótulo desejado, ignora (`if (label != 'kite') continue`)

Ponto importante para seu entendimento:
- `'kite'` é um rótulo da base COCO; aqui ele está sendo usado como “proxy” para o alvo do jogo.
- isso funciona (às vezes) por coincidência visual: o modelo pode estar confundindo o sprite do pato com outra classe parecida no dataset.

### Pegando box e convertendo pra pixels
`boxes` vem como um array “flat”. Para o índice `i`, o código pega 4 valores:
- `[x1, y1, x2, y2] = boxes.slice(i * 4, (i + 1) * 4)`

Depois multiplica por `width` e `height` do frame original:
- transforma 0…1 em pixels reais do canvas

### Centro do retângulo
Em vez de usar o canto da caixa, ele calcula o centro e devolve:
- `{ x: centerX, y: centerY, score: ... }`

O formato final é o “contrato” que o *main thread* consome.

## 5) Como isso vira tiro
No *main thread*:
- recebe `{ x, y }` do Worker
- posiciona a mira (`aim.setPosition(x, y)`)
- chama `game.handleClick(...)` como se fosse um clique humano

Trecho: [machine-learning/main.js:L15-L23](file:///c:/Users/leiri/Documents/GitHub/Engenharia-de-Software-em-IA-Aplicada/01-FundamentosDeIAeLLMsParaProgramadores/04-modulo/exemplos/01_exemplo/machine-learning/main.js#L15-L23)

## 6) Desafio prático (evolução natural)
Sem reescrever tudo, pense em uma evolução:
- “Escolher o alvo com maior score” por frame (em vez de atirar em todos).
- Aplicar Non-Max Suppression (NMS) para remover caixas duplicadas.
- Trocar filtro por classe textual por “região de interesse” (ex.: só no céu).

## 7) Consolidação
- Pós-processamento é onde você transforma saída genérica do modelo em ação específica do seu produto.
- O filtro por `'kite'` é uma decisão de negócio (e também um ponto frágil).
- Converter coordenadas e escolher o centro é o passo que conecta visão → controle do jogo.
