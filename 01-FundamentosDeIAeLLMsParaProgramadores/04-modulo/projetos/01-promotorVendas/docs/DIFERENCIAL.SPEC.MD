# 🥉 MÓDULO DIFERENCIAL

---

# 🧾 4. OCR DE PREÇO

## 🎯 Objetivo

Extrair e validar preços automaticamente.

---

## 🧠 Regras de Negócio

* Deve identificar valores monetários (R$)
* Deve validar contra preço esperado
* Deve retornar nível de confiança
* Pode falhar silenciosamente (fallback manual)

---

## 🧩 Casos de Uso

* ExtractPriceFromImage
* ValidatePrice
* FlagPriceMismatch

---

## 📦 Exemplo

```json
{
  "priceDetected": 5.99,
  "confidence": 0.87,
  "status": "OK"
}
```

---

## 🧪 TDD

```ts
it('should extract price with confidence above threshold', async () => {
  const result = await extractPrice.execute(mockImage)
  expect(result.confidence).toBeGreaterThan(0.8)
})
```

---

## 🧱 Componentes

* OCRService
* ImagePreprocessor
* PriceParser

---

## ⚠️ Estratégia

* Iniciar com mock
* Evoluir para Tesseract/PaddleOCR

---

---

# 🏷️ 5. RECONHECIMENTO DE MARCA

## 🎯 Objetivo

Identificar marcas e calcular share de gôndola.

---

## 🧠 Regras de Negócio

* Produto deve estar associado a uma marca
* Deve agrupar por marca
* Deve calcular participação (%)

---

## 🧩 Casos de Uso

* DetectBrands
* CalculateBrandShare

---

## 📦 Exemplo

```json
{
  "brands": [
    { "name": "Coca-Cola", "share": 60 },
    { "name": "Pepsi", "share": 40 }
  ]
}
```

---

## 🧪 TDD

```ts
it('should calculate brand share correctly', () => {
  const result = calculateBrandShare.execute(mockDetections)
  expect(result.length).toBeGreaterThan(0)
})
```

---

## 🧱 Estratégias

### Opção 1:

* YOLO treinado por marca

### Opção 2:

* Produto → Marca via banco

---

---

# 🔗 INTEGRAÇÃO ENTRE MÓDULOS

---

## 🔁 Fluxo Inteligente

1. Missão executada
2. Imagem enviada
3. YOLO detecta produtos
4. OCR extrai preço
5. Sistema:

   * Calcula score
   * Detecta fraude
6. Dashboard atualizado

---

# 🧪 ESTRATÉGIA GLOBAL DE TDD

---

## Ordem de implementação

1. Score (mais simples)
2. Anti-fraude
3. Dashboard (mockado)
4. OCR
5. Marca

---

## Padrão obrigatório

* Teste antes da implementação
* Testes unitários por UseCase
* Testes de integração por fluxo

---

# 🧠 DECISÕES TÉCNICAS

* DDD para domínio
* UseCases isolados
* Infra desacoplada
* IA como serviço externo

---

# 🚀 RESULTADO ESPERADO

Sistema capaz de:

* Avaliar execução automaticamente
* Detectar fraudes
* Gerar inteligência de negócio
* Extrair dados de imagens

---
