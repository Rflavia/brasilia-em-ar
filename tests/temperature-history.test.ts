import { test } from "node:test";
import assert from "node:assert/strict";
import { buildTemperatureToday } from "../src/lib/temperature-history.ts";
import { summarizeSeries } from "../src/lib/conditions.ts";
import { parseTemperatureToday } from "../src/services/conditions.server.ts";
const midnight = Date.parse("2026-10-21T00:00:00-03:00") / 1000;
test("temperatura usa apenas o dia local e as horas já disponíveis; mantém negativos, zeros e lacunas", () => {
  const series = buildTemperatureToday(
    [midnight - 3600, midnight, midnight + 3600, midnight + 7200, midnight + 10800],
    [50, -1, 0, null, 40],
    midnight + 9000,
    midnight + 10800,
  );
  assert.deepEqual(
    series.points.map((p) => p.value),
    [-1, 0, null],
  );
  assert.equal(series.points[0]?.label, "00h");
  assert.equal(series.points.at(-1)?.label, "02h");
  assert.equal(summarizeSeries(series.points)?.minimum.value, -1);
  assert.equal(summarizeSeries(series.points)?.maximum.value, 0);
  assert.equal(summarizeSeries(series.points)?.maximum.label, "01h");
});
test("série é limitada ao horário da fonte e não preenche dados ausentes", () => {
  const series = buildTemperatureToday([midnight], [22], midnight + 7200, midnight + 3600);
  assert.deepEqual(
    series.points.map((p) => p.value),
    [22, null],
  );
  assert.equal(
    summarizeSeries(buildTemperatureToday([], [], midnight + 7200, midnight + 3600).points),
    null,
  );
});
test("valida unidade Celsius, limites físicos e arrays alinhados", () => {
  const raw = {
    timezone: "America/Sao_Paulo",
    current: { time: midnight + 3600 },
    hourly_units: { temperature_2m: "°C" },
    hourly: { time: [midnight, midnight + 3600], temperature_2m: [21, 23] },
  };
  assert.equal(parseTemperatureToday(raw, midnight + 3600).points[1]?.value, 23);
  assert.throws(() =>
    parseTemperatureToday({ ...raw, hourly_units: { temperature_2m: "°F" } }, midnight),
  );
  assert.throws(() =>
    parseTemperatureToday({ ...raw, hourly: { time: [midnight], temperature_2m: [] } }, midnight),
  );
  assert.throws(() =>
    parseTemperatureToday({ ...raw, hourly: { time: [midnight], temperature_2m: [99] } }, midnight),
  );
});
