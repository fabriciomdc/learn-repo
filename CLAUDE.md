# Contexto do projeto: learn-repo

Repositório de estudos de front-end (React + TypeScript) para voltar ao mercado como dev pleno. O projeto de estudo é um jogo simples, estilo pixel art top-down (tipo Stardew), em que cada caso de estudo é uma missão. Serve como estudo e como portfólio navegável.

## Como trabalhar comigo

- Respostas curtas e diretas, sempre em português (PT-BR)
- Confirmar antes de agir por conta própria
- Não despejar vários comandos de shell para eu colar: editar os arquivos direto
- Seguir os padrões da minha pasta `.claude` (skills `code-standards`, `git-conventions`, `task-standards`)

## Padrões que sigo

- TypeScript sempre, arquivos em kebab-case
- Sem comentários no código (a explicação vai no README da missão)
- Testes no padrão Manguinho: `sut` e `makeSut()`, foco em regra de negócio, sem testar detalhe de implementação
- Commits no padrão Conventional Commits, em inglês. Gitflow e squash merge
- YAGNI: nada de ferramenta configurada antes de precisar (Vitest entra no primeiro teste real, Husky só quando fizer sentido)

## Estrutura

Um único projeto Vite + React + TS em `react-patterns/` (nome ainda pode mudar, decisão pendente):

```
src/
├── game/                      # Kaplay (mundo, player, NPC) + overlay React
│   ├── create-game.ts
│   ├── game-canvas.tsx
│   ├── mission-overlay.tsx
│   ├── mission-progress-storage.ts   # localStorage
│   └── use-mission-progress.ts
├── missions/
│   ├── mission.ts             # tipo Mission
│   └── <nome-tecnico>/mission.ts
├── topics/                    # tópicos antigos (use-effect-debounce-search)
└── App.tsx
```

- Mundo em Kaplay, sem React no loop do jogo. Overlay em React abre a missão
- O canvas é criado dentro do `useEffect` (necessário por causa do StrictMode, que monta duas vezes em dev)
- Nome da pasta de missão é técnico (`use-effect-stale-closure`). O trocadilho "The One With..." fica só no título
- Planejado: mover `topics/` para o formato de missão (`domain/`, `data/`, `presentation/` + `README.md`) quando fizer sentido

## Estado atual

Feito (branch `feat/game-mvp`, ainda sem PR):
- Setup Vite + React + TS, ESLint e Prettier
- Tópico `use-effect-debounce-search` ("The One With the Stale Closure" era o apelido planejado para a missão de stale closure)
- Mundo Kaplay: quadrado azul (setas) e NPC laranja, tecla E perto do NPC abre a missão
- Missão `use-effect-stale-closure` em múltipla escolha, com feedback, explicação e progresso no `localStorage`

Pendente:
- Erro de lint existente em `topics/use-effect-debounce-search/presentation/use-search.ts:14` (`react-hooks/set-state-in-effect`)
- Testar a interação no navegador (o overlay só passou no build, não foi testado clicando)
- Segunda missão (ex.: race condition do debounce, `React.memo` + `useCallback`)
- README de cada missão (decisão técnica + apelido Friends)
- Primeiro teste no padrão Manguinho (instalar Vitest nesse momento)
- Abrir PR de `feat/game-mvp` para `main` (squash merge)
- Decidir o nome do jogo/projeto

## Roadmap de estudo (prioridade pelo que o mercado cobra em 2026)

1. Filtro de currículo: React + Hooks, TypeScript, JavaScript ES6+, Git, CSS moderno
2. Etapa técnica: Next.js (App Router, SSR/SSG/ISR), estado de UI (Zustand/Redux), consumo de API REST, testes (Jest/Vitest + Testing Library)
3. Destaque: React Query/SWR, performance (Core Web Vitals), fluxos assíncronos complexos
4. Diferencial: acessibilidade, CI/CD, Docker, cloud, design system

Método por missão: mini-projeto isolado, explicar o porquê por escrito e validar (quiz ou simulação de entrevista). O ponto fraco identificado é explicar o "porquê" técnico (ex.: por que `React.memo` precisa de `useCallback`).

Evolução do jogo: editor de código embutido (Sandpack) só nas missões avançadas.

## Ambiente

- Máquina de trabalho (Pop!_OS). O ambiente pessoal fica isolado em um container Distrobox chamado `pessoal`, com home própria em `~/distrobox/pessoal`
- Dentro do container: Git, SSH, VS Code e Claude Code com login da conta pessoal, sem misturar com o do trabalho
- Projeto local em `/home/fabriciomdec/Documentos/fabriciomdec/pessoal/learn-repo`
- Rodar: `cd react-patterns && npm install && npm run dev`
