# 🧠 CLAUDE.md — Módulo: COMPANIES

---

# 🎯 Objetivo

Gerenciar empresas clientes do sistema.

---

# 🧠 Regras de Negócio

* Empresa deve ter nome único
* Pode ter múltiplos promotores
* Pode ter múltiplas missões

---

# 🧩 Casos de Uso

* CreateCompany
* UpdateCompany
* ListCompanies

---

# 🧪 TDD

```ts
it('should create a company successfully', async () => {
  const company = await createCompany.execute(data)
  expect(company.id).toBeDefined()
})
```

---

# 🧱 Estrutura

```id="companies-structure"
companies/
 ├── domain/
 ├── application/
 ├── infra/
 ├── tests/
```

---
