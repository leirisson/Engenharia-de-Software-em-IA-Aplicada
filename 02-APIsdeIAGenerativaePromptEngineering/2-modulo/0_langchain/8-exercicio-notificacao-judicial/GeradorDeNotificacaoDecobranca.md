# 1 - Gerador de notificacao de cobranca

Escritorio de advocacia — Cobranca extrajudicial

Chain simples StringOutputParser
Contexto do problema

O escritorio Mendes & Associados envia dezenas de notificacoes extrajudiciais por semana para devedores. Hoje um assistente copia e cola um modelo Word e edita manualmente. A demanda cresceu e o processo toma horas. O cliente quer automatizar a geracao do texto formal da notificacao a partir dos dados do caso.
Tasks

Criar um PromptTemplate com system: "Voce e um advogado especialista em cobranca. Escreva uma notificacao extrajudicial formal." e variaveis: {devedor}, {valor}, {vencimento}, {credor}
Conectar ao ChatOpenAI com gpt-3.5-turbo
Adicionar StringOutputParser para retornar o texto limpo
Invocar a chain com dados reais de teste e imprimir o resultado
Saida esperada

"Ilmo. Sr. Joao Pereira, Vimos por meio desta notificar V.Sa. do debito no valor de R$ 4.200,00 vencido em 10/11/2024, referente a honorarios advocaticios contratados junto ao credor Dr. Carlos Mendes..."
