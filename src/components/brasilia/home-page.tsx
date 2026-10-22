import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CloudSun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudFog,
  CloudMoon,
  CloudLightning,
  Moon,
  Sun,
  RefreshCw,
  Droplets,
  Thermometer,
  Wind,
} from "lucide-react";

import { Link } from "@tanstack/react-router";
import { TemperatureHistory } from "./temperature-history";
import { HumidityAirDisclosure } from "./humidity-air-analysis";

import { useConditions } from "@/hooks/use-conditions";
import {
  airStatus,
  formatDataTime,
  weatherDescription,
  type ConditionsResponse,
  type WeatherData,
} from "@/lib/conditions";

function Brand() {
  return (
    <Link className="bea-brand" to="/">
      <span className="bea-brand-mark" aria-hidden="true">
        <img src="/brasilia-em-ar.svg" width="42" height="42" alt="" />
      </span>
      <span>
        brasília <span className="bea-brand-end">em ar</span>
      </span>
    </Link>
  );
}

function Header() {
  return (
    <header className="bea-masthead">
      <div className="bea-container bea-masthead-inner">
        <Brand />
      </div>
    </header>
  );
}

const displayValue = (value: number | null | undefined, digits = 0) =>
  value == null ? "—" : value.toLocaleString("pt-BR", { maximumFractionDigits: digits });

function WeatherSymbol({ weather }: { weather: WeatherData }) {
  const code = weather.code ?? -1;
  const Icon =
    code >= 95
      ? CloudLightning
      : [71, 73, 75, 77, 85, 86].includes(code)
        ? CloudSnow
        : code >= 51
          ? CloudRain
          : [45, 48].includes(code)
            ? CloudFog
            : code === 3
              ? Cloud
              : code === 2
                ? weather.isDay
                  ? CloudSun
                  : CloudMoon
                : weather.isDay
                  ? Sun
                  : Moon;
  return <Icon strokeWidth={1.1} />;
}

function CurrentConditions({ data }: { data: ConditionsResponse }) {
  const weather = data.weather;
  const air = data.air;
  return (
    <section id="agora" className="bea-conditions-section" aria-labelledby="bea-conditions-heading">
      <div className="bea-section-caption">
        <h2 id="bea-conditions-heading">Condições em Brasília</h2>
        <span>
          <span className="bea-sample-dot" aria-hidden="true" /> Estimativas de modelos · horário de
          Brasília
        </span>
      </div>
      <div className="bea-conditions">
        <article className="bea-weather" aria-labelledby="bea-weather-heading">
          <div className="bea-weather-top">
            <div>
              <p className="bea-eyebrow">Distrito Federal</p>
              <h3 id="bea-weather-heading">Clima agora</h3>
            </div>
            <span className="bea-small-label">Clima</span>
          </div>
          {weather ? (
            <>
              <div className="bea-temperature-row">
                <p className="bea-temperature">
                  {displayValue(weather.temperature)}
                  <span>°C</span>
                </p>
                <div className="bea-weather-symbol" aria-hidden="true">
                  <WeatherSymbol weather={weather} />
                </div>
              </div>
              <p className="bea-weather-description">
                {weatherDescription(weather.code, weather.isDay)}
              </p>
              <p className="bea-weather-feels">
                Sensação de {displayValue(weather.feelsLike)}° <span aria-hidden="true">·</span>{" "}
                Mín. {displayValue(weather.minimum)}° / Máx. {displayValue(weather.maximum)}°
              </p>
              <div className="bea-weather-details">
                <div>
                  <Droplets size={18} aria-hidden="true" />
                  <span>
                    Umidade{" "}
                    <strong>
                      {displayValue(weather.humidity)}
                      {weather.humidity === null ? "" : "%"}
                    </strong>
                  </span>
                </div>
                <div>
                  <Wind size={18} aria-hidden="true" />
                  <span>
                    Vento{" "}
                    <strong>
                      {displayValue(weather.windSpeed, 1)}
                      {weather.windSpeed === null ? "" : " km/h"}
                    </strong>
                  </span>
                </div>
              </div>
              <p className="bea-reference-time">Horário: {formatDataTime(weather.time)}</p>
            </>
          ) : (
            <p className="bea-card-unavailable" role="status">
              Clima indisponível no momento.
            </p>
          )}
          <div className="bea-weather-rings" aria-hidden="true" />
        </article>
        <article className="bea-air" aria-labelledby="bea-air-heading">
          <div className="bea-air-top">
            <p className="bea-eyebrow">Partículas finas · PM2.5</p>
            <span className="bea-air-symbol" aria-hidden="true">
              <Wind size={23} strokeWidth={1.4} />
            </span>
          </div>
          <h3 id="bea-air-heading">Qualidade do ar</h3>
          {air && air.pm25 !== null ? (
            <>
              <p className="bea-air-reading">
                {displayValue(air.pm25, 1)}
                <span>µg/m³</span>
              </p>
              <p className="bea-air-status">
                <span aria-hidden="true" />
                {airStatus(air.europeanPm25Index)}
              </p>
              <p className="bea-air-reference">Referência: faixa europeia de PM2.5</p>
              <p className="bea-reference-time">Horário: {formatDataTime(air.time)}</p>
            </>
          ) : (
            <p className="bea-card-unavailable" role="status">
              Concentração atual indisponível.
            </p>
          )}
          <a href="#entenda" className="bea-air-link">
            O que esse número significa? <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </article>
      </div>
    </section>
  );
}

