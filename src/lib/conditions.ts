import type { HumidityAirAnalysis } from "./humidity-air.ts";

export const BRASILIA = {
  city: "Brasília",
  region: "Distrito Federal",
  latitude: -15.7939,
  longitude: -47.8828,
  timezone: "America/Sao_Paulo",
} as const;
export type AirPeriod = "today" | "week" | "month";
export type AirPoint = { timestamp: number; label: string; value: number | null; samples: number };
export type AirSeries = { label: string; description: string; points: AirPoint[] };
export type WeatherData = {
  time: number;
  temperature: number;
  feelsLike: number | null;
  minimum: number | null;
  maximum: number | null;
  humidity: number | null;
  windSpeed: number | null;
  code: number | null;
  isDay: boolean;
};
export type AirData = {
  time: number;
  pm25: number | null;
  europeanPm25Index: number | null;
  series: Record<AirPeriod, AirSeries>;
};
export type ConditionsResponse = {
  location: typeof BRASILIA;
  fetchedAt: number;
  weather: WeatherData | null;
  air: AirData | null;
  issues: string[];
  humidityAir: HumidityAirAnalysis | null;
};

export function localDate(seconds: number): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: BRASILIA.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(seconds * 1000));
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}
export function formatDataTime(seconds: number): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: BRASILIA.timezone,
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(seconds * 1000));
}
const shortDate = (date: string) => `${date.slice(8, 10)}/${date.slice(5, 7)}`;

/** Horários em segundos UTC; dias e rótulos sempre no fuso de Brasília. */
export function buildAirSeries(
  times: number[],
  values: (number | null)[],
  now: number,
  airTime: number,
): Record<AirPeriod, AirSeries> {
  const today = localDate(now);
  const midnight = Date.parse(`${today}T00:00:00-03:00`) / 1000;
  const byTime = new Map(times.map((time, index) => [time, values[index] ?? null]));
  const todayPoints: AirPoint[] = [];
  const cutoff = Math.min(now, airTime);
  for (let time = midnight; time <= cutoff && time < midnight + 86400; time += 3600) {
    const value = byTime.get(time) ?? null;
    todayPoints.push({
      timestamp: time,
      label: `${String((time - midnight) / 3600).padStart(2, "0")}h`,
      value,
      samples: value === null ? 0 : 1,
    });
  }
  const daily: AirPoint[] = [];
  for (let day = 30; day >= 1; day--) {
    const timestamp = midnight - day * 86400;
    const readings: number[] = [];
    for (let hour = 0; hour < 24; hour++) {
      const value = byTime.get(timestamp + hour * 3600);
      if (value !== undefined && value !== null) readings.push(value);
    }
    daily.push({
      timestamp,
      label: shortDate(localDate(timestamp)),
      samples: readings.length,
      value: readings.length === 24 ? readings.reduce((a, b) => a + b, 0) / 24 : null,
    });
  }
  const dailySeries = (points: AirPoint[], label: string): AirSeries => ({
    label,
    points,
    description: `Médias diárias · ${points[0]?.label} a ${points.at(-1)?.label} · ${points.filter((p) => p.value !== null).length}/${points.length} dias completos`,
  });
  return {
    today: {
      label: "Hoje",
      description: `${shortDate(today)} · estimativas por hora · ${todayPoints.filter((p) => p.value !== null).length}/${todayPoints.length} horários disponíveis`,
      points: todayPoints,
    },
    week: dailySeries(daily.slice(-7), "7 dias"),
    month: dailySeries(daily, "30 dias"),
  };
}

export function summarizeSeries(points: AirPoint[]) {
  const valid = points.filter((p): p is AirPoint & { value: number } => p.value !== null);
  if (!valid.length) return null;
  return {
    mean: valid.reduce((sum, point) => sum + point.value, 0) / valid.length,
    minimum: valid.reduce((a, b) => (a.value <= b.value ? a : b)),
    maximum: valid.reduce((a, b) => (a.value >= b.value ? a : b)),
  };
}

/** Faixa do componente PM2.5 do índice europeu fornecido pela API, não IQAr brasileiro. */
export function airStatus(index: number | null): string {
  if (index === null) return "Faixa de concentração indisponível";
  if (index <= 20) return "Concentração baixa neste momento";
  if (index <= 40) return "PM2.5 na faixa razoável";
  if (index <= 60) return "PM2.5 na faixa moderada";
  if (index <= 80) return "PM2.5 na faixa ruim";
  if (index <= 100) return "PM2.5 na faixa muito ruim";
  return "PM2.5 na faixa extremamente ruim";
}
export function weatherDescription(code: number | null, isDay: boolean): string {
  if (code === 0) return isDay ? "Céu limpo" : "Noite de céu limpo";
  if (code === 1) return "Predomínio de céu limpo";
  if (code === 2) return "Parcialmente nublado";
  if (code === 3) return "Céu nublado";
  if (code === 45 || code === 48) return "Nevoeiro";
  if (code !== null && [51, 53, 55, 56, 57].includes(code)) return "Garoa";
  if (code !== null && [61, 63, 65, 66, 67].includes(code)) return "Chuva";
  if (code !== null && [71, 73, 75, 77, 85, 86].includes(code)) return "Neve";
  if (code !== null && [80, 81, 82].includes(code)) return "Pancadas de chuva";
  if (code !== null && [95, 96, 97, 99].includes(code)) return "Trovoadas";
  return "Condição não informada";
}
