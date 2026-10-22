# Metodologia e API

A aplicação consulta `GET /api/condicoes`, servido pelo próprio TanStack Start. O endpoint reúne dados de clima, umidade e temperatura da Open-Meteo e estimativas de PM2.5 do CAMS global. Não exige chave para a integração pública de uso não comercial.

## Como os dados são tratados

- Localização fixa: Brasília (`-15.7939, -47.8828`), fuso `America/Sao_Paulo`.
- Horários são recebidos em segundos UTC e apresentados no horário de Brasília. O horário de cada fonte aparece no respectivo quadro.
- Temperatura de hoje: estimativas horárias até o menor entre o horário atual e a referência da fonte. Horas futuras são excluídas.
- Análise de 30 dias: dias anteriores completos, sem incluir o dia atual. A média diária exige 24 valores válidos. Valores ausentes permanecem como lacunas; zero é um valor válido.
- Média, mínimo e máximo ignoram lacunas. Para os períodos diários, os extremos correspondem a **médias diárias**, não aos extremos horários. A média do período considera apenas os dias completos disponíveis.
- O texto do quadro verde acompanha o componente PM2.5 do índice europeu retornado pela fonte. Não representa o IQAr brasileiro nem uma classificação conjunta de todos os poluentes.
- A fonte global CAMS tem resolução espacial aproximada de 45 km e resolução temporal nativa de 3 horas; os valores horários distribuídos pela API são estimativas do modelo. O passado disponibilizado pela API inclui previsões arquivadas, não observações validadas de estações.
- Requisições às fontes têm prazo de 8 segundos. Cache por instância: 5 minutos em sucesso completo e 1 minuto em resposta parcial, com deduplicação de consultas simultâneas. Cache HTTP de até 5 minutos em sucesso completo; erros não são armazenados. A interface consulta novamente a cada 10 minutos enquanto está em uso e oferece atualização manual, respeitando o cache.

Se a resposta da aplicação vier sem clima, o navegador tenta uma consulta direta à API pública de clima, sem chave. Essa alternativa usa a mesma URL, validação e cálculos do servidor e mantém os dados de qualidade do ar que já chegaram. Se a consulta direta também falhar, a interface preserva a resposta parcial. Não há repetição em loop; o resultado acompanha o cache e o intervalo de atualização da interface.

## Temperatura durante o dia

O gráfico aberto usa `temperature_2m` da mesma consulta de clima, sem criar outra requisição externa. Exibe somente horários de hoje até o menor entre o horário atual e a referência da fonte. A tabela preserva valores ausentes como lacunas. Os extremos indicam a maior e a menor temperatura **entre os horários disponíveis**, não a máxima ou mínima definitiva do dia; em caso de empate, mostram a primeira ocorrência. O eixo vertical acompanha a faixa de temperaturas e pode incluir valores negativos.

## Análise de umidade × partículas

São solicitados 30 dias anteriores de umidade relativa horária ao mesmo endpoint de clima. As médias de umidade e PM2.5 são pareadas pela data local de Brasília, e cada ponto exige 24 valores válidos de **cada variável**. A correlação de Pearson usa os pares completos, sem arredondamento prévio. A quantidade de dias excluídos fica visível, e a tabela permite consultar os valores utilizados.

A conclusão é calculada a partir do coeficiente: valores ≤ −0,30 indicam associação inversa exploratória, valores ≥ +0,30 indicam associação positiva e valores intermediários são descritos como sem padrão linear claro. Esses cortes são uma convenção de apresentação, não um teste de significância. Com menos de três pares ou variância zero, o coeficiente não é calculado; com menos de dez pares, há aviso de amostra pequena. Não se presume causalidade nem se controlam chuva, vento, sazonalidade ou dependência temporal.

As cores dos pontos indicam menor ou maior PM2.5 **dentro do recorte exibido**, sem categorias de saúde. As duas variáveis vêm de modelos com grades espaciais distintas para as mesmas coordenadas solicitadas. Esta é uma análise exploratória regional, não uma comparação de sensores colocados no mesmo local. Uma falha no histórico de umidade preserva os quadros atuais e o gráfico de temperatura.

## Referências

[Open-Meteo — clima](https://open-meteo.com/en/docs) · [Open-Meteo — qualidade do ar](https://open-meteo.com/en/docs/air-quality-api) · [CAMS/Copernicus](https://atmosphere.copernicus.eu/) · [Licença CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
