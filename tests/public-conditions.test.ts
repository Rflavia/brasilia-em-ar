import { test } from "node:test";
import assert from "node:assert/strict";
import { BRASILIA } from "../src/lib/conditions.ts";
import { loadPublicConditions } from "../src/lib/public-conditions.ts";

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
const weather = {
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
};
const air = {
  timezone: BRASILIA.timezone,
  current_units: { pm2_5: "µg/m³" },
  current: { time: now, pm2_5: 4, european_aqi_pm2_5: 16 },
  hourly: { time: times, pm2_5: times.map(() => 4) },
};

test("consulta pública produz clima, temperatura e pares completos sem incluir horas futuras", async (t) => {
  const urls: string[] = [];
  t.mock.method(globalThis, "fetch", async (url: URL) => {
    urls.push(url.href);
    return Response.json(url.hostname.startsWith("air-quality") ? air : weather);
  });
  const data = await loadPublicConditions(new AbortController().signal);
  assert.equal(data.weather?.temperature, 25);
  assert.equal(data.air?.pm25, 4);
  assert.ok(data.temperatureToday?.points.length);
  assert.ok(data.temperatureToday?.points.every((p) => p.timestamp <= now));
  assert.equal(data.humidityAir?.points.length, 1);
  assert.deepEqual(data.issues, []);
  assert.equal(urls.length, 2);
  assert.ok(urls.every((url) => url.startsWith("https://")));
});

test("falha de uma fonte preserva a outra; 429 não provoca repetição imediata", async (t) => {
  let calls = 0;
  t.mock.method(globalThis, "fetch", async (url: URL) => {
    calls++;
    return url.hostname.startsWith("air-quality")
      ? Response.json(air)
      : new Response("", { status: 429 });
  });
  const data = await loadPublicConditions(new AbortController().signal);
  assert.equal(calls, 2);
  assert.equal(data.weather, null);
  assert.equal(data.temperatureToday, null);
  assert.equal(data.air?.pm25, 4);
  assert.ok(data.issues.includes("Não foi possível carregar o clima."));
  t.mock.method(globalThis, "fetch", async (url: URL) =>
    url.hostname.startsWith("air-quality")
      ? new Response("", { status: 503 })
      : Response.json(weather),
  );
  const withoutAir = await loadPublicConditions(new AbortController().signal);
  assert.equal(withoutAir.weather?.temperature, 25);
  assert.ok(withoutAir.temperatureToday?.points.length);
  assert.equal(withoutAir.air, null);
  assert.equal(withoutAir.humidityAir, null);
});

test("falha total e cancelamento não viram dados inventados", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response("", { status: 429 }));
  await assert.rejects(loadPublicConditions(new AbortController().signal), /Não foi possível/);
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(loadPublicConditions(controller.signal), { name: "AbortError" });
});
