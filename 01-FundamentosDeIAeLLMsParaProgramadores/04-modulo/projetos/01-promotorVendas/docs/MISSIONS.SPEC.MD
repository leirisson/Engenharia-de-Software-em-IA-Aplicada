# 🧠 CLAUDE.md — Módulo: MISSIONS

---

# 🎯 Objetivo

Gerenciar tarefas atribuídas aos promotores.

---

# 🧠 Regras de Negócio

* Missão deve estar vinculada a uma empresa
* Pode ser atribuída a um ou mais promotores
* Deve ter data limite
* Pode exigir evidência (foto)

---

# 🧩 Casos de Uso

* CreateMission
* AssignMission
* CompleteMission

---

# 🧪 TDD

```ts
it('should not complete mission without evidence', async () => {
  await expect(completeMission.execute(data))
    .rejects.toThrow()
})
```

---

# 🧱 Estrutura

```id="missions-structure"
missions/
 ├── domain/
 ├── application/
 ├── infra/
 ├── tests/
```

---
