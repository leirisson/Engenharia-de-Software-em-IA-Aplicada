# 🛒 CLAUDE.md — Carrinho Inteligente (Auto Checkout Web)

## 📌 Visão Geral

O **Carrinho Inteligente (Auto Checkout Web)** é um sistema 100% frontend que utiliza visão computacional (YOLO) e OCR para detectar produtos em tempo real via webcam, extrair informações relevantes e gerenciar automaticamente um carrinho de compras.

Não há backend. Todo processamento ocorre no navegador usando WebAssembly, Web Workers e armazenamento local.

---

# 🧠 Objetivo do Sistema

Permitir que o usuário:

* Escaneie produtos com a câmera
* Tenha os itens adicionados automaticamente ao carrinho
* Veja o total em tempo real
* Tenha uma experiência fluida, rápida e sem intervenção manual

---

# 🧱 Entidades do Sistema

## 📦 ProductDetection

Representa um objeto detectado pelo modelo YOLO.

```ts
type ProductDetection = {
  id: string
  label: string
  confidence: number
  bbox: [number, number, number, number]
  timestamp: number
}
```

---

## 🔎 OCRResult

Resultado bruto da leitura de texto.

```ts
type OCRResult = {
  text: string
  confidence: number
  timestamp: number
}
```

---

## 🧾 ParsedProduct

Dados estruturados após processamento do OCR.

```ts
type ParsedProduct = {
  name: string
  price: number | null
  rawText: string
}
```

---

## 🛒 CartItem

Item persistido no carrinho.

```ts
type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  lastSeen: number
}
```

---

## 🧠 DetectionState

Controle de estado das detecções recentes.

```ts
type DetectionState = {
  lastDetectedLabel: string | null
  lastDetectedAt: number
  cooldownMs: number
}
```

---

## ⚙️ AppState

Estado global da aplicação.

```ts
type AppState = {
  cart: CartItem[]
  detections: ProductDetection[]
  ocrQueue: string[]
  isCameraActive: boolean
}
```

---

# 🔁 Fluxos do Sistema

## 🎥 Fluxo Principal (Detecção → Carrinho)

1. Inicializar câmera (WebRTC)
2. Capturar frame no canvas
3. Executar YOLO
4. Para cada detecção válida:

   * Validar confiança mínima
   * Verificar cooldown
   * Recortar imagem
   * Enviar para OCR (Web Worker)
5. Receber texto do OCR
6. Executar parser
7. Validar produto
8. Adicionar ao carrinho
9. Atualizar UI

---

## 🔎 Fluxo OCR (Assíncrono)

1. Receber imagem recortada
2. Executar Tesseract.js
3. Retornar texto + confiança
4. Enviar para parser

---

## 🧾 Fluxo Parser

1. Receber texto bruto
2. Normalizar string
3. Aplicar regex:

   * Nome do produto
   * Preço (R$ XX,XX)
4. Retornar objeto estruturado

---

## 🛒 Fluxo do Carrinho

### Adicionar Item

* Se item já existe → incrementa quantidade
* Se novo → adiciona ao array

### Remover Item

* Decrementa quantidade
* Remove se quantidade = 0

### Calcular Total

```ts
total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
```

---

# 📏 Regras de Negócio

## ✅ Confiança mínima (YOLO)

* Apenas detecções com `confidence >= 0.7` são processadas

---

## ⏱️ Cooldown de Detecção

Evita múltiplas leituras do mesmo produto:

```ts
if (
  current.label === lastDetectedLabel &&
  now - lastDetectedAt < cooldownMs
) {
  IGNORE
}
```

Valor padrão:

```ts
cooldownMs = 2000
```

---

## 🔁 Anti-duplicação OCR

* Mesmo texto não pode gerar múltiplos produtos consecutivos

---

## 🧾 Validação de Produto

Um produto só é válido se:

* Nome detectado (string não vazia)
* Preço válido (number > 0)

Caso contrário:

* Produto é descartado

---

## ⚡ Controle de Performance

