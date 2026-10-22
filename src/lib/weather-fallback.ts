import type { ConditionsResponse } from "./conditions.ts";
import {
  createWeatherUrl,
  parseWeather,
  parseTemperatureToday,
  parseHumidity,
} from "./conditions-provider.ts";
import { buildHumidityAirAnalysis } from "./humidity-air.ts";

/** Public, keyless client fallback when shared hosting cannot obtain weather. */
export async function withBrowserWeatherFallback(
  data: ConditionsResponse,
  signal: AbortSignal,
): Promise<ConditionsResponse> {
  if (data.weather || signal.aborted) return data;
  try {
    const response = await fetch(createWeatherUrl(), {
      signal: AbortSignal.any([signal, AbortSignal.timeout(12000)]),
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return data;
    const raw: unknown = await response.json();
    const weather = parseWeather(raw);
    let temperatureToday = data.temperatureToday;
    let humidityAir = data.humidityAir;
    let humidityAvailable = false;
    try {
      temperatureToday = parseTemperatureToday(raw, Math.floor(Date.now() / 1000));
    } catch {
      /* Preserve independent sections. */
    }
    try {
      const humidity = parseHumidity(raw);
      humidityAvailable = true;
      if (data.air)
        humidityAir = buildHumidityAirAnalysis(
          data.air.series.month.points,
          humidity.times,
          humidity.values,
        );
    } catch {
      /* Preserve current weather if historical humidity is unavailable. */
    }
    const issues = data.issues.filter(
      (issue) =>
        issue !== "Não foi possível carregar o clima." &&
        (!humidityAvailable ||
          issue !== "O histórico de umidade está indisponível para a análise."),
    );
    if (
      data.air &&
      !humidityAvailable &&
      !humidityAir &&
      !issues.includes("O histórico de umidade está indisponível para a análise.")
    )
      issues.push("O histórico de umidade está indisponível para a análise.");
    return { ...data, weather, temperatureToday, humidityAir, issues };
  } catch {
    return data;
  }
}
