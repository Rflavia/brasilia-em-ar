# Brasília em Ar

Clima e qualidade do ar de Brasília em uma interface que reúne desenvolvimento web, design e análise de dados.

## Dados conectados

A página inicial apresenta o projeto. Em **Condições**, o site consulta uma API própria (`GET /api/condicoes`) que reúne os dados de clima da Open-Meteo e as estimativas de PM2.5 do modelo global CAMS/Copernicus, distribuídas pela Open-Meteo. Não são medições de um sensor local nem um mapa de todo o Distrito Federal.

O gráfico permite consultar hoje, 7 e 30 dias. As estatísticas são calculadas sobre a série selecionada. A interface trata carregamento, falha parcial, indisponibilidade e dados desatualizados, sem substituir falhas por valores fictícios.

## Executar

Use **Node.js 24**. No terminal do VS Code, dentro da pasta do projeto:

```powershell
npm.cmd ci
npm.cmd run dev
```

Abra o endereço informado pelo terminal. Não é necessário iniciar outra API, cadastrar chave ou instalar Python. A consulta exige internet. A hospedagem precisa executar o servidor TanStack Start; GitHub Pages sozinho não executa esse endpoint.

```powershell
npm.cmd test
npm.cmd run build
```

## Como os dados são tratados

- Localização fixa: Brasília (`-15.7939, -47.8828`), fuso `America/Sao_Paulo`.
- Horários são recebidos em segundos UTC e apresentados no horário de Brasília. O horário de cada fonte aparece no respectivo quadro.
- Hoje: estimativas horárias até o menor entre o horário atual e a referência da fonte. Horas futuras são excluídas.
- 7 e 30 dias: dias anteriores completos, sem incluir o dia atual. A média diária exige 24 valores válidos. Valores ausentes permanecem como lacunas; zero é um valor válido.
- Média, mínimo e máximo ignoram lacunas. Para os períodos diários, os extremos correspondem a **médias diárias**, não aos extremos horários. A média do período considera apenas os dias completos disponíveis.
- O texto do quadro verde acompanha o componente PM2.5 do índice europeu retornado pela fonte. Não representa o IQAr brasileiro nem uma classificação conjunta de todos os poluentes.
- A fonte global CAMS tem resolução espacial aproximada de 45 km e resolução temporal nativa de 3 horas; os valores horários distribuídos pela API são estimativas do modelo. O passado disponibilizado pela API inclui previsões arquivadas, não observações validadas de estações.
- Requisições às fontes têm prazo de 8 segundos. Cache por instância: 5 minutos em sucesso completo e 1 minuto em resposta parcial, com deduplicação de consultas simultâneas. Cache HTTP de até 5 minutos em sucesso completo; erros não são armazenados. A interface consulta novamente a cada 10 minutos enquanto está em uso e oferece atualização manual, respeitando o cache.

## Estrutura

- `src/routes/api.condicoes.ts`: endpoint HTTP e respostas de erro.
- `src/services/conditions.server.ts`: consultas externas, validação de unidades e valores, falha parcial e cache.
- `src/lib/conditions.ts`: contrato, fuso, séries temporais e estatísticas.
- `src/hooks/use-conditions.ts`: consulta, atualização e estado da interface.
- `src/components/brasilia/`: abertura, quadros e gráfico.
- `tests/conditions.test.ts`: testes de datas, lacunas, médias, validação, falhas e cache.

Base: React, TypeScript, TanStack Start, React Query e Recharts. As rotas legadas de análise, histórico, resultados e perfil aguardam migração e não fazem parte da navegação nova. Os arquivos em `src/mocks/` guardam a antiga prévia visual e não alimentam as páginas atuais.

## Fontes

[Open-Meteo — clima](https://open-meteo.com/en/docs) · [Open-Meteo — qualidade do ar](https://open-meteo.com/en/docs/air-quality-api) · [CAMS/Copernicus](https://atmosphere.copernicus.eu/) · [Licença CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

O projeto calcula médias e adapta a apresentação dos dados. A API pública da Open-Meteo está sujeita aos [termos e limites de uso não comercial](https://open-meteo.com/en/terms).
