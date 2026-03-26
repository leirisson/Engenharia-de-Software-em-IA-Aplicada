# 🧠 CLAUDE.md — Módulo: STORES

---

# 🎯 Objetivo

Gerenciar lojas onde as missões serão executadas.

---

# 🧠 Regras de Negócio

* Loja pertence a uma empresa
* Deve conter endereço
* Pode ter múltiplas missões

---

# 🧩 Casos de Uso

* CreateStore
* UpdateStore
* ListStores

---

# 🧪 TDD

```ts
it('should create store with valid address', async () => {
  const store = await createStore.execute(data)
  expect(store.address).toBeDefined()
})
```

---

# 🧱 Estrutura

```id="stores-structure"
stores/
 ├── domain/
 ├── application/
 ├── infra/
 ├── tests/
```

---
