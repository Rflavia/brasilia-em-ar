# Nexus Insights

Crie um protótipo web desktop premium chamado NEXUS.

O produto é uma plataforma de monitoramento e análise de resultados em tempo real.

IMPORTANTE:

Nesta primeira versão, quero construir principalmente a experiência visual e a navegação do produto.

Ainda NÃO existe integração com API real.

Ainda NÃO existe algoritmo real de análise/predição.

Use dados mockados realistas.

Não invente lógica de previsão.

Posteriormente os dados mockados serão substituídos por uma API REST que receberá dados coletados automaticamente por um sistema Python.

==================================================

1. DIREÇÃO CRIATIVA

==================================================

Quero que este produto tenha nível visual de um SaaS premium desenvolvido por uma equipe profissional de produto.

A interface deve ser:

- extremamente limpa

- sofisticada

- minimalista

- moderna

- precisa

- elegante

- orientada a dados

- com excelente tipografia

- com bastante espaço negativo

- com hierarquia visual forte

A sensação deve ser de:

analytics premium + fintech + data intelligence.

IMPORTANTE:

Não quero aparência de dashboard genérico criado por IA.

EVITAR COMPLETAMENTE:

- gradientes roxos

- gradientes azul/roxo

- neon

- glow

- glassmorphism exagerado

- robôs

- estrelas

- ilustrações futuristas genéricas

- excesso de cards

- dezenas de caixas arredondadas

- sombras fortes

- gráficos 3D

- estética gamer

- estética de cassino

- excesso de emojis

- textos gigantes sem propósito

- sidebar tradicional ocupando muito espaço

- interface estilo template administrativo

Não usar emojis na interface.

==================================================

2. IDENTIDADE VISUAL

==================================================

Nome:

NEXUS

Descriptor:

Data Intelligence

Paleta principal:

Background:

#090A0B

Surface:

#101113

Surface secondary:

#151719

Primary text:

#F2F2EF

Secondary text:

#898C91

Border:

#24262A

As cores vermelho, preto e branco NÃO são a identidade visual da aplicação.

Elas representam dados.

Utilizar aproximadamente:

Red:

#E34B4B

Black result:

#292B2F

White result:

#F2F2EF

O branco precisa possuir uma borda discreta para permanecer visível no fundo.

==================================================

3. TIPOGRAFIA E COMPOSIÇÃO

==================================================

Utilize uma fonte sans-serif moderna e sofisticada.

A tipografia deve ser uma parte importante do design.

Use números grandes somente quando eles representam métricas realmente importantes.

Prefira:

grandes espaços

alinhamento preciso

linhas finas

divisores discretos

poucos elementos por área

Não coloque cada métrica dentro de um card.

Utilize composição editorial.

==================================================

4. NAVEGAÇÃO

==================================================

Criar uma navegação lateral extremamente compacta.

No topo:

NEXUS

Data Intelligence

Navegação:

Overview

History

Analysis

Data

Na parte inferior:

Settings

Usar ícones lineares discretos.

A navegação deve ocupar pouco espaço.

O conteúdo é o protagonista.

==================================================

5. HEADER

==================================================

Na área principal:

OVERVIEW

À direita:

● LIVE

Last update

13:42:31

O indicador LIVE deve ter uma pequena animação de pulso extremamente sutil.

Não utilizar glow.

==================================================

6. HERO / MÉTRICA PRINCIPAL

==================================================

Criar uma área de grande impacto visual no início.

Mostrar:

2,008

RESULTS COLLECTED

Abaixo:

Continuous monitoring

Since Sep 18, 2026

O número deve ter bastante destaque e respirar dentro da composição.

Ao carregar a página, animar discretamente:

0 → 2,008

A animação deve ser rápida e sofisticada.

==================================================

7. DISTRIBUIÇÃO

==================================================

Ao lado da métrica principal, mostrar:

50.00%

RED

48.65%

BLACK

1.35%

WHITE

Não colocar essas três informações dentro de três cards.

Criar uma composição visual única.

Adicionar abaixo uma barra horizontal muito fina representando proporcionalmente a distribuição.

As cores devem representar os dados.

==================================================

8. LIVE FEED

==================================================

Criar seção:

LIVE RESULTS

Mostrar uma sequência horizontal dos resultados recentes.

NÃO utilizar emojis.

Cada resultado deve ser representado por um pequeno círculo ou elemento geométrico:

vermelho

preto/grafite

branco

Exemplo conceitual:

● ● ● ● ○ ● ● ● ● ● ● ○ ●

Os elementos devem ter espaçamento perfeito.

Quando passar o mouse:

mostrar um tooltip minimalista:

Number

7

Color

Red

Time

13:41:32

Adicionar:

View complete history →

Quando futuramente um resultado novo chegar pela API, o componente deve estar preparado para uma animação suave de entrada pela direita.

Nesta versão apenas simule esse comportamento.

==================================================

9. ANALYSIS SECTION

==================================================

Essa é uma das partes mais importantes do produto.

Não utilizar dois cards genéricos lado a lado.

Criar uma grande seção editorial dividida visualmente em duas áreas.

Título:

ANALYSIS

Headline:

Turn historical data

into information.

