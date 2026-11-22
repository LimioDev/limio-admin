# limio-admin

Painel web do administrador do LIMIO: dashboard, fila de denúncias, análise e decisão com sanção.

React + Vite + TypeScript. Arquitetura e regras de trabalho em [AGENTS.md](AGENTS.md).

## Rodar

```bash
cp .env.example .env   # ajuste VITE_API_URL se a API não estiver em localhost:8080
npm install
npm run dev
```

`npm run build` e `npm run lint` precisam passar antes de cada commit.