function ReadingGuide() {
  return (
    <section id="entenda" className="bea-reading-section" aria-labelledby="bea-reading-heading">
      <div className="bea-reading-intro">
        <p className="bea-eyebrow">Informação com contexto</p>
        <h2 id="bea-reading-heading">
          Além de olhar o céu,
          <br />
          entender o que ele conta.
        </h2>
        <p>
          Um número ganha sentido quando você sabe o que ele representa. Comece por estas três
          leituras.
        </p>
      </div>
      <div className="bea-reading-list">
        <article>
          <span className="bea-guide-icon">
            <Thermometer size={20} aria-hidden="true" />
          </span>
          <div>
            <h3>Temperatura e sensação</h3>
            <p>
              A temperatura descreve o ambiente. A sensação térmica também considera fatores como
              vento e umidade.
            </p>
          </div>
          <span className="bea-guide-number" aria-hidden="true">
            01
          </span>
        </article>
        <article>
          <span className="bea-guide-icon">
            <Droplets size={20} aria-hidden="true" />
          </span>
          <div>
            <h3>Umidade do ar</h3>
            <p>
              Indica a umidade relativa: quanto vapor de água há no ar em comparação com o máximo
              possível naquela temperatura.
            </p>
          </div>
          <span className="bea-guide-number" aria-hidden="true">
            02
          </span>
        </article>
        <article>
          <span className="bea-guide-icon">
            <Wind size={20} aria-hidden="true" />
          </span>
          <div>
            <h3>Partículas finas, ou PM2.5</h3>
            <p>
              São partículas muito pequenas em suspensão no ar. O valor em µg/m³ indica sua
              concentração, não um índice de qualidade do ar.
            </p>
          </div>
          <span className="bea-guide-number" aria-hidden="true">
            03
          </span>
        </article>
      </div>
    </section>
  );
}

function CityIllustration() {
  return (
    <figure
      className="bea-city-art"
      aria-label="Ilustração de Brasília com o Congresso Nacional e a Catedral sob um céu dourado"
    >
      <div className="bea-art-coordinate">15°47′ S &nbsp; 47°53′ O</div>
      <svg viewBox="0 0 560 600" fill="none" aria-hidden="true">
        <defs>
          <linearGradient
            id="bea-sky"
            x1="280"
            y1="0"
            x2="280"
            y2="600"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#d9e6de" />
            <stop offset="1" stopColor="#f1ecdc" />
          </linearGradient>
          <linearGradient
            id="bea-sun"
            x1="370"
            y1="135"
            x2="370"
            y2="370"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#efd080" />
            <stop offset="1" stopColor="#dcaa55" />
          </linearGradient>
        </defs>
        <path fill="url(#bea-sky)" d="M0 0h560v600H0z" />
        <circle cx="375" cy="225" r="118" stroke="#b7c9bd" strokeWidth="1" />
        <circle cx="375" cy="225" r="153" stroke="#b7c9bd" strokeWidth="1" opacity=".55" />
        <circle cx="375" cy="225" r="83" fill="url(#bea-sun)" />
        <path d="M35 280h130m-90 12h130m170-185h95m-55 13h100" stroke="#6c8c81" opacity=".4" />
        <path d="M0 455c140-39 278-26 560-65v210H0z" fill="#b4c7b8" />
        <path d="M0 483c198-61 330 8 560-27v144H0z" fill="#8ea99b" />
        <path d="M0 535c175-53 370-4 560-33v98H0z" fill="#416b66" />
        <g stroke="#214d57" strokeWidth="2" fill="#f7f5ef" strokeLinejoin="round">
          <path d="M86 430h263v13H86z" />
          <path d="M192 266h24v164h-24zm33-8h24v172h-24z" />
          <path d="M113 405c1-18 15-30 33-30s32 12 33 30z" />
          <path d="M267 381h66c-2 20-15 29-33 29s-31-9-33-29z" />
          <path d="M274 410v20m53-20v20" />
        </g>
        <g stroke="#f7f5ef" strokeWidth="3" strokeLinecap="round">
          <path d="M382 468c19-22 36-55 40-93-1 39 10 72 28 93m-56 0c17-25 28-56 28-93 4 38 19 70 38 93m-76-1h77" />
        </g>
        <path d="M30 558c126-40 284-2 499-26" stroke="#d9e5dc" opacity=".45" />
        <path d="M192 280v136m33-144v145" stroke="#b8c8bf" strokeWidth="1" />
      </svg>
      <figcaption>
        <span>Brasília, Distrito Federal</span>
        <span>céu · cidade · ar</span>
      </figcaption>
    </figure>
  );
}

