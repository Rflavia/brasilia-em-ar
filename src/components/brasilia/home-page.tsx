import { useEffect, useState } from "react";
import {
  ArrowDown,
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

import { WEATHER_PREVIEW } from "@/mocks/weather-preview";

const navigation = [
  { href: "#agora", label: "Agora" },
  { href: "#entenda", label: "Entenda os dados" },
  { href: "#projeto", label: "O projeto" },
];

function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <a className={`bea-brand${footer ? " bea-brand-footer" : ""}`} href="#inicio">
      <span className="bea-brand-mark" aria-hidden="true">
        <Sun size={21} strokeWidth={1.5} />
      </span>
      <span>
        brasília <span className="bea-brand-end">em ar</span>
      </span>
    </a>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <header className="bea-header">
      <div className="bea-container bea-header-inner">
        <Brand />
        <nav className="bea-desktop-nav" aria-label="Navegação principal">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
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
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
              {item.label}
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
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
        <h2 id="bea-conditions-heading">Um retrato da cidade</h2>
        <span>
          <span className="bea-sample-dot" aria-hidden="true" /> Cenário ilustrativo ·{" "}
          {weather.timeLabel}
        </span>
      </div>
      <div className="bea-conditions">
        <article className="bea-weather" aria-labelledby="bea-weather-heading">
          <div className="bea-weather-top">
            <div>
              <p className="bea-eyebrow">{weather.region}</p>
              <h3 id="bea-weather-heading">Lá fora, em {weather.city}.</h3>
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
            <p className="bea-eyebrow">O ar em perspectiva</p>
            <span className="bea-air-symbol" aria-hidden="true">
              <Wind size={23} strokeWidth={1.4} />
            </span>
          </div>
          <h3 id="bea-air-heading">
            Pequenas partículas.
            <br />
            Uma informação importante.
          </h3>
          <div className="bea-pollutant-label">
            PM2.5 <span>Partículas finas</span>
          </div>
          <p className="bea-air-reading">
            {weather.pm25.toLocaleString("pt-BR")}
            <span>µg/m³</span>
          </p>
          <p className="bea-air-caption">
            Partículas finas em suspensão no ar.
            <br />
            Medidas em microgramas por metro cúbico.
          </p>
          <a href="#entenda" className="bea-air-link">
            O que esse número significa? <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </article>
      </div>
      <p className="bea-data-note">
        Os valores desta primeira versão são exemplos para apresentação. Ainda não representam as
        condições atuais de Brasília.
      </p>
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

export function BrasiliaHomePage() {
  return (
    <div className="bea-site" id="inicio">
      <a href="#bea-main" className="bea-skip-link">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="bea-main" className="bea-container">
        <section className="bea-intro" aria-labelledby="bea-heading">
          <div className="bea-intro-copy">
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
            <a className="bea-primary-link" href="#agora">
              Conhecer as condições <ArrowDown size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="bea-intro-aside">
            <span className="bea-edition">Um novo olhar para o Distrito Federal</span>
            <span className="bea-preview-badge">Prévia visual · dados ilustrativos</span>
          </div>
        </section>
        <CurrentConditions />
        <ReadingGuide />
        <section id="projeto" className="bea-project" aria-labelledby="bea-project-heading">
          <div>
            <p className="bea-eyebrow">Brasília em Ar</p>
            <h2 id="bea-project-heading">
              A cidade muda.
              <br />
              Nosso olhar acompanha.
            </h2>
          </div>
          <div className="bea-project-copy">
            <p>
              Um projeto independente para aproximar clima, qualidade do ar e cotidiano no Distrito
              Federal.
            </p>
            <p>
              Esta é a primeira etapa: uma experiência visual com valores ilustrativos. A conexão
              com fontes de dados e as análises históricas fazem parte das próximas etapas.
            </p>
            <a href="#inicio">
              Voltar ao início <ArrowRight size={15} aria-hidden="true" />
            </a>
          </div>
        </section>
      </main>
      <footer className="bea-footer">
        <div className="bea-container bea-footer-inner">
          <Brand footer />
          <p>Clima. Ar. Cidade.</p>
          <span>Projeto independente · versão demonstrativa</span>
        </div>
      </footer>
    </div>
  );
}
