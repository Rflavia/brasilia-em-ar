import { z } from "zod";
import {
  BRASILIA,
  buildAirSeries,
  type AirData,
  type ConditionsResponse,
  type WeatherData,
} from "../lib/conditions.ts";

const numeric = z.number().finite();
const temperature = numeric.min(-90).max(65).nullable();
const timestamp = numeric.int().positive();
const weatherSchema = z.object({
  timezone: z.literal(BRASILIA.timezone),
  current_units: z.object({ temperature_2m: z.literal("°C"), wind_speed_10m: z.literal("km/h") }),
  current: z.object({
    time: timestamp,
    temperature_2m: temperature,
    apparent_temperature: temperature,
    relative_humidity_2m: numeric.min(0).max(100).nullable(),
    wind_speed_10m: numeric.nonnegative().nullable(),
    weather_code: numeric.int().nullable(),
    is_day: z.union([z.literal(0), z.literal(1)]),
  }),
  daily: z.object({
    time: z.array(timestamp),
    temperature_2m_min: z.array(temperature),
    temperature_2m_max: z.array(temperature),
  }),
});
const airSchema = z.object({
  timezone: z.literal(BRASILIA.timezone),
  current_units: z.object({ pm2_5: z.enum(["µg/m³", "μg/m³"]) }),
  current: z.object({
    time: timestamp,
    pm2_5: numeric.nonnegative().nullable(),
    european_aqi_pm2_5: numeric.nonnegative().nullable(),
  }),
  hourly: z
    .object({ time: z.array(timestamp), pm2_5: z.array(numeric.nonnegative().nullable()) })
    .refine((h) => h.time.length === h.pm2_5.length),
});

export function parseWeather(raw: unknown): WeatherData {
  const data = weatherSchema.parse(raw);
  const current = data.current;
  if (current.temperature_2m === null) throw new Error("Missing current temperature");
  return {
    time: current.time,
    temperature: current.temperature_2m,
    feelsLike: current.apparent_temperature,
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    code: current.weather_code,
    isDay: current.is_day === 1,
    minimum: data.daily.temperature_2m_min[0] ?? null,
    maximum: data.daily.temperature_2m_max[0] ?? null,
  };
}
export function parseAir(raw: unknown, now: number): AirData {
  const data = airSchema.parse(raw);
  return {
    time: data.current.time,
    pm25: data.current.pm2_5,
    europeanPm25Index: data.current.european_aqi_pm2_5,
    series: buildAirSeries(data.hourly.time, data.hourly.pm2_5, now, data.current.time),
  };
}
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
  const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
  weatherUrl.search = new URLSearchParams({
    ...parameters,
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day",
    daily: "temperature_2m_min,temperature_2m_max",
    temperature_unit: "celsius",
    wind_speed_unit: "kmh",
  }).toString();
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
    requestJson(weatherUrl).then(parseWeather),
    requestJson(airUrl).then((raw) => parseAir(raw, now)),
  ]);
  const weather = weatherResult.status === "fulfilled" ? weatherResult.value : null;
  const air = airResult.status === "fulfilled" ? airResult.value : null;
  if (!weather && !air) throw new Error("Conditions providers unavailable");
  return {
    location: BRASILIA,
    fetchedAt: now,
    weather,
    air,
    issues: [
      ...(!weather ? ["Não foi possível carregar o clima."] : []),
      ...(!air ? ["Não foi possível carregar a qualidade do ar."] : []),
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
