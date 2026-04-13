# 🧠 CLAUDE.md — Módulo: AUTH (Autenticação)

---

# 🎯 Objetivo

Gerenciar autenticação e autorização dos usuários do sistema.

---

# 🧪 Estratégia de Desenvolvimento (TDD)

### Ciclo obrigatório:

1. 🔴 RED — Criar teste falhando
2. 🟢 GREEN — Implementar o mínimo para passar
3. 🔵 REFACTOR — Melhorar código mantendo testes

---

# 🧠 Regras de Negócio

* Usuário deve ter email único
* Senha deve ser criptografada
* Login deve retornar JWT válido
* Token deve expirar
* Apenas usuários ativos podem autenticar

---

# 🧩 Casos de Uso

* RegisterUser
* LoginUser
* ValidateToken

---

# 🧱 Estrutura (DDD)

```id="auth-structure"
auth/
 ├── domain/
 │    ├── entities/User.ts
 │    ├── value-objects/Email.ts
 │
 ├── application/
 │    ├── use-cases/LoginUser.ts
 │    ├── use-cases/RegisterUser.ts
 │
 ├── infra/
 │    ├── repositories/UserRepository.ts
 │    ├── services/JwtService.ts
 │
 ├── tests/
```

---

# 🧪 Exemplo TDD

```ts
describe('LoginUser', () => {
  it('should authenticate user with valid credentials', async () => {
    const result = await loginUser.execute({
      email: 'test@test.com',
      password: '123456'
    })

    expect(result.token).toBeDefined()
  })
})
```

---

# 🧼 Clean Code

* Métodos pequenos
* Sem lógica no controller
* Domínio isolado
* Nomes explícitos

---
