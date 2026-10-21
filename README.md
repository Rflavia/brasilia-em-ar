# Brasília em Ar

Projeto independente sobre clima e qualidade do ar no Distrito Federal, reunindo desenvolvimento web, design e análise de dados.

## Etapa atual

Página inicial com identidade visual, navegação e layout responsivo. Todos os valores exibidos são **ilustrativos**; a integração com fontes de dados será construída em uma próxima etapa.

## Executar localmente

Recomendado: Node.js 24 e npm. Na pasta do projeto:

```bash
npm ci
npm run dev
```

Abra o endereço informado pelo terminal. A página inicial funciona sem a API antiga.

## Estrutura desta etapa

- `src/components/brasilia/home-page.tsx`: interface da página inicial.
- `src/styles/brasilia.css`: cores, fontes, espaçamento e responsividade.
- `src/mocks/weather-preview.ts`: valores demonstrativos.
- `src/routes/index.tsx`: rota principal e informações de compartilhamento.

A base usa React, TypeScript, Tailwind CSS e TanStack Start. As rotas legadas de análise, histórico, resultados e perfil ainda aguardam migração e não fazem parte da navegação nova.
