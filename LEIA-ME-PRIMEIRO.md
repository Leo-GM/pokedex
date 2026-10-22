# Como montar o projeto (10 minutos)

## 1. Crie o projeto base

```bash
npx create-next-app@latest pokedex --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*"
cd pokedex
```

(Responda "No" ao `src/` e mantenha o alias `@/*`.)

## 2. Instale as dependências

```bash
npm install @tanstack/react-query
npm install -D @types/node@22 vitest jsdom @vitejs/plugin-react @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event
```

Instale tudo na mesma linha, com `@types/node@22`: o Vitest pede essa versão e, separado, o npm reclama de conflito (ERESOLVE).

## 3. Copie os arquivos deste zip para dentro do projeto

Mantenha as mesmas pastas (`app/`, `components/`, `hooks/`, `lib/`) e copie também `vitest.config.mts`, `vitest.setup.ts` e `README.md`.
Aceite substituir `app/layout.tsx` e `app/page.tsx`.

## 4. Ajuste dois arquivos que já existem

**package.json** — adicione dois scripts em `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

**next.config.ts** — permita as imagens da PokéAPI (mantenha o que já existir no arquivo):

```ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "raw.githubusercontent.com", pathname: "/PokeAPI/sprites/**" },
    ],
  },
  // ...o resto que já estava aí
};
```

## 5. Rode

```bash
npm run dev     # abre em http://localhost:3000
npm test        # 11 testes
npm run build   # confere se o build de produção passa
```

## 6. Publique

Suba para o GitHub e importe o repositório na Vercel (vercel.com/new). Depois cole o link no README.
