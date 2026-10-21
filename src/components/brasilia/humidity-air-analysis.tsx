import { useState } from "react";
import {
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BRASILIA } from "@/lib/conditions";
import {
  correlationReading,
  type HumidityAirAnalysis,
  type HumidityAirPoint,
} from "@/lib/humidity-air";

const number = (value: number, digits = 1) =>
  value.toLocaleString("pt-BR", { minimumFractionDigits: digits, maximumFractionDigits: digits });
const fullDate = (timestamp: number) =>
  new Intl.DateTimeFormat("pt-BR", {
    timeZone: BRASILIA.timezone,
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(timestamp * 1000);
function PointTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload?: HumidityAirPoint }[];
}) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;
  return (
    <div className="bea-scatter-tooltip">
      <strong>{fullDate(point.timestamp)}</strong>
      <p>
        Umidade média <b>{number(point.humidity)}%</b>
      </p>
      <p>
        PM2.5 médio <b>{number(point.pm25)} µg/m³</b>
      </p>
    </div>
  );
}

export function HumidityAirChart({ analysis }: { analysis: HumidityAirAnalysis | null }) {
  const [selected, setSelected] = useState<HumidityAirPoint | null>(null);
  const reading = analysis
    ? correlationReading(analysis.correlation, analysis.points.length)
    : null;
  const points = analysis?.points ?? [];
  const selectedPoint = points.find((point) => point.timestamp === selected?.timestamp);
  const min = Math.min(...points.map((point) => point.pm25));
  const max = Math.max(...points.map((point) => point.pm25));
  const pointColor = (value: number) => {
    const ratio = max === min ? 0 : (value - min) / (max - min);
    return `rgb(${Math.round(61 + ratio * 151)}, ${Math.round(117 + ratio * 43)}, ${Math.round(113 - ratio * 35)})`;
  };
  return (
    <section className="bea-humidity-analysis" aria-labelledby="bea-humidity-title">
      <div className="bea-analysis-heading">
        <p className="bea-eyebrow">O que os dados mostram</p>
        <h2 id="bea-humidity-title">Dias mais secos também apresentam mais partículas no ar?</h2>
        <p>Umidade e PM2.5 · médias diárias dos últimos 30 dias completos</p>
      </div>
      {!analysis || points.length === 0 ? (
        <div className="bea-api-state" role="status">
          Ainda não há dias completos nas duas séries para comparar umidade e partículas. Tente
          atualizar os dados em instantes.
        </div>
      ) : (
        <>
          <div className="bea-analysis-layout">
            <div className="bea-scatter-card">
              <div className="bea-scatter-caption">
                <span>PM2.5 médio · µg/m³</span>
                <span>{analysis.period}</span>
              </div>
              <div
                className="bea-scatter-plot"
                role="img"
                aria-label={`Dispersão entre umidade relativa média e PM2.5 médio. ${points.length} dias analisados. Cada ponto representa um dia. Consulte os valores na tabela abaixo.`}
              >
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <ScatterChart
                    margin={{ top: 24, right: 15, bottom: 18, left: -22 }}
                    accessibilityLayer
                  >
                    <CartesianGrid stroke="#e3e6de" strokeDasharray="3 5" vertical={false} />
                    <XAxis
                      type="number"
                      dataKey="humidity"
                      name="Umidade média"
                      unit="%"
                      domain={[0, 100]}
                      ticks={[0, 20, 40, 60, 80, 100]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#5c7073", fontSize: 11 }}
                      dy={8}
                    />
                    <YAxis
                      type="number"
                      dataKey="pm25"
                      name="PM2.5 médio"
                      unit=""
                      domain={[0, "auto"]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#5c7073", fontSize: 11 }}
                    />
                    <Tooltip
                      content={<PointTooltip />}
                      cursor={{ strokeDasharray: "3 3", stroke: "#b7c9bd" }}
                    />
                    <Scatter
                      name="Dias completos"
                      data={points}
                      isAnimationActive={false}
                      onClick={(node) =>
                        setSelected((node as { payload?: HumidityAirPoint }).payload ?? null)
                      }
                    >
                      {points.map((point) => (
                        <Cell
                          key={point.timestamp}
                          fill={pointColor(point.pm25)}
                          stroke={
                            selectedPoint?.timestamp === point.timestamp ? "#193b43" : "#fffefa"
                          }
                          strokeWidth={selectedPoint?.timestamp === point.timestamp ? 3 : 1.5}
                        />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <p className="bea-scatter-x-label">Umidade relativa média (%)</p>
              <div className="bea-scatter-legend">
                <span>Mais seco</span>
                <div>
                  <span>Menor PM2.5</span>
                  <i aria-hidden="true" />
                  <span>Maior PM2.5</span>
                </div>
                <span>Mais úmido</span>
              </div>
              <p className="bea-point-selection" aria-live="polite">
                {selectedPoint
                  ? `${fullDate(selectedPoint.timestamp)} · ${number(selectedPoint.humidity)}% de umidade · ${number(selectedPoint.pm25)} µg/m³ de PM2.5`
                  : "Passe sobre um ponto ou toque nele para consultar o dia."}
              </p>
            </div>
            <aside className="bea-analysis-insight" aria-label="Leitura dos resultados">
              <div className="bea-analysis-count">
                <span>
                  <strong>{points.length}</strong> dias analisados
                </span>
                <span>
                  {analysis.excludedDays
                    ? `${analysis.excludedDays} sem dados completos`
                    : "Duas séries completas"}
                </span>
              </div>
              <p className="bea-eyebrow">Neste período</p>
              <h3>{reading?.heading}</h3>
              <p className="bea-insight-description">{reading?.description}</p>
              <div className="bea-correlation">
                <span>Correlação linear · Pearson</span>
                <strong>
                  {analysis.correlation === null
                    ? "—"
                    : number(Math.abs(analysis.correlation) < 0.005 ? 0 : analysis.correlation, 2)}
                </strong>
              </div>
              <p className="bea-causality-note">
                Associação não comprova causa. Chuva, vento e outras condições também podem
                influenciar os valores.
              </p>
            </aside>
          </div>
          <details className="bea-analysis-method">
            <summary>Como ler esta análise</summary>
            <p>
              Cada ponto cruza as médias de umidade e PM2.5 do mesmo dia em Brasília. Um dia entra
              somente com 24 valores horários válidos de cada variável. O dia atual e dias
              incompletos ficam de fora. Os dados são estimativas de modelos, incluindo previsões
              arquivadas.
            </p>
            <p>
              A correlação de Pearson varia de −1 a +1: valores negativos indicam associação
              inversa; positivos, associação na mesma direção; próximos de zero, ausência de padrão
              linear claro. As descrições usam ±0,30 como corte exploratório, sem teste de
              significância. Menos de dez dias gera aviso de amostra pequena. Não há controle de
              outros fatores ou independência entre dias.
            </p>
          </details>
          <details className="bea-data-table bea-analysis-table">
            <summary>Consultar os dias analisados</summary>
            <div>
              <table>
                <caption>Umidade e PM2.5 · médias diárias · {analysis.period}</caption>
                <thead>
                  <tr>
                    <th scope="col">Dia</th>
                    <th scope="col">Umidade (%)</th>
                    <th scope="col">PM2.5 (µg/m³)</th>
                  </tr>
                </thead>
                <tbody>
                  {points.map((point) => (
                    <tr key={point.timestamp}>
                      <th scope="row">
                        <button
                          type="button"
                          onClick={() => setSelected(point)}
                          aria-label={`Selecionar ${fullDate(point.timestamp)}`}
                        >
                          {point.label}
                        </button>
                      </th>
                      <td>{number(point.humidity)}</td>
                      <td>{number(point.pm25)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      )}
    </section>
  );
}
