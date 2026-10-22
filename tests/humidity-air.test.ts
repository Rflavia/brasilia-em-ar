import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildHumidityAirAnalysis,
  correlationReading,
  pearson,
  type HumidityAirPoint,
} from "../src/lib/humidity-air.ts";
import { parseHumidity, parseWeather, loadConditions } from "../src/services/conditions.server.ts";

const timestamp = Date.parse("2026-10-01T00:00:00-03:00") / 1000;
const points = (xs: number[], ys: number[]): HumidityAirPoint[] =>
  xs.map((humidity, i) => ({
    timestamp: timestamp + i * 86400,
    label: `${i + 1}/10`,
    humidity,
    pm25: ys[i]!,
  }));

test("Pearson detecta direções opostas e não cria relação onde não existe", () => {
  assert.equal(pearson(points([1, 2, 3, 4], [2, 4, 6, 8])), 1);
  assert.equal(pearson(points([1, 2, 3, 4], [8, 6, 4, 2])), -1);
  assert.equal(pearson(points([-1, 0, 1], [1, 0, 1])), 0);
  assert.equal(pearson(points([1, 1, 1], [2, 4, 6])), null);
  assert.equal(pearson(points([1, 2, 3], [0, 0, 0])), null);
  assert.equal(pearson(points([1, 2], [3, 4])), null);
});
test("pareamento usa a mesma data, exige 24 horas de cada variável e preserva zeros", () => {
  const airDays = Array.from({ length: 4 }, (_, i) => ({
    timestamp: timestamp + i * 86400,
    label: `0${i + 1}/10`,
    value: i === 3 ? null : i * 4,
    samples: i === 3 ? 23 : 24,
  }));
  const times: number[] = [];
  const values: (number | null)[] = [];
  // Ordem invertida não pode parear dias incorretamente.
  for (let day = 3; day >= 0; day--)
    for (let hour = 23; hour >= 0; hour--) {
      times.push(timestamp + day * 86400 + hour * 3600);
      values.push(day === 1 && hour === 12 ? null : day * 20);
    }
  const data = buildHumidityAirAnalysis(airDays, times, values);
  assert.equal(data.expectedDays, 4);
  assert.equal(data.excludedDays, 2);
  assert.deepEqual(
    data.points.map((p) => p.label),
    ["01/10", "03/10"],
  );
  assert.equal(data.points[0]?.humidity, 0);
  assert.equal(data.points[0]?.pm25, 0);
  assert.equal(data.points[1]?.humidity, 40);
  assert.equal(data.points[1]?.pm25, 8);
  assert.equal(data.correlation, null);
});
test("texto é calculado a partir do resultado e avisa sobre pouca amostra e variância zero", () => {
  assert.match(correlationReading(-0.8, 30).description, /menor umidade/);
  assert.match(correlationReading(0.8, 30).description, /maior umidade/);
  assert.match(correlationReading(0.1, 30).description, /não mostram/);
  assert.match(correlationReading(-0.8, 5).description, /menos de dez/);
  assert.match(correlationReading(null, 30).description, /não variou/);
  assert.match(correlationReading(null, 2).description, /pelo menos três/);
});
test("umidade valida limites, unidades e alinhamento sem converter ausência para zero", () => {
  const raw = {
    timezone: "America/Sao_Paulo",
    hourly_units: { relative_humidity_2m: "%" },
    hourly: { time: [timestamp, timestamp + 3600], relative_humidity_2m: [0, null] },
  };
  assert.deepEqual(parseHumidity(raw).values, [0, null]);
  assert.throws(() =>
    parseHumidity({ ...raw, hourly_units: { relative_humidity_2m: "fraction" } }),
  );
  assert.throws(() =>
    parseHumidity({ ...raw, hourly: { time: [timestamp], relative_humidity_2m: [101] } }),
  );
  assert.throws(() =>
    parseHumidity({ ...raw, hourly: { time: [timestamp], relative_humidity_2m: [] } }),
  );
});
const weather = () => ({
  timezone: "America/Sao_Paulo",
  current_units: { temperature_2m: "°C", wind_speed_10m: "km/h" },
  current: {
    time: timestamp + 12 * 3600,
    temperature_2m: 28,
    apparent_temperature: 29,
    relative_humidity_2m: 40,
    wind_speed_10m: 6,
    weather_code: 2,
    is_day: 1,
  },
  daily: {
    time: [timestamp - 86400, timestamp],
    temperature_2m_min: [-5, 21.5],
    temperature_2m_max: [0, 30.7],
  },
});
test("mínima e máxima continuam sendo de hoje quando a resposta inclui 30 dias passados", () => {
  const data = parseWeather(weather());
  assert.equal(data.minimum, 21.5);
  assert.equal(data.maximum, 30.7);
  const raw = weather();
  raw.daily.time = [timestamp - 86400];
  assert.equal(parseWeather(raw).minimum, null);
});
test("histórico de umidade inválido não derruba os quadros atuais", async (t) => {
  t.mock.method(globalThis, "fetch", async (url: URL) =>
    Response.json(
      url.hostname.startsWith("air-quality")
        ? {
            timezone: "America/Sao_Paulo",
            current_units: { pm2_5: "μg/m³" },
            current: { time: timestamp, pm2_5: 4, european_aqi_pm2_5: 16 },
            hourly: { time: [timestamp], pm2_5: [4] },
          }
        : weather(),
    ),
  );
  const data = await loadConditions();
  assert.ok(data.weather);
  assert.ok(data.air);
  assert.equal(data.humidityAir, null);
  assert.deepEqual(data.issues, ["O histórico de umidade está indisponível para a análise."]);
});
