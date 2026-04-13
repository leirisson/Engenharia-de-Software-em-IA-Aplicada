# 🧠 CLAUDE.md — Módulo: USERS (Promotores)

---

# 🎯 Objetivo

Gerenciar promotores e usuários do sistema.

---

# 🧠 Regras de Negócio

* Usuário pertence a uma empresa
* Pode ter roles: ADMIN | PROMOTOR
* Usuário pode ser ativado/desativado
* Promotor só acessa suas missões

---

# 🧩 Casos de Uso

* CreateUser
* UpdateUser
* DeactivateUser
* ListUsersByCompany

---

# 🧪 TDD

```ts
it('should not create user without company', async () => {
  await expect(createUser.execute(data))
    .rejects.toThrow()
})
```

---

# 🧱 Estrutura

```id="users-structure"
users/
 ├── domain/
 │    ├── entities/User.ts
 │
 ├── application/
 │    ├── use-cases/CreateUser.ts
 │
 ├── infra/
 ├── tests/
```

---

# 🧼 Clean Code

* Regra de negócio no domínio
* UseCases sem dependência de framework

---
