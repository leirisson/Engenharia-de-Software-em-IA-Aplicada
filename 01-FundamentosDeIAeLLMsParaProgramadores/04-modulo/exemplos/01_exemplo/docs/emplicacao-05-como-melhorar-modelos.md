# Como melhorar modelos para novos projetos (sem “mágica”)

## 1) Problema real
O projeto atual funciona, mas tem uma fragilidade típica de demo:
- o modelo não foi treinado para “patos em sprites 2D”
- o filtro por classe (`'kite'`) depende de uma confusão do modelo
- o resultado “parece inteligente”, mas não é confiável para virar produto/portfólio forte

Pergunta que separa demo de projeto sério:
- O que exatamente você quer que seja detectado (e em quais condições)?

## 2) A dor sem o conceito
Sem um plano de melhoria, você cai em tentativas aleatórias:
- troca YOLOv5n por YOLOv8 e “às vezes melhora”
- muda o threshold e “às vezes piora”
- muda a resolução e “fica mais lento”

O problema não é “o modelo”: é falta de dados e de critérios de avaliação.

## 3) Conceito como solução: dados + métrica + ciclo de iteração
Melhorar modelo vira um ciclo repetível:
1. definir classes e cenário (o que é “pato”? quantas variações?)
2. coletar dataset (imagens representativas do jogo)
3. rotular (bounding boxes)
4. treinar e avaliar (métricas e validação)
5. exportar para web e medir latência no browser

## 4) Aplicação ao vivo: um plano prático para este Duck Hunt

### Passo A — Definir o “alvo”
Em vez de depender de `'kite'`, defina classes suas:
- `duck`
- `dog` (se quiser evitar falsos positivos no cachorro)
- `background` (opcional, geralmente não rotula)

### Passo B — Coletar dados direto do jogo
Você já tem a captura de frame em [machine-learning/main.js:L28-L38](file:///c:/Users/leiri/Documents/GitHub/Engenharia-de-Software-em-IA-Aplicada/01-FundamentosDeIAeLLMsParaProgramadores/04-modulo/exemplos/01_exemplo/machine-learning/main.js#L28-L38).
Isso é ouro: com pequenas adaptações você consegue:
- salvar frames em intervalos aleatórios
- salvar somente quando houver pato na tela (heurística)
- variar fases/velocidade/cores para diversificar o dataset

O objetivo é simples: imagens parecidas com o mundo real do seu projeto.

### Passo C — Rotular
Ferramentas típicas:
- CVAT
- Roboflow
- Label Studio

Critério para portfólio:
- documente como decidiu a “qualidade do rótulo” (ex.: caixa pegando o sprite inteiro)

### Passo D — Treinar com um YOLO adequado
Sugestão prática:
- comece com uma versão “nano” (rápida) para rodar bem no navegador
- treine poucas classes e dataset enxuto, mas bem representativo
- avalie por mAP e por um critério do produto: “% de tiros certos por minuto”

### Passo E — Exportar para Web (TFJS)
Você já está consumindo um GraphModel em:
- [worker.js:L15](file:///c:/Users/leiri/Documents/GitHub/Engenharia-de-Software-em-IA-Aplicada/01-FundamentosDeIAeLLMsParaProgramadores/04-modulo/exemplos/01_exemplo/machine-learning/worker.js#L15)

Para portfólio, o diferencial é mostrar:
- como foi a exportação
- como validou que as saídas batem com as do modelo original

### Passo F — Pós-processamento melhor
O YOLO normalmente precisa de:
- Non-Max Suppression (NMS) para remover caixas duplicadas
- escolha de “top-1 alvo” por frame (ou por janela de tempo) para evitar tiros múltiplos

No seu código atual, o pós-processamento é bem simples:
- [worker.js:L62-L93](file:///c:/Users/leiri/Documents/GitHub/Engenharia-de-Software-em-IA-Aplicada/01-FundamentosDeIAeLLMsParaProgramadores/04-modulo/exemplos/01_exemplo/machine-learning/worker.js#L62-L93)

## 5) Comparação antes vs depois (o que muda na prática)
- Antes: detecta por “acidente” (classe errada) e depende de sorte visual.
- Depois: detecta por intenção (classe `duck`) e você consegue provar com métrica.

## 6) Desafio prático
Defina um objetivo mensurável e curto:
- “Quero 90% de tiros certos em 60 segundos no nível 1”

Depois responda:
- Que tipo de imagem precisa estar no dataset para isso acontecer?
- Quais situações o modelo mais erra hoje (oclusão, tamanho pequeno, fundo parecido)?

## 7) Consolidação
- Melhorar modelo = melhorar dados + critérios + pós-processamento, não só trocar arquitetura.
- Seu código já tem o pipeline; o gargalo agora é confiabilidade do detector.
- Projetos de portfólio fortes mostram processo (dataset → treino → avaliação → deploy web).