Texto secundário:

Run an analysis using the selected historical dataset.

==================================================

10. DATASET

==================================================

Na parte esquerda da área de análise:

DATASET

Source

Results database

Available

2,008 results

Sample

Criar seletor:

Last 100

Last 500

Last 1,000

Last 2,000

All data

Selecionado inicialmente:

Last 1,000

Mostrar:

STATUS

Ready

Adicionar um pequeno indicador visual.

==================================================

11. EXECUTAR ANÁLISE

==================================================

Criar um botão sofisticado:

RUN ANALYSIS →

Ele deve ser visualmente importante, porém minimalista.

Sem gradiente.

Sem glow.

Sem sombra exagerada.

Ao clicar:

Estado 1:

PREPARING DATA

Estado 2:

PROCESSING DATASET

Estado 3:

ANALYSIS COMPLETE

Criar transições suaves entre os estados.

O processamento pode durar aproximadamente 1 segundo apenas para demonstrar a experiência.

==================================================

12. RESULTADO DA ANÁLISE

==================================================

Antes da execução mostrar apenas:

NO ANALYSIS YET

Run an analysis to view the output.

Após clicar em RUN ANALYSIS, mostrar:

ANALYSIS / 001

DEMO OUTPUT

WHITE

72%

DEMONSTRATION CONFIDENCE

Dataset

1,000 results

Processed

13:43:02

Adicionar claramente, porém de maneira discreta:

SIMULATED DATA

E abaixo:

Demonstration only. Real model integration pending.

IMPORTANTE:

O valor WHITE e 72% são apenas dados mockados para demonstrar a interface.

NÃO criar nenhuma lógica que tente prever resultados.

NÃO utilizar palavras:

Guaranteed

Certain

Will happen

Safe

==================================================

13. HISTÓRICO

==================================================

Depois da análise, criar:

RECENT DATA

Exibir tabela extremamente limpa.

Columns:

TIME

NUMBER

RESULT

Exemplo:

13:41:32    7     RED

13:41:02    11    BLACK

13:40:32    0     WHITE

13:40:02    4     RED

13:39:32    9     BLACK

Utilizar pequenos indicadores de cor.

Não criar tabela pesada com muitas bordas.

Linhas finas e bastante espaçamento.

Adicionar filtros:

ALL

RED

BLACK

WHITE

==================================================

14. WHITE HISTORY

==================================================

Criar uma área:

WHITE OCCURRENCES

Mostrar:

27

TOTAL

30.2

AVERAGE INTERVAL

Mostrar os últimos registros:

13:21:02     31 rounds

12:58:31     27 rounds

12:36:01     34 rounds

12:07:32     29 rounds

Esses dados são demonstrativos.

==================================================

15. INTERAÇÕES

==================================================

Adicionar microinterações sofisticadas:

- hover sutil nos botões

- transições de 150–250ms

- números contando ao carregar

- dropdown com animação discreta

- entrada suave do resultado da análise

- tooltips

- mudança suave dos filtros

- feedback visual ao executar análise

Evitar animações chamativas.

O usuário deve perceber que a interface é extremamente polida sem perceber explicitamente as animações.

==================================================

16. RESPONSIVIDADE

==================================================

Priorizar desktop.

Também deixar responsivo para notebook e tablet.

No celular:

- reorganizar as seções verticalmente

- manter métricas legíveis

- transformar a sequência de resultados em área horizontal rolável

- não simplesmente reduzir tudo

==================================================

17. ESTRUTURA DO CÓDIGO

==================================================

Utilize componentes reutilizáveis.

Separar:

components

pages

services

mock data

types

IMPORTANTE:

Os componentes NÃO devem acessar diretamente os dados mockados.

Criar uma camada de serviço.

Por exemplo:

resultsService

analysisService

Nesta versão esses services retornam dados mockados.

Posteriormente eles serão substituídos por chamadas para uma API REST.

A futura arquitetura será:

Python Collector

        ↓

Database

        ↓

REST API

        ↓

resultsService

        ↓

NEXUS

Para análise:

Results

   ↓

Existing analysis engine

   ↓

API

   ↓

analysisService

   ↓

NEXUS

Não implementar backend nesta versão.

==================================================

18. PÁGINAS

==================================================

Criar as páginas:

/overview

/history

/analysis

/data

OVERVIEW:

resumo completo do sistema.

HISTORY:

histórico completo com filtros.

ANALYSIS:

área dedicada para executar e visualizar análises.

DATA:

informações sobre dataset, quantidade de registros e atualização.

As páginas devem manter a mesma linguagem visual.

==================================================

19. EXPERIÊNCIA GERAL

==================================================

A aplicação deve parecer um produto real e não um protótipo acadêmico.

Ao abrir, quero sentir:

precisão

controle

dados em tempo real

sofisticação

simplicidade

A interface deve transmitir tecnologia através da qualidade do design, não através de elementos futuristas artificiais.

Less UI.

More information.

More whitespace.

Better typography.

Antes de adicionar qualquer elemento visual, pergunte:

"Esse elemento possui uma função?"

Se não possuir, não adicione.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d6cf0796-a6ba-50b8-ae4d-29deb5725d2d).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
