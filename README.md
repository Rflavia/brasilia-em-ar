# Brasília em Ar

Projeto independente sobre clima e qualidade do ar no Distrito Federal, reunindo desenvolvimento web, design e análise de dados.

## Etapa atual

Página inicial com identidade visual e ilustração de Brasília, com navegação para uma página de condições. A consulta inclui clima, PM2.5, explicações e gráfico interativo com períodos e resumo estatístico. Todos os valores exibidos são **ilustrativos**; a integração com fontes de dados será construída em uma próxima etapa.

## Executar localmente

Recomendado: Node.js 24 e npm. Na pasta do projeto:

```bash
npm.cmd ci
npm.cmd run dev
```

Abra o endereço informado pelo terminal. A página inicial funciona sem a API antiga.

## Estrutura desta etapa

- `src/components/brasilia/home-page.tsx`: abertura, condições e navegação.
- `src/components/brasilia/air-history.tsx`: gráfico, resumo estatístico e tabela acessível.
- `src/styles/brasilia.css`: cores, fontes, espaçamento e responsividade.
- `src/mocks/weather-preview.ts` e `air-history-preview.ts`: valores e séries demonstrativas.
- `src/routes/index.tsx` e `condicoes.tsx`: páginas de início e consulta.

O gráfico usa leituras por hora em “Hoje” e médias diárias em “7 dias” e “30 dias”. Os indicadores são calculados a partir da série selecionada. Todos os pontos são fictícios; os períodos maiores usam um cenário de setembro e não representam o histórico real. Não há classificação de saúde ou previsão.

A base usa React, TypeScript, Tailwind CSS e TanStack Start. As rotas legadas de análise, histórico, resultados e perfil ainda aguardam migração e não fazem parte da navegação nova.
