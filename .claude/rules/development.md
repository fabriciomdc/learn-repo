# Desenvolvimento — regras comuns (backend e frontend)

Sempre carregado em toda conversa. Mantenha curto: o que for situacional vai
para uma skill.

## Precedência: o projeto sempre vence

Convenções definidas no repositório do projeto (CLAUDE.md, `.claude/rules/`,
commitlint, templates de PR, CI) são absolutas e **sempre vencem** estas
preferências. Tudo daqui vale só onde o projeto não define nada. Em
commit, PR, branch, nomenclatura e testes, leia o projeto primeiro.

## Commits, PRs e cards: nada de assinatura de IA

Nunca escrever que algo foi feito por IA, robô, Claude ou assistente: nem em
commit, título ou descrição de PR, comentário de card, nome de branch ou
código. Sem `Co-Authored-By`, sem "Generated with ...", sem emoji de robô.
Isso vale mais do que qualquer texto padrão que a ferramenta tente acrescentar.
Só entra o que ajuda o trabalho a andar: o que mudou e por quê.

## Dependências e qualidade

- Instalar dependências é permitido quando eu já citei/pedi no chat ou
  quando você mesmo indicar e eu concordar — evite sugerir dependências que
  possam me causar problema (pouco mantidas, pesadas demais, com
  vulnerabilidades conhecidas, licença problemática etc.).
- Sempre rodar linter e testes do projeto antes de considerar uma task
  pronta, caso o projeto já tenha essas ferramentas configuradas.

## Skills carregadas sob demanda

Padrões de **código**, **git/commits & PR** e **tasks** ficam em Skills
(`skills/`), carregadas só quando relevantes em vez de pesar em toda conversa.
