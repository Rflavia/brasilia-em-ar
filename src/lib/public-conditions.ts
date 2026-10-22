import { BRASILIA, type ConditionsResponse } from "./conditions.ts";
import {
  createWeatherUrl,
  parseAir,
  parseHumidity,
  parseTemperatureToday,
  parseWeather,
} from "./conditions-provider.ts";
import { buildHumidityAirAnalysis } from "./humidity-air.ts";

/** Keyless public data access, independent of the hosting provider's shared IP. */
export async function loadPublicConditions(signal: AbortSignal): Promise<ConditionsResponse> {
  const airUrl = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
  airUrl.search = new URLSearchParams({
    latitude: String(BRASILIA.latitude),
    longitude: String(BRASILIA.longitude),
    timezone: BRASILIA.timezone,
    timeformat: "unixtime",
    forecast_days: "1",
    current: "pm2_5,european_aqi_pm2_5",
    hourly: "pm2_5",
    past_days: "30",
    domains: "cams_global",
  }).toString();
  const requestJson = async (url: URL): Promise<unknown> => {
    const response = await fetch(url, {
      signal: AbortSignal.any([signal, AbortSignal.timeout(12000)]),
      headers: { Accept: "application/json" },
    });
    if (!response.ok) throw new Error(`Provider HTTP ${response.status}`);
    return response.json();
  };
  const [weatherResult, airResult] = await Promise.allSettled([
    requestJson(createWeatherUrl()),
    requestJson(airUrl),
  ]);
  signal.throwIfAborted();
  const now = Math.floor(Date.now() / 1000);
  const safely = <T>(parse: () => T): T | null => {
    try {
      return parse();
    } catch {
      return null;
    }
  };
  const rawWeather = weatherResult.status === "fulfilled" ? weatherResult.value : null;
  const weather = safely(() => parseWeather(rawWeather));
  const temperatureToday = safely(() => parseTemperatureToday(rawWeather, now));
  const humidity = safely(() => parseHumidity(rawWeather));
  const air =
    airResult.status === "fulfilled" ? safely(() => parseAir(airResult.value, now)) : null;
  if (!weather && !air && !temperatureToday) {
    throw new Error("Não foi possível consultar os dados agora. Tente novamente em instantes.");
  }
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
      ...(air && !humidity ? ["O histórico de umidade está indisponível para a análise."] : []),
    ],
  };
}
