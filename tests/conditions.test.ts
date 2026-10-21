import { test } from "node:test";
import assert from "node:assert/strict";
import {
  airStatus,
  buildAirSeries,
  localDate,
  summarizeSeries,
  weatherDescription,
} from "../src/lib/conditions.ts";
import {
  getConditions,
  loadConditions,
  parseAir,
  parseWeather,
} from "../src/services/conditions.server.ts";

const instant = (s: string) => Date.parse(s) / 1000;
const now = instant("2026-10-01T12:30:00-03:00");
const midnight = instant("2026-10-01T00:00:00-03:00");
const weather = () => ({
  timezone: "America/Sao_Paulo",
  current_units: { temperature_2m: "°C", wind_speed_10m: "km/h" },
  current: {
    time: now,
    temperature_2m: 28.4,
    apparent_temperature: 29.4,
    relative_humidity_2m: 46,
    wind_speed_10m: 6.4,
    weather_code: 51,
    is_day: 1,
  },
  daily: { time: [midnight], temperature_2m_min: [21.5], temperature_2m_max: [30.7] },
});
const air = () => ({
  timezone: "America/Sao_Paulo",
  current_units: { pm2_5: "μg/m³" },
  current: { time: now, pm2_5: 4.8, european_aqi_pm2_5: 19.2 },
  hourly: { time: [midnight], pm2_5: [0] },
});

test("datas usam Brasília mesmo após a meia-noite UTC", () => {
  assert.equal(localDate(instant("2026-10-01T01:30:00Z")), "2026-09-30");
});
test("histórico ignora horas futuras, preserva zero e lacunas; médias exigem 24 valores", () => {
  const times: number[] = [];
  const values: (number | null)[] = [];
  for (let time = midnight - 30 * 86400; time < midnight + 86400; time += 3600) {
    times.push(time);
    values.push(6);
  }
  values[times.indexOf(midnight - 2 * 86400)] = null;
  values[times.indexOf(midnight)] = 0;
  values[times.indexOf(midnight + 3600)] = null;
  const result = buildAirSeries(times, values, now, now);
  assert.equal(result.today.points.length, 13);
  assert.equal(result.today.points[0]?.value, 0);
  assert.equal(result.today.points[1]?.value, null);
  assert.ok(result.today.points.every((p) => p.timestamp <= now));
  assert.equal(result.month.points.length, 30);
  assert.equal(result.week.points.length, 7);
  assert.equal(result.month.points.at(-1)?.label, "30/09");
  assert.equal(result.month.points.at(-2)?.samples, 23);
  assert.equal(result.month.points.at(-2)?.value, null);
  assert.equal(result.month.points.at(-1)?.value, 6);
  assert.equal(summarizeSeries(result.month.points)?.mean, 6);
});
test("dia de hoje não usa horas posteriores à referência da fonte", () => {
  const result = buildAirSeries([midnight], [1], now, midnight + 3600);
  assert.equal(result.today.points.length, 2);
  assert.equal(result.today.points.at(-1)?.value, null);
});
test("série vazia não fabrica zero e estatísticas preservam valores reais", () => {
  assert.equal(summarizeSeries([]), null);
  const result = buildAirSeries([], [], now, now);
  assert.equal(summarizeSeries(result.week.points), null);
  const stats = summarizeSeries([
    { timestamp: 1, label: "A", value: 0, samples: 1 },
    { timestamp: 2, label: "B", value: 100, samples: 1 },
  ]);
  assert.equal(stats?.mean, 50);
  assert.equal(stats?.maximum.value, 100);
});
test("faixa baixa não permanece fixa quando o índice europeu aumenta", () => {
  assert.match(airStatus(19), /baixa/);
  assert.match(airStatus(21), /razoável/);
  assert.match(airStatus(80), /ruim/);
  assert.match(airStatus(101), /extremamente/);
  assert.match(airStatus(null), /indisponível/);
  assert.equal(weatherDescription(51, true), "Garoa");
  assert.equal(weatherDescription(97, true), "Trovoadas");
});
test("validação rejeita unidades incompatíveis, números inválidos e arrays desalinhados", () => {
  const parsed = parseWeather(weather());
  assert.equal(parsed.temperature, 28.4);
  const invalid = weather();
  invalid.current_units.temperature_2m = "°F";
  assert.throws(() => parseWeather(invalid));
  const missing = { ...weather(), current: { ...weather().current, temperature_2m: null } };
  assert.throws(() => parseWeather(missing));
  const empty = air();
  empty.hourly.pm2_5 = [];
  assert.throws(() => parseAir(empty, now));
  const invalidAir = air();
  invalidAir.current.pm2_5 = -1;
  assert.throws(() => parseAir(invalidAir, now));
  assert.equal(parseAir(air(), now).pm25, 4.8);
});
test("falha de uma fonte preserva a outra e falha total retorna erro", async (t) => {
  t.mock.method(globalThis, "fetch", async (url: URL) =>
    url.hostname.startsWith("air-quality")
      ? new Response("unavailable", { status: 503 })
      : Response.json(weather()),
  );
  const partial = await loadConditions();
  assert.equal(partial.weather?.temperature, 28.4);
  assert.equal(partial.air, null);
  assert.equal(partial.issues.length, 1);
  t.mock.restoreAll();
  t.mock.method(globalThis, "fetch", async () => new Response("unavailable", { status: 429 }));
  await assert.rejects(loadConditions(), /unavailable/);
});
test("cache deduplica consultas simultâneas e reutiliza a resposta", async (t) => {
  let count = 0;
  t.mock.method(globalThis, "fetch", async (url: URL) => {
    count++;
    return Response.json(url.hostname.startsWith("air-quality") ? air() : weather());
  });
  const [a, b] = await Promise.all([getConditions(), getConditions()]);
  assert.equal(count, 2);
  assert.deepEqual(a, b);
  await getConditions();
  assert.equal(count, 2);
});
