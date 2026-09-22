# NEXUS — protótipo de data intelligence

## Objetivo
Construir um protótipo navegável, desktop-first, com quatro páginas e dados demonstrativos isolados atrás de serviços locais.

## Interface
- Aplicar a identidade escura especificada, tipografia sans-serif editorial, linhas discretas e navegação lateral compacta.
- Criar uma estrutura compartilhada com status ao vivo e navegação para Overview, History, Analysis e Data.
- Montar o Overview com métrica animada, distribuição, feed interativo, análise demonstrativa, tabela recente e histórico de ocorrências brancas.
- Criar páginas dedicadas de histórico, análise e dados mantendo a mesma linguagem visual.
- Adaptar a composição para notebook, tablet e celular, incluindo feed horizontal rolável.

## Interações
- Contagem de 0 a 2.008 no carregamento.
- Tooltips dos resultados recentes.
- Filtros suaves de histórico e seletor de amostra.
- Fluxo de análise com os estados Preparing Data, Processing Dataset e Analysis Complete, sem lógica preditiva.
- Simulação visual de entrada de novos resultados pela direita.

## Estrutura técnica
- Separar tipos, dados mockados, serviços e componentes reutilizáveis.
- Fazer componentes consumirem apenas os serviços, preparando a troca futura por API REST.
- Manter todo o comportamento local, sem backend ou integração real.
- Adicionar metadados próprios para cada página e redirecionar a entrada para Overview.

## Validação
- Verificar navegação e interações no navegador.
- Conferir a composição em desktop e celular, legibilidade e ausência de sobreposição.
