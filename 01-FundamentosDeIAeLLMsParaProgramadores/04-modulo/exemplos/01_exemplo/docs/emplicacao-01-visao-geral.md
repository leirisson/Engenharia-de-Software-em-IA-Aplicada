# Visão geral: como a “IA” foi integrada ao Duck Hunt

## 1) Problema real
Você tem um jogo rodando no navegador (PixiJS) e quer que um modelo de visão computacional “veja” a tela e tome uma ação (mirar + atirar) automaticamente.

## 2) A dor sem o conceito
Se você tentar rodar inferência diretamente no *thread* principal (o mesmo que renderiza o jogo), aparecem sintomas bem reais:
- quedas de FPS / travadinhas
- input atrasado (cliques/áudio fora de sincronia)
- GC/memória subindo por criação de tensores sem descarte

Perguntas para guiar seu raciocínio:
- Onde fica o gargalo: renderização do Pixi ou execução do modelo?
- Como separar “renderizar” de “pensar”?

## 3) Conceito como solução: Web Worker + pipeline de visão
A solução aplicada aqui é clássica em jogos web:
- O jogo continua rodando no *main thread*.
- A inferência roda em um Web Worker (em paralelo), reduzindo travamentos.
- A comunicação ocorre por mensagens (`postMessage`) com um “snapshot” da tela.

## 4) Aplicação ao vivo (o fluxo real deste projeto)
O fluxo completo, olhando os arquivos do exemplo, é:

1. O jogo inicia e carrega assets.  
   Arquivo: [main.js](file:///c:/Users/leiri/Documents/GitHub/Engenharia-de-Software-em-IA-Aplicada/01-FundamentosDeIAeLLMsParaProgramadores/04-modulo/exemplos/01_exemplo/main.js)

2. A integração de IA cria um Worker e esconde a mira humana.  
   Arquivo: [machine-learning/main.js](file:///c:/Users/leiri/Documents/GitHub/Engenharia-de-Software-em-IA-Aplicada/01-FundamentosDeIAeLLMsParaProgramadores/04-modulo/exemplos/01_exemplo/machine-learning/main.js)

3. A cada 200ms, o código captura o canvas do jogo e manda a imagem para o Worker.  
   Trecho: [machine-learning/main.js:L28-L38](file:///c:/Users/leiri/Documents/GitHub/Engenharia-de-Software-em-IA-Aplicada/01-FundamentosDeIAeLLMsParaProgramadores/04-modulo/exemplos/01_exemplo/machine-learning/main.js#L28-L38)

4. No Worker, a imagem vira tensor, passa pelo YOLOv5 e gera previsões (boxes/scores/classes).  
   Trecho: [worker.js:L11-L113](file:///c:/Users/leiri/Documents/GitHub/Engenharia-de-Software-em-IA-Aplicada/01-FundamentosDeIAeLLMsParaProgramadores/04-modulo/exemplos/01_exemplo/machine-learning/worker.js#L11-L113)

5. O Worker devolve coordenadas (x,y) do alvo e o *main thread* converte isso em “mover a mira e clicar”.  
   Trecho: [machine-learning/main.js:L9-L24](file:///c:/Users/leiri/Documents/GitHub/Engenharia-de-Software-em-IA-Aplicada/01-FundamentosDeIAeLLMsParaProgramadores/04-modulo/exemplos/01_exemplo/machine-learning/main.js#L9-L24)

## 5) Comparação antes vs depois
- Antes: “o jogo decide e atira” exigiria que você programasse regras (onde o pato está?).
- Depois: “o modelo detecta e o jogo executa”, você muda o comportamento trocando o modelo/filtros.

## 6) Desafio prático (sem solução pronta)
Abra o jogo e tente responder:
- Se eu mudar o intervalo de 200ms para 50ms, o que acontece com CPU/FPS?
- Se eu mandar imagens maiores/menores, onde fica o custo maior: `resize` ou `executeAsync`?

## 7) Consolidação
- O Worker isola inferência para não travar renderização.
- O pipeline é: captura de frame → preprocessamento → inferência → pós-processamento → ação.
- Melhorar o “modelo” não é só treinar: inclui pós-processamento, filtro de classes e desempenho.
