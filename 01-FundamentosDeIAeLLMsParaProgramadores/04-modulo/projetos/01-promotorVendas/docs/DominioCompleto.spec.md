# 🧠 CLAUDE.md — Domínio Completo (ShelfVision)

---

# 🎯 1. VISÃO DO DOMÍNIO

Sistema SaaS para gestão de promotores e auditoria de gôndola com IA, focado em:

* Execução de missões
* Coleta de evidências
* Análise automatizada
* Engajamento e performance

---

# 🧩 2. ENTIDADES PRINCIPAIS

---

## 👤 User

Representa qualquer usuário do sistema.

### Atributos:

* id
* name
* email
* password
* role (ADMIN | PROMOTOR)
* status (ACTIVE | INACTIVE)
* companyId

---

### Regras:

* Email deve ser único
* Usuário deve pertencer a uma empresa
* Usuário inativo não pode autenticar
* Promotor só acessa suas missões

---

---

## 🏢 Company

Empresa cliente do sistema.

### Atributos:

* id
* name
* status

---

### Regras:

* Nome deve ser único
* Empresa só acessa seus dados (multi-tenant)

---

---

## 🏪 Store

Local onde as missões são executadas.

### Atributos:

* id
* name
* address
* latitude
* longitude
* companyId

---

### Regras:

* Deve pertencer a uma empresa
* Deve possuir localização válida

---

---

## 🎯 Mission

Tarefa atribuída ao promotor.

### Atributos:

* id
* title
* description
* type (PHOTO | CHECKLIST)
* status (PENDING | IN_PROGRESS | COMPLETED)
* dueDate
* companyId

---

### Regras:

* Deve ter pelo menos um promotor
* Deve ter data limite
* Não pode ser concluída sem evidência (se tipo PHOTO)
* Deve estar vinculada a uma loja

---

---

## 🔗 MissionAssignment

Relaciona missão com promotor.

### Atributos:

* id
* missionId
* userId
* status

---

### Regras:

* Promotor só pode executar missão atribuída
* Missão pode ter múltiplos promotores

---

---

## 📸 Report

Execução da missão.

### Atributos:

* id
* missionId
* userId
* storeId
* imageUrl
* aiResult (JSON)
* score
* status (VALID | INVALID | SUSPICIOUS)
* createdAt

---

### Regras:

* Deve conter imagem válida
* Deve estar associado a uma missão
* Deve passar por análise de IA
* Pode ser marcado como suspeito

---

---

## 🧠 AIResult (Value Object)

Resultado da análise de imagem.

### Estrutura:

```json id="airesult"
{
  "products": [],
  "brands": [],
  "price": null,
  "confidence": 0.0
}
```

---

### Regras:

* Deve conter ao menos um dado analisado
* Confidence deve ser >= 0

---

---

## 🏆 Score

Pontuação da execução.

### Atributos:

* id
* reportId
* value
* details (JSON)

---

### Regras:

* Base inicial: 100
* Não pode ser negativo
* Deve refletir qualidade da execução

---

---

## 🕵️ FraudAnalysis

Análise de fraude.

### Atributos:

* id
* reportId
* status (OK | SUSPICIOUS)
* reasons (ARRAY)

---

### Regras:

* Deve listar motivos claros
* Pode bloquear score

---

---

## 🏅 Ranking

Posição do promotor.

### Atributos:

* userId
* scoreTotal
* position

---

### Regras:

* Atualizado periodicamente
* Baseado em score acumulado

---

---

## 🔔 Notification

Notificações do sistema.

### Atributos:

* id
* userId
* message
* type
* read

---

### Regras:

* Deve ser relevante
* Deve ser entregue rapidamente

---

---

# 🔗 3. RELACIONAMENTOS

* Company → Users (1:N)
* Company → Stores (1:N)
* Company → Missions (1:N)
* Mission → MissionAssignment (1:N)
* Mission → Report (1:N)
* User → Report (1:N)
* Report → Score (1:1)
* Report → FraudAnalysis (1:1)

---

# 🧠 4. REGRAS DE NEGÓCIO GLOBAIS

---

## 📸 Execução de missão

* Deve exigir evidência
* Deve validar imagem
* Deve passar por IA

---

## ⏱️ Tempo mínimo

* Execução abaixo do tempo mínimo é suspeita

---

## 📍 Localização

* Usuário deve estar próximo da loja

---

## 🧠 Score

* Deve ser calculado automaticamente
* Deve penalizar erros

---

## 🕵️ Fraude

* Deve ser detectada automaticamente
* Deve impactar score

---

## 🏆 Ranking

* Deve ser atualizado com frequência
* Deve ser visível ao usuário

---

# 🧩 5. CASOS DE USO PRINCIPAIS

---

## Auth

* LoginUser
* RegisterUser

---

## User

* CreateUser
* ListUsers

---

## Mission

* CreateMission
* AssignMission
* CompleteMission

---

## Report

* SubmitReport
* AnalyzeReport

---

## Score

* CalculateScore

---

## Fraud

* DetectFraud

---

## Dashboard

* GetMetrics

---

# ⚠️ 6. INVARIANTES (REGRAS CRÍTICAS)

---

* ❌ Não existe missão concluída sem report
* ❌ Não existe report sem imagem
* ❌ Usuário não executa missão não atribuída
* ❌ Score não pode ser negativo
* ❌ Empresa não acessa dados de outra

---

# 🧪 7. TDD (OBRIGATÓRIO)

---

## Regras

* Todo UseCase começa com teste
* Cobrir regras de negócio
* Testar cenários de erro

---

## Exemplo

```ts id="tdd-example"
it('should not allow mission completion without image', async () => {
  await expect(completeMission.execute(data))
    .rejects.toThrow()
})
```

---

# 🧼 8. CLEAN CODE

---

* Métodos pequenos
* Sem lógica no controller
* Domínio isolado
* Nomes explícitos

---

# 🧱 9. DDD

---

Camadas:

* Domain → regras
* Application → casos de uso
* Infra → banco/API

---

# 🚀 10. OBJETIVO FINAL

---

Criar um sistema que:

* Automatiza auditoria
* Reduz fraude
* Aumenta engajamento
* Gera inteligência de negócio

---
