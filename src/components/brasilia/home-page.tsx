import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CloudSun,
  Droplets,
  MapPin,
  Menu,
  Sun,
  Thermometer,
  Wind,
  X,
} from "lucide-react";

import { Link } from "@tanstack/react-router";
import { AirHistory } from "./air-history";

import { WEATHER_PREVIEW } from "@/mocks/weather-preview";

const navigation = [
  { href: "/", label: "Início" },
  { href: "/condicoes", label: "Condições" },
] as const;

function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <Link className={`bea-brand${footer ? " bea-brand-footer" : ""}`} to="/">
      <span className="bea-brand-mark" aria-hidden="true">
        <Sun size={21} strokeWidth={1.5} />
      </span>
      <span>
        brasília <span className="bea-brand-end">em ar</span>
      </span>
    </Link>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = Math.max(0, window.scrollY);
    const updateVisibility = () => {
      const currentScrollY = Math.max(0, window.scrollY);
      if (currentScrollY < 100) {
        setHeaderHidden(false);
        lastScrollY = currentScrollY;
        return;
      }
      if (Math.abs(currentScrollY - lastScrollY) < 8) return;
      setHeaderHidden(currentScrollY > lastScrollY);
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <header className={`bea-header${headerHidden && !menuOpen ? " bea-header-hidden" : ""}`}>
      <div className="bea-container bea-header-inner">
        <Brand />
        <nav className="bea-desktop-nav" aria-label="Navegação principal">
          {navigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              activeProps={{ "aria-current": "page" }}
              activeOptions={{ exact: true }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <span className="bea-location">
          <MapPin size={14} aria-hidden="true" /> Brasília, DF
        </span>
        <button
          className="bea-menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="bea-mobile-nav"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
      {menuOpen && (
        <nav
          id="bea-mobile-nav"
          className="bea-mobile-nav bea-container"
          aria-label="Navegação para celular"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              activeProps={{ "aria-current": "page" }}
              activeOptions={{ exact: true }}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
              <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

function CurrentConditions() {
  const weather = WEATHER_PREVIEW;

  return (
    <section id="agora" className="bea-conditions-section" aria-labelledby="bea-conditions-heading">
      <div className="bea-section-caption">
        <h2 id="bea-conditions-heading">Condições em Brasília</h2>
        <span>
          <span className="bea-sample-dot" aria-hidden="true" /> Dados ilustrativos ·{" "}
          {weather.timeLabel}
        </span>
      </div>
      <div className="bea-conditions">
        <article className="bea-weather" aria-labelledby="bea-weather-heading">
          <div className="bea-weather-top">
            <div>
              <p className="bea-eyebrow">{weather.region}</p>
              <h3 id="bea-weather-heading">Clima agora</h3>
            </div>
            <span className="bea-small-label">Clima</span>
          </div>
          <div className="bea-temperature-row">
            <p className="bea-temperature">
              {weather.temperature}
              <span>°C</span>
            </p>
            <div className="bea-weather-symbol" aria-hidden="true">
              <CloudSun strokeWidth={1.1} />
            </div>
          </div>
          <p className="bea-weather-description">Sol entre nuvens</p>
          <p className="bea-weather-feels">
            Sensação de {weather.feelsLike}° <span aria-hidden="true">·</span> Mín.{" "}
            {weather.minimum}° / Máx. {weather.maximum}°
          </p>
          <div className="bea-weather-details">
            <div>
              <Droplets size={18} aria-hidden="true" />
              <span>
                Umidade <strong>{weather.humidity}%</strong>
              </span>
            </div>
            <div>
              <Wind size={18} aria-hidden="true" />
              <span>
                Vento <strong>{weather.windSpeed} km/h</strong>
              </span>
            </div>
          </div>
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
          <p className="bea-air-reading">
            {weather.pm25.toLocaleString("pt-BR")}
            <span>µg/m³</span>
          </p>
          <p className="bea-air-status">
            <span aria-hidden="true" />
            Concentração baixa neste momento
          </p>
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

function Footer() {
  return (
    <footer className="bea-footer">
      <div className="bea-container bea-footer-inner">
        <Brand footer />
        <p>Clima. Ar. Cidade.</p>
        <span>Projeto independente · versão demonstrativa</span>
      </div>
    </footer>
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
              Brasília lá fora,
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
      <Footer />
    </div>
  );
}

export function BrasiliaConditionsPage() {
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
        <CurrentConditions />
        <ReadingGuide />
        <AirHistory />
      </main>
      <Footer />
    </div>
  );
}