export function BrasiliaHomePage() {
  return (
    <div className="bea-site bea-landing" id="inicio">
      <a href="#bea-main" className="bea-skip-link">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="bea-main" className="bea-container bea-landing-main">
        <section className="bea-landing-hero" aria-labelledby="bea-heading">
          <div className="bea-landing-copy">
            <p className="bea-eyebrow bea-intro-eyebrow">O pulso do céu da capital</p>
            <h1 id="bea-heading">
              Brasília lá <span className="bea-title-f">f</span>ora,
              <br />
              <em>em perspectiva.</em>
            </h1>
            <p className="bea-intro-description">
              Clima e qualidade do ar, traduzidos em informação
              <br className="bea-desktop-break" /> para acompanhar a cidade e o seu dia.
            </p>
            <Link className="bea-hero-button" to="/condicoes">
              Conhecer as condições <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
          <CityIllustration />
        </section>
      </main>
    </div>
  );
}

export function BrasiliaConditionsPage() {
  const { data, isPending, isFetching, isError, refetch } = useConditions();
  const outdated =
    data &&
    [data.weather?.time, data.air?.time].some(
      (time) => time !== undefined && Date.now() / 1000 - time > 10800,
    );
  return (
    <div className="bea-site" id="inicio">
      <a href="#bea-main" className="bea-skip-link">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="bea-main" className="bea-container bea-dashboard">
        <Link className="bea-back-link" to="/">
          <ArrowLeft size={15} aria-hidden="true" /> Início
        </Link>
        <h1 className="bea-dashboard-title">Clima e qualidade do ar</h1>
        <div className="bea-update-bar">
          <p>{data ? `Consulta: ${formatDataTime(data.fetchedAt)}` : "Clima e ar para Brasília"}</p>
          <button type="button" disabled={isFetching} onClick={() => void refetch()}>
            <RefreshCw size={14} aria-hidden="true" />
            {isFetching ? "Atualizando…" : "Atualizar"}
          </button>
        </div>
        {isPending && (
          <div className="bea-api-state" role="status" aria-live="polite">
            Buscando clima e qualidade do ar…
          </div>
        )}
        {isError && (
          <p className="bea-api-message" role="alert">
            {data
              ? "Não foi possível atualizar. Exibindo os últimos dados consultados."
              : "Não foi possível carregar os dados. Clique em Atualizar para tentar novamente."}
          </p>
        )}
        {outdated && (
          <p className="bea-api-message" role="status">
            A fonte está com dados de mais de 3 horas atrás. Confira os horários de referência.
          </p>
        )}
        {data && (
          <>
            {data.issues.length > 0 && (
              <p className="bea-api-message" role="status">
                {data.issues.join(" ")}
              </p>
            )}
            <CurrentConditions data={data} />
            <p className="bea-source-note">
              Fontes:{" "}
              <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">
                Open-Meteo
              </a>{" "}
              e{" "}
              <a href="https://atmosphere.copernicus.eu/" target="_blank" rel="noreferrer">
                CAMS / Copernicus
              </a>{" "}
              ·{" "}
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noreferrer"
              >
                CC BY 4.0
              </a>
              . Estimativas para a região, sem medição por sensor local. Médias calculadas pelo
              projeto.
            </p>
          </>
        )}
        <ReadingGuide />
        {data && <TemperatureHistory series={data.temperatureToday ?? null} />}
        {data && <HumidityAirDisclosure analysis={data.humidityAir} />}
      </main>
    </div>
  );
}
