import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AIR_HISTORY_PREVIEW, type AirPeriod } from "@/mocks/air-history-preview";

const number = (value: number) =>
  value.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function AirHistory() {
  const [period, setPeriod] = useState<AirPeriod>("today");
  const series = AIR_HISTORY_PREVIEW[period];
  const mean = series.points.reduce((sum, point) => sum + point.value, 0) / series.points.length;
  const minimum = series.points.reduce((a, b) => (a.value <= b.value ? a : b));
  const maximum = series.points.reduce((a, b) => (a.value >= b.value ? a : b));
  return (
    <section className="bea-history" aria-labelledby="bea-history-heading">
      <div className="bea-history-heading">
        <div>
          <h2 id="bea-history-heading">O ar ao longo do tempo</h2>
          <p>Concentração de partículas finas · PM2.5</p>
        </div>
        <div className="bea-periods" role="group" aria-label="Período do gráfico">
          {(Object.keys(AIR_HISTORY_PREVIEW) as AirPeriod[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={period === key}
              onClick={() => setPeriod(key)}
            >
              {AIR_HISTORY_PREVIEW[key].label}
            </button>
          ))}
        </div>
      </div>
      <div className="bea-chart-card">
        <div className="bea-chart-caption">
          <span>
            PM2.5 <span>· µg/m³</span>
          </span>
          <p>{series.description}</p>
        </div>
        <div
          className="bea-chart"
          role="img"
          aria-label={`Gráfico de PM2.5: ${series.description}. Média ${number(mean)}, mínimo ${number(minimum.value)} e máximo ${number(maximum.value)} microgramas por metro cúbico. Valores disponíveis na tabela abaixo.`}
        >
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart
              data={series.points}
              margin={{ top: 18, right: 16, left: -24, bottom: 4 }}
              accessibilityLayer
            >
              <defs>
                <linearGradient id="bea-area-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#739f91" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#739f91" stopOpacity={0.02} />
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
                domain={[0, 12]}
                ticks={[0, 4, 8, 12]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#5c7073", fontSize: 11 }}
              />
              <Tooltip
                formatter={(value: number) => [`${number(value)} µg/m³`, "PM2.5"]}
                labelFormatter={(label) => `${period === "today" ? "Horário" : "Dia"}: ${label}`}
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
                stroke="#387983"
                strokeWidth={2.5}
                fill="url(#bea-area-fill)"
                dot={series.points.length <= 15 ? { r: 3, fill: "#fff", strokeWidth: 1.5 } : false}
                activeDot={{ r: 5, fill: "#d4a04e", stroke: "#fff" }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <dl className="bea-statistics" aria-live="polite" aria-atomic="true">
          <div>
            <dt>{period === "today" ? "Média das leituras" : "Média das médias diárias"}</dt>
            <dd>
              {number(mean)} <span>µg/m³</span>
            </dd>
          </div>
          <div>
            <dt>Menor concentração</dt>
            <dd>
              {number(minimum.value)} <span>µg/m³ · {minimum.label}</span>
            </dd>
          </div>
          <div>
            <dt>Maior concentração</dt>
            <dd>
              {number(maximum.value)} <span>µg/m³ · {maximum.label}</span>
            </dd>
          </div>
        </dl>
        <details className="bea-data-table">
          <summary>Consultar valores em tabela</summary>
          <div>
            <table>
              <caption>{series.description} · PM2.5</caption>
              <thead>
                <tr>
                  <th scope="col">{period === "today" ? "Horário" : "Dia"}</th>
                  <th scope="col">Concentração (µg/m³)</th>
                </tr>
              </thead>
              <tbody>
                {series.points.map((point) => (
                  <tr key={point.label}>
                    <th scope="row">{point.label}</th>
                    <td>{number(point.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </section>
  );
}
