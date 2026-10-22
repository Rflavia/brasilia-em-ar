import { localDate, type AirPoint } from "./conditions.ts";
export type TemperatureSeries = { description: string; points: AirPoint[] };

export function buildTemperatureToday(
  times: number[],
  values: (number | null)[],
  now: number,
  sourceTime: number,
): TemperatureSeries {
  const date = localDate(now);
  const midnight = Date.parse(`${date}T00:00:00-03:00`) / 1000;
  const valuesByTime = new Map(times.map((time, index) => [time, values[index] ?? null]));
  const points: AirPoint[] = [];
  for (
    let time = midnight;
    time <= Math.min(now, sourceTime) && time < midnight + 86400;
    time += 3600
  ) {
    const value = valuesByTime.get(time) ?? null;
    points.push({
      timestamp: time,
      label: `${String((time - midnight) / 3600).padStart(2, "0")}h`,
      value,
      samples: value === null ? 0 : 1,
    });
  }
  return {
    description: `${date.slice(8, 10)}/${date.slice(5, 7)} · estimativas horárias${points.length ? ` até ${points.at(-1)?.label}` : " indisponíveis"}`,
    points,
  };
}
