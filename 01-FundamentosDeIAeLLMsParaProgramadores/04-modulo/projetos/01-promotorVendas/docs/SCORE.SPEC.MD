# 🧠 SPEC — Módulos Inteligentes & Diferenciais (ShelfVision)

---

# 🥈 MÓDULO INTELIGENTE

---

# 🎯 1. SISTEMA DE SCORE (Performance do Promotor)

## 📌 Objetivo

Avaliar automaticamente a qualidade da execução das missões.

---

## 🧠 Regras de Negócio

* Cada missão possui um score base (ex: 100 pontos)
* Penalidades reduzem o score:

  * ❌ Produto ausente (-20)
  * ❌ Preço divergente (-15)
  * ❌ Foto inválida (-10)
  * ⏱️ Execução muito rápida (-10)
* Bônus:

  * ✅ Execução perfeita (+10)

---

## 📊 Fórmula

Score final = Base - Penalidades + Bônus

---

## 🧩 Casos de Uso

* CalculateMissionScore
* GetPromoterRanking
* GetScoreHistory

---

## 📦 Exemplo de saída

```json
{
  "missionId": "123",
  "score": 75,
  "issues": ["PRICE_DIVERGENT", "LOW_TIME"]
}
```

---

## 🧪 TDD

```ts
it('should apply penalty when product is missing', () => {
  const score = calculateScore.execute(mockData)
  expect(score).toBeLessThan(100)
})
```

---

## 🧱 Entidades

* Score
* ScoreRule
* ScoreHistory

---

---

# 🕵️ 2. ANTI-FRAUDE

## 🎯 Objetivo

Detectar comportamentos suspeitos automaticamente.

---

## 🧠 Regras de Negócio

Uma execução é suspeita se:

* 📸 Imagem duplicada (hash igual)
* ⏱️ Tempo < limite mínimo
* 📍 Distância fora da loja
* 🔁 Execuções repetidas em sequência

---

## 🧩 Casos de Uso

* DetectFraud
* FlagSuspiciousReport
* ReviewFraudCases

---

## 🚨 Tipos de fraude

* IMAGE_DUPLICATE
* FAST_EXECUTION
* INVALID_LOCATION
* PATTERN_BEHAVIOR

---

## 📦 Exemplo

```json
{
  "status": "SUSPICIOUS",
  "reasons": ["IMAGE_DUPLICATE", "FAST_EXECUTION"]
}
```

---

## 🧪 TDD

```ts
it('should flag report as suspicious if execution time is too low', () => {
  const result = detectFraud.execute(mockReport)
  expect(result.status).toBe('SUSPICIOUS')
})
```

---

## 🧱 Componentes

* FraudDetectorService
* ImageHashService
* GeoValidator

---

---

# 📊 3. DASHBOARD (INTELIGÊNCIA DE NEGÓCIO)

## 🎯 Objetivo

Fornecer visão executiva da operação.

---

## 📊 Métricas

* Taxa de execução (%)
* Score médio por promotor
* Ruptura de produtos
* Missões atrasadas
* Ranking de promotores

---

## 🧩 Casos de Uso

* GetDashboardMetrics
* GetPromoterRanking
* GetCompanyPerformance

---

## 📈 Visualizações

* Gráfico de barras (execução)
* Ranking (top promotores)
* KPI cards

---

## 🧪 TDD

```ts
it('should return aggregated metrics', async () => {
  const result = await dashboard.execute(companyId)
  expect(result.totalMissions).toBeDefined()
})
```

---

## 🧱 Arquitetura

* Aggregation Service
* Read Models (CQRS recomendado)
* Cache (Redis futuro)

---

---