* YOLO roda em FPS limitado (ex: 2~5 fps)
* OCR é executado via Web Worker
* OCR usa debounce (mínimo 1 execução por produto)

---

## 🧠 Fallback Inteligente

Se OCR falhar:

* Usar label do YOLO como nome
* Preço = null
* Item não entra no carrinho automaticamente

---

# ⚙️ Processamento e Performance

## 🧵 Web Workers

OCR deve rodar fora da main thread:

```ts
workers/
  ocr.worker.ts
```

---

## 🎯 Throttling

* YOLO: máximo 5 execuções por segundo
* OCR: apenas quando novo produto detectado

---

## 🧠 Cache de Resultados

* Cache por hash da imagem
* Evita OCR repetido

---

# 💾 Persistência (Frontend Only)

## LocalStorage

```ts
localStorage.setItem("cart", JSON.stringify(cart))
```

Recuperação:

```ts
const cart = JSON.parse(localStorage.getItem("cart") || "[]")
```

---

## IndexedDB (opcional)

* Armazenar histórico de compras
* Cache de imagens OCR

---

# 🖥️ Interface do Usuário

## 🎥 Camera View

* Exibe vídeo ao vivo
* Bounding boxes desenhadas em canvas

---

## 🛒 Carrinho

* Lista de itens
* Quantidade
* Preço unitário
* Total

---

## 💰 Painel de Total

* Valor total em tempo real
* Destaque visual

---

## 🚦 Feedback Visual

| Estado     | Cor      |
| ---------- | -------- |
| Detectando | Amarelo  |
| Confirmado | Verde    |
| Erro OCR   | Vermelho |

---

# 🧪 Estados de Erro

## ❌ OCR falhou

* Mostrar mensagem: “Não foi possível ler o produto”

## ❌ Produto sem preço

* Exibir como “pendente”

## ❌ Câmera não autorizada

* Mostrar fallback com botão de permissão

---

# 🔐 Segurança

* Nenhum dado enviado para servidor
* Processamento 100% local
* Sem armazenamento sensível

---

# 🚀 Roadmap de Evolução

## Fase 1 (MVP)

* YOLO + OCR funcionando
* Carrinho simples
* UI básica

---

## Fase 2

* Parser melhorado
* Cache inteligente
* Melhor UX

---

## Fase 3

* Reconhecimento por código de barras
* Base de produtos local
* PWA offline

---

## Fase 4 (Produto)

* Multi-loja
* Analytics local
* Integração com APIs externas

---

# 🧩 Estrutura de Pastas

```bash
src/
 ├── app/
 ├── components/
 │    ├── Camera.tsx
 │    ├── Cart.tsx
 │    ├── ProductCard.tsx
 │
 ├── modules/
 │    ├── detection/
 │    ├── ocr/
 │    ├── parser/
 │
 ├── store/
 │    ├── cart.store.ts
 │
 ├── workers/
 │    ├── ocr.worker.ts
 │
 ├── utils/
 │    ├── crop.ts
 │    ├── debounce.ts
 │    ├── cache.ts
```

---

# 📊 Métricas de Qualidade

* Tempo de detecção < 500ms
* OCR < 1.5s por item
* Taxa de acerto > 70%
* FPS estável (> 24 UI, 2-5 YOLO)

---

# 💬 Pitch Técnico

> Sistema de auto checkout 100% frontend que utiliza visão computacional e OCR em tempo real no navegador, eliminando a necessidade de backend e proporcionando uma experiência rápida, offline e escalável.

---

# 🧠 Princípios do Projeto

* Offline-first
* Baixa latência
* UX fluida
* Zero dependência de backend
* Escalabilidade via browser

---

# 🔚 Conclusão

Este sistema demonstra:

* Engenharia de software aplicada
* Uso avançado de visão computacional no browser
* Arquitetura orientada a performance
* Capacidade de construir produtos reais sem backend

---

**Status:** 🚧 Em desenvolvimento
**Arquitetura:** Frontend-only (Edge Computing via Browser)
