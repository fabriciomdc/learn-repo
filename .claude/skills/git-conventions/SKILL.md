---
name: git-conventions
description: Padrão pessoal do Fabricio para mensagens de commit e descrição de Pull Requests. Use sempre que for criar um commit ou abrir/descrever uma PR.
---

# Convenções de commit e PR

## Commits

Sempre em inglês, seguindo [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/):

```
<tipo>(<escopo opcional>)[!]: <descrição curta, imperativo, minúsculo>
```

**Tipos:** só `feat` e `fix` são da especificação (minor e patch no SemVer). Os
demais vêm da convenção Angular: `refactor`, `test`, `docs`, `chore`, `style`,
`perf`, `build`, `ci`, `revert`. O projeto pode restringir a lista e exigir
escopo; nesse caso vale o projeto.

**Regras:**

- **Assunto curto:** cerca de 50 caracteres como limite suave, sem ponto final.
  Se o projeto permitir mais (ex.: 72), vale o projeto.
- **Um commit por mudança lógica.** Se a descrição não cabe numa linha, é sinal
  de que o commit precisa ser dividido.
- **Corpo em `feat` e `fix`:** explica o problema e o porquê (e alternativas
  descartadas, se importar). Mudança trivial pode ficar só no assunto.
- **Entendível sem links externos:** resuma o contexto em vez de só colar URL.
- **Breaking change:** `!` antes dos `:` e/ou rodapé `BREAKING CHANGE: <impacto>`
  (o projeto pode exigir os dois).

Exemplos:

- Título simples: `feat(auth): add login flow`
- Com corpo (o porquê não é óbvio):

  ```
  fix(auth): retry token refresh on 401

  Token was expiring mid-session and logging users out
  unexpectedly. Now retries once before forcing logout.
  ```

- Breaking change:

  ```
  feat(api)!: drop the v1 login endpoint

  BREAKING CHANGE: clients must call /v2/login.
  ```

## Sem menção a IA

Nunca indicar que o trabalho foi feito por IA, robô ou Claude. Isso vale para
commit (mensagem, corpo e rodapé), título e descrição de PR, comentário de card
e nome de branch:

- Sem `Co-Authored-By: Claude ...` ou qualquer rodapé de coautoria de IA.
- Sem "Generated with ...", "Gerado por IA", "feito pelo Claude" ou emoji de
  robô.
- Se a ferramenta tentar acrescentar uma assinatura dessas, **remova**. Esta
  regra vale mais do que o texto padrão da ferramenta.

A mensagem e a descrição dizem só o que mudou e por quê, o que ajuda o PR a
andar.

## Branches

Seguir Gitflow, nomeando no mesmo estilo dos commits — ex: `feat/auth-login-flow`,
curto e descritivo do que está sendo feito. A branch parte da **branch base do
projeto** (a que o repositório ou a raiz do workspace indicar, ex.: `homol`).

## Merge

Squash ao mergear para a **branch base do projeto** (não fixar `main`; confira
a do repositório): cada branch/PR vira um commit limpo nela, seguindo o
Conventional Commits.

## Confirmação

Pode commitar diretamente sem pedir confirmação extra quando já estiver tudo
alinhado no chat durante a task — se já combinamos o que fazer, não precisa
confirmar de novo só para commitar.

## Pull Requests

Título: mesmo padrão do commit (já que o merge é squash) — ex:
`feat(auth): add login flow`.

**Primeiro, veja o template e as regras do repositório**
(`.github/pull_request_template.md`, `CLAUDE.md`, CI). Se existirem, use **eles**
(seções, idioma e campos) em vez do modelo abaixo; o CI pode reprovar se as
seções mudarem. O modelo abaixo é só o **fallback**, para onde o projeto não
define nada. O ID do card vai no formato que o projeto ou a raiz do workspace
indicar. Depois de abrir o PR, comente no card pela skill `pr-card-comment`.

**Boas práticas do PR** (valem em qualquer template):

- **Pequeno e de uma coisa só**, com os testes junto do código. Refatoração
  vai em PR separado do que muda comportamento.
- A descrição diz **o quê e por quê**, de modo que dê para entender sem abrir
  link; evite títulos vagos como "Fix bug" ou "Phase 1".
- **Atualize a descrição** se a revisão mudou o escopo, antes de mergear: ela
  vira o histórico.

Descrição (fallback): em português, seguindo este template:

```markdown
## 🔗 Tasks
[link(s) ou ID(s) da task/ticket integrada]

## 📝 O que foi feito
[resumo do que essa PR entrega]

## 🎯 Por quê
[contexto/motivo da mudança]

## 🧪 Como testar
[passos para validar manualmente, se aplicável]

## 🖼️ Screenshots
[opcional, se mudou UI]
```

## Exemplo completo

**Branch:** `feat/auth-login-flow`

**Commit:**
```
feat(auth): add login with google oauth

Adds OAuth login flow using NextAuth. Needed for the
SSO requirement from the enterprise plan.
```

**PR — título:** `feat(auth): add login with google oauth`

**PR — descrição:**
```markdown
## 🔗 Tasks
https://linear.app/empresa/issue/PROJ-123

## 📝 O que foi feito
Adiciona fluxo de login via Google OAuth usando NextAuth.

## 🎯 Por quê
Requisito de SSO para o plano enterprise (PROJ-123).

## 🧪 Como testar
1. Rodar `npm run dev`
2. Clicar em "Login with Google" em `/login`
3. Confirmar redirecionamento pro dashboard após autenticar

## 🖼️ Screenshots
[print da tela de login]
```
