import { z } from "zod";
import {
  BRASILIA,
  buildAirSeries,
  localDate,
  type AirData,
  type ConditionsResponse,
  type WeatherData,
} from "./conditions.ts";

import { buildTemperatureToday, type TemperatureSeries } from "./temperature-history.ts";

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

const humiditySchema = z.object({
  timezone: z.literal(BRASILIA.timezone),
  hourly_units: z.object({ relative_humidity_2m: z.literal("%") }),
  hourly: z
    .object({
      time: z.array(timestamp),
      relative_humidity_2m: z.array(numeric.min(0).max(100).nullable()),
    })
    .refine((h) => h.time.length === h.relative_humidity_2m.length),
});

const temperatureHistorySchema = z.object({
  timezone: z.literal(BRASILIA.timezone),
  current: z.object({ time: timestamp }),
  hourly_units: z.object({ temperature_2m: z.literal("°C") }),
  hourly: z
    .object({ time: z.array(timestamp), temperature_2m: z.array(temperature) })
    .refine((h) => h.time.length === h.temperature_2m.length),
});
export function parseTemperatureToday(raw: unknown, now: number): TemperatureSeries {
  const data = temperatureHistorySchema.parse(raw);
  return buildTemperatureToday(
    data.hourly.time,
    data.hourly.temperature_2m,
    now,
    data.current.time,
  );
}

export function parseHumidity(raw: unknown) {
  const data = humiditySchema.parse(raw);
  return { times: data.hourly.time, values: data.hourly.relative_humidity_2m };
}

export function parseWeather(raw: unknown): WeatherData {
  const data = weatherSchema.parse(raw);
  const current = data.current;
  if (current.temperature_2m === null) throw new Error("Missing current temperature");
  const todayIndex = data.daily.time.findIndex(
    (time) => localDate(time) === localDate(current.time),
  );
  return {
    time: current.time,
    temperature: current.temperature_2m,
    feelsLike: current.apparent_temperature,
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    code: current.weather_code,
    isDay: current.is_day === 1,
    minimum: data.daily.temperature_2m_min[todayIndex] ?? null,
    maximum: data.daily.temperature_2m_max[todayIndex] ?? null,
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
export function createWeatherUrl(): URL {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude: String(BRASILIA.latitude),
    longitude: String(BRASILIA.longitude),
    timezone: BRASILIA.timezone,
    timeformat: "unixtime",
    forecast_days: "1",
    current:
      "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day",
    daily: "temperature_2m_min,temperature_2m_max",
    hourly: "relative_humidity_2m,temperature_2m",
    past_days: "30",
    temperature_unit: "celsius",
    wind_speed_unit: "kmh",
  }).toString();
  return url;
}
