import type { AirPoint } from "./conditions.ts";

export type HumidityAirPoint = { timestamp: number; label: string; humidity: number; pm25: number };
export type HumidityAirAnalysis = {
  points: HumidityAirPoint[];
  expectedDays: number;
  excludedDays: number;
  period: string;
  correlation: number | null;
};

/** Pearson centrado, sem arredondar antes do cálculo. Não estima causalidade. */
export function pearson(points: HumidityAirPoint[]): number | null {
  if (points.length < 3) return null;
  const meanX = points.reduce((sum, point) => sum + point.humidity, 0) / points.length;
  const meanY = points.reduce((sum, point) => sum + point.pm25, 0) / points.length;
  let cross = 0;
  let varianceX = 0;
  let varianceY = 0;
  for (const point of points) {
    const x = point.humidity - meanX;
    const y = point.pm25 - meanY;
    cross += x * y;
    varianceX += x * x;
    varianceY += y * y;
  }
  const denominator = Math.sqrt(varianceX * varianceY);
  if (denominator === 0) return null;
  return Math.max(-1, Math.min(1, cross / denominator));
}

/** Pareia pela meia-noite UTC correspondente ao mesmo dia em Brasília. */
export function buildHumidityAirAnalysis(
  airDays: AirPoint[],
  humidityTimes: number[],
  humidityValues: (number | null)[],
): HumidityAirAnalysis {
  const byTime = new Map(humidityTimes.map((time, index) => [time, humidityValues[index] ?? null]));
  const points: HumidityAirPoint[] = [];
  for (const day of airDays) {
    if (day.value === null || day.samples !== 24) continue;
    const readings: number[] = [];
    for (let hour = 0; hour < 24; hour++) {
      const value = byTime.get(day.timestamp + hour * 3600);
      if (value !== undefined && value !== null) readings.push(value);
    }
    if (readings.length !== 24) continue;
    points.push({
      timestamp: day.timestamp,
      label: day.label,
      humidity: readings.reduce((a, b) => a + b, 0) / 24,
      pm25: day.value,
    });
  }
  return {
    points,
    expectedDays: airDays.length,
    excludedDays: airDays.length - points.length,
    period: airDays.length
      ? `${airDays[0]?.label} a ${airDays.at(-1)?.label}`
      : "Período indisponível",
    correlation: pearson(points),
  };
}

export function correlationReading(
  correlation: number | null,
  count: number,
): { heading: string; description: string } {
  if (count < 3)
    return {
      heading: "Ainda há poucos dias",
      description:
        "Precisamos de pelo menos três dias completos nas duas séries para calcular a correlação.",
    };
  if (correlation === null)
    return {
      heading: "Sem variação suficiente",
      description:
        "Uma das variáveis não variou neste recorte. A correlação linear não pode ser calculada.",
    };
  if (count < 10)
    return {
      heading: "Uma amostra pequena",
      description:
        "O coeficiente foi calculado, mas há menos de dez dias completos. Evite tirar conclusões deste recorte.",
    };
  if (correlation <= -0.3)
    return {
      heading: "A relação aparece neste recorte",
      description:
        "Dias com menor umidade tenderam a apresentar mais partículas. A associação é inversa neste período.",
    };
  if (correlation >= 0.3)
    return {
      heading: "O padrão foi diferente",
      description:
        "Neste período, dias com maior umidade tenderam a apresentar mais partículas. A hipótese inicial não é apoiada pela direção da associação.",
    };
  return {
    heading: "Sem um padrão linear claro",
    description:
      "Os valores não mostram uma associação linear clara entre umidade e partículas neste período.",
  };
}
