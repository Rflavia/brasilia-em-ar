import { BRASILIA, type ConditionsResponse, type WeatherData } from "../lib/conditions.ts";
import {
  createWeatherUrl,
  parseWeather,
  parseAir,
  parseTemperatureToday,
  parseHumidity,
} from "../lib/conditions-provider.ts";
import type { TemperatureSeries } from "../lib/temperature-history.ts";
import { buildHumidityAirAnalysis } from "../lib/humidity-air.ts";
export {
  parseWeather,
  parseAir,
  parseTemperatureToday,
  parseHumidity,
} from "../lib/conditions-provider.ts";

const parameters = {
  latitude: String(BRASILIA.latitude),
  longitude: String(BRASILIA.longitude),
  timezone: BRASILIA.timezone,
  timeformat: "unixtime",
  forecast_days: "1",
};
async function requestJson(url: URL): Promise<unknown> {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(8000),
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Provider HTTP ${response.status}`);
  return response.json();
}
export async function loadConditions(): Promise<ConditionsResponse> {
  const weatherUrl = createWeatherUrl();
  const airUrl = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
  airUrl.search = new URLSearchParams({
    ...parameters,
    current: "pm2_5,european_aqi_pm2_5",
    hourly: "pm2_5",
    past_days: "30",
    domains: "cams_global",
  }).toString();
  const now = Math.floor(Date.now() / 1000);
  const [weatherResult, airResult] = await Promise.allSettled([
    requestJson(weatherUrl),
    requestJson(airUrl).then((raw) => parseAir(raw, now)),
  ]);
  if (weatherResult.status === "rejected") {
    console.error("Open-Meteo weather request failed:", weatherResult.reason);
  }
  if (airResult.status === "rejected") {
    console.error("Open-Meteo air request failed:", airResult.reason);
  }
  let weather: WeatherData | null = null;
  let temperatureToday: TemperatureSeries | null = null;
  let humidity: ReturnType<typeof parseHumidity> | null = null;
  if (weatherResult.status === "fulfilled") {
    try {
      temperatureToday = parseTemperatureToday(weatherResult.value, now);
    } catch {
      /* O gráfico não interfere nos quadros ou na análise principal. */
    }
    try {
      weather = parseWeather(weatherResult.value);
    } catch {
      /* Clima atual pode falhar independentemente do histórico. */
    }
    try {
      humidity = parseHumidity(weatherResult.value);
    } catch {
      /* A consulta básica permanece disponível. */
    }
  }
  const air = airResult.status === "fulfilled" ? airResult.value : null;
  if (!weather && !air) throw new Error("Conditions providers unavailable");
  return {
    location: BRASILIA,
    fetchedAt: now,
    weather,
    air,
    temperatureToday,
    humidityAir:
      air && humidity
        ? buildHumidityAirAnalysis(air.series.month.points, humidity.times, humidity.values)
        : null,
    issues: [
      ...(!weather ? ["Não foi possível carregar o clima."] : []),
      ...(!air ? ["Não foi possível carregar a qualidade do ar."] : []),
      ...(weather && air && !humidity
        ? ["O histórico de umidade está indisponível para a análise."]
        : []),
    ],
  };
}

let cache: { data: ConditionsResponse; expiresAt: number } | undefined;
let pending: Promise<ConditionsResponse> | undefined;
/** Cache por instância para a única localização; deduplica consultas simultâneas. */
export async function getConditions(): Promise<ConditionsResponse> {
  if (cache && cache.expiresAt > Date.now()) return cache.data;
  if (!pending) {
    pending = loadConditions()
      .then((data) => {
        cache = { data, expiresAt: Date.now() + (data.issues.length ? 60000 : 300000) };
        return data;
      })
      .finally(() => {
        pending = undefined;
      });
  }
  return pending;
}
