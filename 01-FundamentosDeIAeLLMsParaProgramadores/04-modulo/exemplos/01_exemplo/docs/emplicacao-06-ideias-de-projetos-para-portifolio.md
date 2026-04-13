# Projetos de portfólio que resolvem problemas reais (a partir deste exemplo)

## 1) Problema real
“Integrar YOLO no navegador” é um ótimo começo, mas portfólio forte precisa parecer trabalho de produto:
- problema real e específico (não “tem IA”, e sim “reduz X, melhora Y”)
- usuário claro (quem sofre a dor)
- métrica de sucesso (como provar que funcionou)
- ciclo completo (dados → treino → deploy → monitoramento)

## 2) A dor sem o conceito
Sem recorte, o projeto vira “demo bonita”:
- não existe decisão de produto (o que entra/saí, quando falha, como recupera)
- não existe critério (acerta “às vezes”, mas ninguém sabe quanto)
- não existe confiança (você não consegue explicar por que melhora)

## 3) Conceito como solução: projetos com “loop fechado”
O padrão que transforma isso em projeto real é “loop fechado”:
- percepção (visão ou áudio) gera um evento confiável
- decisão aplica uma política (regras e limites)
- ação produz um efeito observável
- telemetria mede e realimenta o próximo treino

## 4) Ideias (progressivas e realistas)
Cada ideia abaixo já vem com: “pitch de 30s”, MVP, métrica e diferencial de engenharia.

### Ideia 1 — “Inspeção Visual de UI” (detectar elementos que sumiram)
Pitch (30s): uma ferramenta que verifica automaticamente se elementos críticos de uma tela estão presentes (botões, logo, barra de status) e alerta quando uma mudança quebrou a UI.
Usuário: time de produto/QA que sofre com regressão visual.
MVP: rodar em cima de screenshots e dizer “elemento X presente/ausente” com bounding box.
Métrica: recall do elemento crítico (querer “não deixar passar”), tempo de detecção e falso positivo por tela.
Dados: screenshots geradas automaticamente (variações de tema, resolução, idioma).
Diferencial: conecta IA com engenharia de software (pipeline de testes + relatórios).

### Ideia 2 — “Contagem em Tempo Real” (filas, pessoas, objetos)
Pitch (30s): um contador em tempo real no navegador que estima quantidade de objetos em uma câmera (ex.: pessoas em fila, vagas ocupadas, itens em bancada).
Usuário: pequeno negócio/operador que quer uma métrica simples sem instalar software pesado.
MVP: detecção + contagem + gráfico de histórico por minuto.
Métrica: erro médio de contagem por cena e latência por frame (no browser).
Dados: vídeos curtos próprios (5–10 cenários) + rotulação simples.
Diferencial: mostra otimização (latência), pós-processamento (NMS/track) e UX (dashboard).

### Ideia 3 — “Assistente de Acessibilidade” (apontar e clicar em alvos)
Pitch (30s): um assistente que ajuda pessoas com dificuldade motora a clicar em alvos visuais, sugerindo/ajustando o cursor para o elemento correto.
Usuário: pessoas com acessibilidade reduzida e apps web com UX difícil.
MVP: overlay com sugestões de alvo + “snap” suave quando o usuário aproxima o cursor.
Métrica: taxa de cliques corretos e tempo até completar tarefa.
Dados: dataset pode ser sintético (UI gerada) + validação com cenários reais.
Diferencial: produto com impacto social + foco em UX e limites (não “toma controle”).

### Ideia 4 — “Dataset Builder” embutido (para qualquer projeto de visão)
Pitch (30s): um modo “coletar dados” dentro do app que salva frames, permite rotular e exporta dataset versionado.
Usuário: você (e outros devs) que sempre empacam em “como criar dataset”.
MVP: botão de captura + export JSON/YOLO + metadados (resolução, fps, cenário).
Métrica: tempo para gerar 500 amostras rotuladas e consistência do rótulo.
Dados: gerados no próprio app (como o Duck Hunt captura canvas).
Diferencial: resolve a dor real mais comum em ML: criar e manter dados.

### Ideia 5 — “Detecção de Fraude Comportamental” (anti-bot em web)
Pitch (30s): detectar padrões de navegação/clique impossíveis para humanos e bloquear automação maliciosa sem captchas agressivos.
Usuário: e-commerce, formulários públicos, sistemas de votação.
MVP: coletar telemetria (tempo de reação, trajetórias de mouse) e classificar sessões suspeitas.
Métrica: taxa de bloqueio de bots com baixo falso positivo (não punir usuário real).
Dados: simulações controladas + logs anonimizados em ambiente de teste.
Diferencial: engenharia de dados + ética (privacidade) + produto (trade-off).

### Ideia 6 — “Monitoramento Visual” (câmeras e falhas operacionais)
Pitch (30s): um detector leve no navegador para alertar “porta aberta”, “luz apagada”, “equipamento parado” em cenários pequenos (escritório/oficina).
Usuário: operação enxuta sem equipe de TI.
MVP: 1–2 classes, alerta com cooldown e registro de eventos.
Métrica: taxa de alerta correto por evento e latência no dispositivo-alvo.
Dados: poucas cenas reais (5–20) gravadas em condições diferentes de luz.
Diferencial: mostra foco em robustez (luz/ruído) e regras de negócio (cooldown).

### Ideia 7 — “Tracking + Previsão” (não só detectar)
Pitch (30s): além de detectar objetos, acompanhar cada um com um id e prever movimento para ações mais inteligentes (ex.: previsão de trajetória).
Usuário: qualquer app que depende de consistência ao longo do tempo (logística, esportes, retail).
MVP: detecção + tracking + métrica de estabilidade (quantas trocas de id).
Métrica: ID switches por minuto e perda de track em oclusão.
Dados: vídeo curto com múltiplos objetos e cruzamentos.
Diferencial: mostra maturidade técnica além de “rodar modelo”.

### Ideia 8 — “Agente de Jogo para Medir Dificuldade” (balanceamento)
Pitch (30s): um agente joga automaticamente para estimar dificuldade de fases e detectar desbalanceamentos (fácil demais/difícil demais) sem depender de playtest manual.
Usuário: game designer e QA.
MVP: política simples (não precisa RL no início) + coleta de métricas por fase.
Métrica: taxa de sucesso por fase e variância entre execuções.
Dados: gerado pelo próprio jogo (telemetria interna).
Diferencial: foco em produto (balanceamento), não “IA por IA”.

## 5) Comparação antes vs depois (como escolher uma ideia)
Pergunte:
- Dá para explicar em 30 segundos?
- Dá para medir sucesso com um número (acerto/minuto, latência, mAP)?
- Dá para demonstrar em vídeo curto?

## 6) Desafio prático (escolha com critério)
Escolha 1 ideia e responda (escrito, em 5 linhas):
- qual é o usuário?
- qual problema ele tem?
- qual métrica define “funcionou”?

Se travar, comece pela Ideia 4 (Dataset Builder). Ela destrava todas as outras e vira um diferencial enorme no portfólio.

## 7) Consolidação
- Portfólio forte em IA é “processo + produto”, não só “modelo rodando”.
- Escolha dores que existem fora do jogo: QA visual, contagem, monitoramento, acessibilidade, fraude.
- Sempre feche o loop: baseline → métrica → melhoria → deploy → evidência (vídeo + números).
