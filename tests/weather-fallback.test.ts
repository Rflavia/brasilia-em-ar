import { test } from "node:test";
import assert from "node:assert/strict";
import { BRASILIA, buildAirSeries, type ConditionsResponse } from "../src/lib/conditions.ts";
import { withBrowserWeatherFallback } from "../src/lib/weather-fallback.ts";

const now = Math.floor(Date.now() / 1000);
const midnight =
  Date.parse(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: BRASILIA.timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date()) + "T00:00:00-03:00",
  ) / 1000;
const times = Array.from({ length: 48 }, (_, i) => midnight - 86400 + i * 3600);
const partial = (): ConditionsResponse => ({
  location: BRASILIA,
  fetchedAt: now,
  weather: null,
  air: {
    time: now,
    pm25: 4,
    europeanPm25Index: 16,
    series: buildAirSeries(
      times,
      times.map(() => 4),
      now,
      now,
    ),
  },
  temperatureToday: null,
  humidityAir: null,
  issues: ["Não foi possível carregar o clima."],
});
const raw = () => ({
  timezone: BRASILIA.timezone,
  current_units: { temperature_2m: "°C", wind_speed_10m: "km/h" },
  current: {
    time: now,
    temperature_2m: 25,
    apparent_temperature: 26,
    relative_humidity_2m: 50,
    wind_speed_10m: 6,
    weather_code: 0,
    is_day: 1,
  },
  daily: { time: [midnight], temperature_2m_min: [20], temperature_2m_max: [30] },
  hourly_units: { temperature_2m: "°C", relative_humidity_2m: "%" },
  hourly: {
    time: times,
    temperature_2m: times.map(() => 25),
    relative_humidity_2m: times.map(() => 50),
  },
});

test("alternativa pública restaura clima e análise sem alterar os dados de ar nem incluir horas futuras", async (t) => {
  t.mock.method(globalThis, "fetch", async () => Response.json(raw()));
  const data = partial();
  const result = await withBrowserWeatherFallback(data, new AbortController().signal);
  assert.equal(result.air, data.air);
  assert.equal(result.weather?.temperature, 25);
  assert.ok(result.temperatureToday?.points.length);
  assert.ok(result.temperatureToday?.points.every((p) => p.timestamp <= now));
  assert.equal(result.humidityAir?.points.length, 1);
  assert.equal(result.humidityAir?.points[0]?.humidity, 50);
  assert.deepEqual(result.issues, []);
  assert.equal(data.weather, null);
});
test("429, dados inválidos e cancelamento preservam a resposta parcial", async (t) => {
  const data = partial();
  t.mock.method(globalThis, "fetch", async () => new Response("", { status: 429 }));
  assert.equal(await withBrowserWeatherFallback(data, new AbortController().signal), data);
  t.mock.method(globalThis, "fetch", async () =>
    Response.json({ ...raw(), current_units: { temperature_2m: "°F", wind_speed_10m: "km/h" } }),
  );
  assert.equal(await withBrowserWeatherFallback(data, new AbortController().signal), data);
  const cancelled = new AbortController();
  cancelled.abort();
  assert.equal(await withBrowserWeatherFallback(data, cancelled.signal), data);
});
