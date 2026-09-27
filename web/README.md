# web — shadcn-structured React app

Vite + React + TypeScript + Tailwind CSS v4, laid out like a shadcn project. It is separate from the Remotion films at the repo root.

- `components.json`: shadcn config (aliases `@/components`, `@/components/ui`, `@/lib/utils`)
- `src/components/ui/`: shadcn UI components (`hero.tsx`, the ShaderShowcase hero; `demo.tsx`)
- `src/lib/utils.ts`: the `cn()` helper
- `src/index.css`: Tailwind and the theme variables

```bash
cd web
npm install
npm run dev      # http://localhost:5173
npm run build
```
