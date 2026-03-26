# 🛒 Carrinho Inteligente (Auto Checkout Web)

Sistema de **auto checkout no navegador** usando **Visão Computacional + OCR**.
Detecte produtos com a câmera, extraia informações automaticamente e monte um carrinho em tempo real — **sem backend**.

---

## 🚀 Demo (em breve)

> Rode localmente seguindo os passos abaixo 👇

---

## 🧠 Sobre o Projeto

O **Carrinho Inteligente** permite que usuários escaneiem produtos com a webcam e tenham seus itens adicionados automaticamente a um carrinho virtual.

Tudo roda no navegador utilizando:

* Detecção de objetos (YOLO)
* OCR (leitura de texto)
* Processamento local (WebAssembly + Web Workers)

---

## ✨ Funcionalidades

* 📷 Captura de vídeo em tempo real (WebRTC)
* 🧠 Detecção de produtos com YOLO
* 🔎 Leitura de texto com OCR (Tesseract.js)
* 🛒 Carrinho automático
* 💰 Cálculo de total em tempo real
* ⚡ Performance otimizada (Workers + Throttle)
* 💾 Persistência local (LocalStorage)
* 🌐 100% frontend (sem backend)

---

## 🧩 Arquitetura

```
Webcam → YOLO → Crop → OCR → Parser → Cart → UI
```

---

## 🛠️ Tecnologias

* **Frontend:** React / Next.js
* **Visão Computacional:** YOLO (ONNX / TensorFlow.js)
* **OCR:** Tesseract.js
* **Processamento:** Web Workers
* **Renderização:** Canvas API
* **Persistência:** LocalStorage / IndexedDB

---

## 📁 Estrutura do Projeto

```
src/
 ├── app/
 ├── components/
 │    ├── Camera.tsx
 │    ├── Cart.tsx
 │    ├── BoundingBox.tsx
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

## ⚙️ Como Rodar o Projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/carrinho-inteligente.git
cd carrinho-inteligente
```

---

### 2. Instale as dependências

```bash
npm install
```

---

### 3. Rode o projeto

```bash
npm run dev
```

---

### 4. Acesse no navegador

```
http://localhost:3000
```

---

## 📷 Permissões

Ao abrir o sistema, permita o uso da câmera para funcionamento correto.

---

## ⚠️ Limitações (MVP)

* OCR pode falhar dependendo da qualidade da imagem
* Detecção genérica (modelo não treinado para produtos específicos)
* Preços podem não ser detectados corretamente
* Sensível à iluminação e ângulo

---

## 🚀 Roadmap

### 🔹 MVP

* [x] Captura de câmera
* [x] Detecção de objetos
* [x] OCR básico
* [x] Carrinho funcional

### 🔹 Próximos passos

* [ ] Modelo YOLO customizado (produtos reais)
* [ ] Leitura de código de barras
* [ ] Base de produtos local
* [ ] Melhorias no parser de texto
* [ ] Interface mais fluida (UX)

### 🔹 Futuro

* [ ] PWA (offline completo)
* [ ] Comparação de preços
* [ ] Analytics de uso
* [ ] Integração com APIs externas

---

## 🧪 Casos de Uso

* 🛒 Auto checkout (supermercados)
* 🏪 Protótipos de lojas autônomas
* 📦 Controle de inventário
* 📊 Estudos de visão computacional no browser

---

## 🧠 Desafios Técnicos

* Rodar modelos de IA no navegador com boa performance
* Evitar travamento da UI (uso de Web Workers)
* Garantir precisão com OCR em tempo real
* Sincronizar detecção + leitura + estado global

---

## 🔐 Privacidade

* Nenhum dado é enviado para servidores
* Todo processamento ocorre localmente
* Seguro e offline-first

---

## 💬 Pitch

> Aplicação de auto checkout que roda totalmente no navegador, utilizando visão computacional e OCR para identificar produtos em tempo real e eliminar a necessidade de caixas tradicionais.

---

## 🤝 Contribuição

Contribuições são bem-vindas!

1. Fork o projeto
2. Crie uma branch (`feature/minha-feature`)
3. Commit suas mudanças
4. Abra um Pull Request

---

## 📄 Licença

MIT License

---

## 👨‍💻 Autor

Desenvolvido por **Leirisson Souza**
🚀 Tecnologia | Automação | Backend

---

## ⭐ Se curtiu

Deixa uma estrela no repo pra ajudar o projeto crescer!
