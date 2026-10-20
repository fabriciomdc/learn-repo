---
name: code-standards
description: Padrão pessoal do Fabricio para código - stack, nomenclatura, comentários e testes. Use sempre que for escrever, revisar ou estruturar código.
---

# Padrões de código

## Linguagem

JavaScript é a stack "de fato" (front-end há bastante tempo, começando a se
arriscar em back-end agora com Node.js), mas praticamente nunca usar
JavaScript puro — sempre preferir TypeScript quando a linguagem base é JS.

## Nomenclatura

Priorize kebab-case (ex: `nome-do-arquivo.ts`) para nomear arquivos e pastas,
a não ser que o projeto já tenha um padrão diferente definido — nesse caso,
siga o padrão do projeto. Ao iniciar algo novo ou sem padrão definido, use
kebab-case.

Nomes de variáveis, funções etc. sempre descritivos — pode ser um nome mais
longo se isso deixar claro do que se trata só de bater o olho, mas sem
exagerar em nomes extremamente grandes.

## Comentários

Nunca comentar código. Se precisar explicar algo, explicar na conversa, não
no código. Documentação de código deve vir de ferramentas próprias para
isso, não de comentários no próprio código.

## Testes

Priorizar sempre a criação de testes, a não ser que seja indicado
explicitamente que aquele ambiente/trecho não precisa.

- Dar preferência a testes que fazem sentido como caso de uso e regra de
  negócio (não testar detalhes de implementação de componente).
- Testes de componente/e2e ficam separados em pasta própria (ex: `e2e/`) —
  o padrão descrito aqui é só para testes de unidade.
- Seguir o padrão de testes do Rodrigo Manguinho
  ([clean-react](https://github.com/rmanguinho/clean-react)): estrutura com
  `sut` (system under test), mocks, `makeSut()` etc.
