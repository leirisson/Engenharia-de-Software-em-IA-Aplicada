# 🧠 CLAUDE.md — Módulo: REPORTS

---

# 🎯 Objetivo

Gerar relatórios a partir das execuções das missões.

---

# 🧠 Regras de Negócio

* Relatório pertence a uma missão
* Deve conter imagem
* Deve conter resultado da IA
* Não pode existir sem execução da missão

---

# 🧩 Casos de Uso

* CreateReport
* GetReportByMission
* ListReports

---

# 🧪 TDD

```ts
it('should create report with AI result', async () => {
  const report = await createReport.execute(data)
  expect(report.aiResult).toBeDefined()
})
```

---

# 🧱 Estrutura

```id="reports-structure"
reports/
 ├── domain/
 ├── application/
 ├── infra/
 ├── tests/
```

---
