---
name: architecture
description: Padrão pessoal do Fabricio para arquitetura de front-end, baseado no Clean Architecture do Rodrigo Manguinho (clean-react). Use ao criar feature, caso de uso, hook, componente ou ao decidir onde um código deve ficar.
---

# Arquitetura (Clean Architecture, estilo Manguinho)

Base: [clean-react](https://github.com/rmanguinho/clean-react). Se o projeto já
define estrutura própria, siga o projeto.

## Camadas

- **`domain/`**: o núcleo. Models, contratos dos casos de uso (interfaces) e
  erros de negócio. Não importa nada de fora, nem React.
- **`data/`**: implementa os casos de uso do domínio. Depende de protocolos
  (interfaces de http, storage) e nunca de uma lib concreta.
- **`infra/`**: implementações concretas dos protocolos da `data`
  (fetch/axios, localStorage).
- **`presentation/`**: React. Componentes, páginas, hooks e contexts. Só
  conhece o `domain` (os contratos), nunca a `data` nem a `infra`.
- **`main/`**: composição. Factories que montam caso de uso + infra e injetam
  na `presentation`, rotas e ponto de entrada. É o único lugar que conhece
  todas as camadas.

## Regra de dependência

As dependências apontam para dentro: `presentation`, `data` e `infra` dependem
do `domain`; o `domain` não depende de ninguém. A `presentation` recebe o caso
de uso por props, hook ou context, sem instanciar nada.

## Organização das pastas

Por feature (no learn-repo, por missão ou tópico), com as camadas dentro:

```
src/<feature>/
├── domain/
├── data/
├── infra/
├── presentation/
└── main/
```

Código realmente compartilhado entre features sobe para `src/shared/` com a
mesma divisão de camadas. Só extrair quando houver o segundo uso (YAGNI).

## Regras

- **Sem fetch, storage ou regra de negócio dentro de componente.** O
  componente renderiza e dispara ações.
- **Estado e efeitos ficam em hooks na `presentation`**, que chamam o caso de
  uso. O componente consome o hook.
- **Casos de uso pequenos e de uma ação** (`SearchItems`, `LoadMissionProgress`),
  recebendo dependências no construtor ou como argumento.
- **Erros de negócio viram classes de erro do `domain`**, traduzidas em mensagem
  na `presentation`.
- **Sem comentários**: o nome das camadas e dos arquivos explica a intenção.

## Testes

Seguem o `code-standards`: `sut`, `makeSut()` e spies/mocks dos protocolos.
Testar regra de negócio na `data` e no `domain`, e os hooks pelo comportamento.
Testes de componente e e2e ficam em pasta própria.

## Exemplo mínimo

```ts
export interface SearchItems {
  search(query: string, signal: AbortSignal): Promise<string[]>
}
```

```ts
export class RemoteSearchItems implements SearchItems {
  constructor(private readonly httpClient: HttpClient) {}

  async search(query: string, signal: AbortSignal) {
    const response = await this.httpClient.get({ url: `/items?q=${query}`, signal })
    return response.body
  }
}
```

A `presentation` recebe `SearchItems`; a factory em `main/` entrega
`RemoteSearchItems` com o `HttpClient` da `infra`.
