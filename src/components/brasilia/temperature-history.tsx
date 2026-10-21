import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { summarizeSeries } from "@/lib/conditions";
import type { TemperatureSeries } from "@/lib/temperature-history";
const number = (value: number) => value.toLocaleString("pt-BR", { maximumFractionDigits: 1 });

export function TemperatureHistory({ series }: { series: TemperatureSeries | null }) {
  const stats = series ? summarizeSeries(series.points) : null;
  return (
    <section className="bea-history bea-temp-history" aria-labelledby="bea-temp-history-title">
      <div className="bea-history-heading">
        <div>
          <h2 id="bea-temp-history-title">Temperatura ao longo do dia</h2>
          <p>Hoje · horário de Brasília</p>
        </div>
      </div>
      {!series || !stats ? (
        <div className="bea-api-state" role="status">
          Não foi possível carregar as temperaturas de hoje. Tente atualizar os dados.
        </div>
      ) : (
        <div className="bea-chart-card">
          <div className="bea-chart-caption">
            <span>
              Temperatura <span>· °C</span>
            </span>
            <p>{series.description}</p>
          </div>
          <div
            className="bea-chart"
            role="img"
            aria-label={`Temperaturas horárias de hoje. Maior valor disponível: ${number(stats.maximum.value)} graus às ${stats.maximum.label}. Menor: ${number(stats.minimum.value)} graus às ${stats.minimum.label}. Valores disponíveis na tabela abaixo.`}
          >
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart
                data={series.points}
                margin={{ top: 18, right: 16, left: -16, bottom: 4 }}
                accessibilityLayer
              >
                <defs>
                  <linearGradient id="bea-temperature-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d4a04e" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#d4a04e" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#e3e6de" />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  minTickGap={30}
                  tick={{ fill: "#5c7073", fontSize: 11 }}
                  dy={10}
                />
                <YAxis
                  unit="°"
                  domain={[Math.floor(stats.minimum.value - 2), Math.ceil(stats.maximum.value + 2)]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#5c7073", fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value: number) => [`${number(value)} °C`, "Temperatura"]}
                  labelFormatter={(label) => `Horário: ${label}`}
                  contentStyle={{
                    border: "1px solid #d5ded5",
                    borderRadius: 8,
                    fontSize: 12,
                    color: "#214d57",
                  }}
                />
                <Area
                  type="linear"
                  dataKey="value"
                  stroke="#ad7b30"
                  strokeWidth={2.5}
                  fill="url(#bea-temperature-fill)"
                  dot={{ r: 3, fill: "#fffefa", strokeWidth: 1.5 }}
                  activeDot={{ r: 5, fill: "#d4a04e", stroke: "#fff" }}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <dl className="bea-statistics">
            <div>
              <dt>Maior temperatura disponível</dt>
              <dd>
                {number(stats.maximum.value)} <span>°C · {stats.maximum.label}</span>
              </dd>
            </div>
            <div>
              <dt>Menor temperatura disponível</dt>
              <dd>
                {number(stats.minimum.value)} <span>°C · {stats.minimum.label}</span>
              </dd>
            </div>
          </dl>
          <details className="bea-data-table">
            <summary>Consultar temperaturas por hora</summary>
            <div>
              <table>
                <caption>{series.description}</caption>
                <thead>
                  <tr>
                    <th scope="col">Horário</th>
                    <th scope="col">Temperatura (°C)</th>
                  </tr>
                </thead>
                <tbody>
                  {series.points.map((point) => (
                    <tr key={point.timestamp}>
                      <th scope="row">{point.label}</th>
                      <td>{point.value === null ? "Sem dados" : number(point.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      )}
      <p className="bea-data-note">
        Estimativas da Open-Meteo até o horário disponível, sem horas futuras. Os extremos
        consideram apenas os valores já exibidos; lacunas indicam dados ausentes.
      </p>
    </section>
  );
}
