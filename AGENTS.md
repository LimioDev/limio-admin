# limio-admin — instruções para qualquer agente de IA (Claude, Codex, Cursor, etc.)

Painel web do administrador do LIMIO: dashboard, fila de denúncias, análise e decisão
com sanção. Stack: React + Vite + TypeScript, React Router, React Query, axios, Zod e
React Hook Form.

Mesma arquitetura do `limio-app` (ADR-0001, MVVM via Container-Presenter com custom
hooks), adaptada para web: no lugar do Expo Router, as rotas do React Router em
`src/rotas/`.

# Git

- Branch por card: `feature/<número>` a partir da `develop`. PR sempre para a `develop`,
  nunca para a `main`.
- Commits pequenos, no padrão `tipo(modulo): descrição (ETI-<número>)`.
  Ex.: `feat(moderacao): fila de denúncias abertas (ETI-118)`.
- Nunca adicionar `Co-Authored-By: Claude`, `Claude-Session:` nem outra atribuição
  a Claude/Anthropic na mensagem de commit. O commit mostra só o autor humano.
- Antes de cada commit: `npm run build` e `npm run lint` sem erro.

# Arquitetura

## Split raiz: `comum/` vs `modulos/`

```
limio-admin/
└── src/
    ├── rotas/    <- React Router: SÓ rotas finas (Container)
    ├── comum/    <- compartilhado entre módulos
    └── modulos/  <- um módulo por domínio, SEM EXCEÇÃO
        ├── administracao/   <- entrada do admin e dashboard
        └── moderacao/       <- fila, análise e decisão de denúncias
```

Critério para subir algo para `comum/`: usado por 2+ módulos **hoje**.

`comum/` tem:

- `componentes/ui/`: design system puro (botão, cartão, campo, tabela...), sem regra de negócio.
- `componentes/layout/`: casca do painel (menu lateral, cabeçalho) e guarda de rota.
- `lib/`: `api.ts` (instância axios com o token e o tratamento de 401/403), `erros.ts`
  (`erroApi`, `mensagemErroApi`), `datas.ts`, `query.ts` (QueryClient).
- `sessao/sessaoAdmin.ts`: único lugar que lê e grava a sessão do admin.
- `tipos/`: `PageResponse<T>` (`respostaPaginadaSchema`), `ErroResponse`, `erros.ts`
  (`CodigoErro` espelhando 1:1 `comum/excecao/enums/CodigoErro.java` do limio-api),
  `LinkTemporario`.

## Camadas MVVM dentro de um módulo (`src/modulos/<dominio>/`)

| Camada | Pasta | Equivalente backend |
|---|---|---|
| Model | `tipos/` + `servico/` | `enums`/`records` + `repository` |
| ViewModel | `viewmodel/`: hook `use<X>ViewModel` | `usecase` |
| View (Presenter) | `view/`: componente burro, só props e render | `controller` |
| Container | rota em `src/rotas/`: arquivo fino | `controller` (fiação HTTP) |

```
src/modulos/<dominio>/
├── tipos/<entidade>.enums.ts     <- const object + union (NÃO enum nativo do TS)
├── tipos/<entidade>.types.ts     <- schema Zod + z.infer (equivalente do record)
├── servico/<entidade>.api.ts     <- chamada axios crua + schema.parse() na fronteira
├── servico/<entidade>.queries.ts <- hooks React Query (chaves, useQuery, useMutation)
├── viewmodel/use<X>ViewModel.ts
└── view/<X>View.tsx (+ view/componentes/)
```

## Regras fixas de dependência

- `modulos/*` só importa de `comum/`. Nunca de outro módulo.
- `src/rotas/*` só importa `viewmodel` e `view` de `modulos/*` e componentes de `comum/`.
  Zero lógica de negócio nas rotas: a rota chama o viewmodel e passa o retorno para a view.
- A view não chama axios, React Query, `sessionStorage` nem `useNavigate`: recebe tudo
  por props (dados, estados de carregamento/erro e callbacks).

## Convenções de tipo

- Enum de domínio: `export const X = { ... } as const` +
  `export type X = (typeof X)[keyof typeof X]`. Nunca `enum` nativo do TS
  (`erasableSyntaxOnly` no tsconfig barra o `enum`).
- DTO da API: schema Zod + `z.infer`. O `.parse()` acontece sempre dentro de `servico/`,
  nunca na view nem no viewmodel. Corpo de requisição também passa pelo schema antes de sair.
- `ErroResponse.codigo` é `z.string()`, não `z.enum(CodigoErro)`: um código novo no back
  não pode esconder a `mensagem`. A tela compara com `CodigoErro.X` e cai no padrão.
- Campos de data do back (`Instant`) chegam como string ISO; formatar só na view, com
  `comum/lib/datas.ts`.

## Contrato da API

- URL base em `VITE_API_URL` (`.env`, não versionado; modelo em `.env.example`, sem segredo).
- Todas as rotas `/admin/**` exigem token de administrador (`Authorization: Bearer`, claim
  `tipo = ADMINISTRADOR`). Sem token: 401 `NAO_AUTENTICADO`. Token de usuário do app:
  403 `ACESSO_NEGADO`.
- 401 e 403 (`ACESSO_NEGADO`) limpam a sessão e levam para a entrada do admin. Isso fica no
  interceptor de `comum/lib/api.ts`, não em cada tela.
- Erros mostram a `mensagem` do `ErroResponse`; sem corpo nesse formato (ex.: sem rede),
  uma mensagem padrão da tela.
- Nenhuma tela marca serviço como pago, mexe em valores ou transfere dinheiro.

# Pendências conhecidas

- **Login do admin (US60):** o back ainda não emite o token do administrador. A entrada
  pede o token e guarda em `sessionStorage`, isolado em `comum/sessao/sessaoAdmin.ts`.
  Trocar pelo login real quando a US60 sair.
