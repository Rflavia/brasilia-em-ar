  import { useEffect, useMemo, useState } from "react";
  import { createFileRoute, Link } from "@tanstack/react-router";
  import {
    Activity,
    ArrowRight,
    CircleDot,
    Clock3,
  } from "lucide-react";

  import { AppShell } from "@/components/nexus/app-shell";
  import { resultsService } from "@/services/results-service";
  import type { ResultsSnapshot } from "@/types/nexus";

  export const Route = createFileRoute("/overview")({
    head: () => ({
      meta: [
        {
          title: "Início — BOOT",
        },
        {
          name: "description",
          content: "Monitoramento e análise de resultados em tempo real.",
        },
        {
          property: "og:title",
          content: "BOOT",
        },
        {
          property: "og:description",
          content: "Monitoramento e análise de resultados em tempo real.",
        },
        {
          property: "og:type",
          content: "website",
        },
      ],
    }),

    component: OverviewPage,
  });

  function OverviewPage() {
    const [data, setData] = useState<ResultsSnapshot | null>(null);

    useEffect(() => {
      let ativo = true;

      async function carregarDados() {
        try {
          const snapshot = await resultsService.getSnapshot();

          if (ativo) {
            setData(snapshot);
          }
        } catch (erro) {
          console.error("Erro ao carregar dados:", erro);
        }
      }

      carregarDados();

      const intervalo = setInterval(() => {
        carregarDados();
      }, 5000);

      return () => {
        ativo = false;
        clearInterval(intervalo);
      };
    }, []);

    /*
    * BRANCOS DE HOJE
    *
     */
    const brancosHoje = data?.whiteToday ?? 0;

    if (!data) {
      return (
        <AppShell title="Início">
          <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-5">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="size-2 animate-pulse rounded-full bg-primary" />
              Carregando dados...
            </div>
          </div>
        </AppShell>
      );
    }

    const ultimaRodada = data.recent[0];

    return (
      <AppShell
        title="Início"
        lastUpdate={data.lastUpdate}
      >
        <div className="w-full overflow-hidden">

          {/* =====================================================
              HERO
          ===================================================== */}

          <section className="relative w-full">

            <div
              className="
                mx-auto
                grid
                w-full
                grid-cols-1
                items-center
                gap-6
                px-5
                pb-8
                pt-10

                sm:px-6
                sm:pb-10
                sm:pt-12

                md:px-8
                md:pt-14

                lg:min-h-[540px]
                lg:grid-cols-[0.88fr_1.12fr]
                lg:gap-0
                lg:px-10
                lg:pb-6
                lg:pt-4

                xl:min-h-[590px]
                xl:px-12

                2xl:px-14
              "
            >

              {/* =================================================
                  TEXTO
              ================================================= */}

              <div
                className="
                  relative
                  z-20
                  mx-auto
                  w-full
                  max-w-[680px]

                  lg:mx-0
                  lg:max-w-none
                  lg:pl-[clamp(0rem,2vw,2.5rem)]
                "
              >
                <p
                  className="
                    mb-5
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.24em]
                    text-primary

                    sm:text-[10px]
                    md:mb-6
                    lg:text-[11px]
                  "
                >
                 
                </p>

                <h1
                  className="
                    font-display
                    text-[clamp(2.35rem,11vw,3.3rem)]
                    font-semibold
                    leading-[1.04]
                    tracking-[-0.045em]
                    text-foreground

                    sm:text-[clamp(3rem,8vw,4rem)]

                    lg:text-[clamp(3.2rem,4.1vw,4.7rem)]
                    lg:leading-[1.07]
                  "
                >
                  <span className="block">
                    Mais dados.
                  </span>

                  <span className="block">
                    Mais estratégia.
                  </span>

                  <span className="block">
                    Mais resultados.
                  </span>
                </h1>

                <p
                  className="
                    mt-6
                    max-w-[520px]
                    text-[14px]
                    leading-6
                    text-muted-foreground

                    sm:text-[15px]
                    sm:leading-7

                    md:mt-7
                    md:text-[16px]

                    xl:text-[18px]
                    xl:leading-8
                  "
                >
                  Análises inteligentes para você
                  <br className="hidden sm:block" />
                  {" "}jogar com mais informação.
                </p>

                {/* BOTÕES */}

                <div
                  className="
                    mt-7
                    flex
                    w-full
                    flex-wrap
                    gap-3

                    sm:mt-8
                    sm:w-auto
                    sm:gap-4
                  "
                >
                  <Link
                    to="/analysis"
                    className="
                      group
                      flex
                      h-12
                      items-center
                      justify-center
                      gap-3
                      rounded-xl
                      bg-primary
                      px-5
                      text-[11px]
                      font-semibold
                      text-primary-foreground
                      shadow-[0_0_28px_rgba(41,98,255,0.20)]
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      hover:brightness-110

                      sm:h-13
                      sm:px-6
                      sm:text-[12px]

                      lg:h-14
                      lg:px-8
                      lg:text-[13px]
                    "
                  >
                    Ver Análise Atual

                    <ArrowRight
                      className="
                        size-5
                        transition-transform
                        group-hover:translate-x-1
                      "
                    />
                  </Link>

                  <Link
                    to="/data"
                    className="
                      flex
                      h-12
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-primary/50
                      px-5
                      text-[11px]
                      font-medium
                      text-foreground
                      transition-all
                      duration-200
                      hover:border-primary
                      hover:bg-primary/10

                      sm:h-13
                      sm:px-6
                      sm:text-[12px]

                      lg:h-14
                      lg:px-8
                      lg:text-[13px]
                    "
                  >
                    Como funciona?
                  </Link>
                </div>
              </div>

              {/* =================================================
                  ROLETA
                  AGORA APARECE TAMBÉM NO CELULAR
              ================================================= */}

              <div
                className="
                  relative
                  mx-auto
                  mt-3
                  h-[250px]
                  w-full
                  max-w-[680px]
                  overflow-hidden

                  sm:h-[330px]

                  md:h-[400px]

                  lg:mt-0
                  lg:h-full
                  lg:min-h-[520px]
                  lg:max-w-none
                  lg:overflow-visible

                  xl:min-h-[570px]
                "
              >
                <div
                  className="
                    absolute
                    inset-0
                    z-10
                    bg-gradient-to-r
                    from-background/60
                    via-transparent
                    to-transparent

                    lg:from-background
                    lg:via-background/15
                  "
                />

                <img
                  src="/roulette-hero.png"
                  alt="Roleta BOOT"
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    object-center

                    sm:object-[55%_center]

                    lg:object-cover
                    lg:object-center
                  "
                />

                <div
                  className="
                    absolute
                    inset-x-0
                    bottom-0
                    z-10
                    h-20
                    bg-gradient-to-t
                    from-background
                    to-transparent

                    sm:h-24
                    lg:h-32
                  "
                />

                <div
                  className="
                    absolute
                    inset-x-0
                    top-0
                    z-10
                    h-12
                    bg-gradient-to-b
                    from-background/50
                    to-transparent

                    lg:hidden
                  "
                />
              </div>
            </div>
          </section>

          {/* =====================================================
              CARDS PRINCIPAIS
          ===================================================== */}

          <section
            className="
              relative
              z-20
              mx-auto
              grid
              w-full
              grid-cols-1
              gap-3
              px-5
              pb-10

              min-[430px]:grid-cols-2

              sm:gap-4
              sm:px-6
              sm:pb-12

              md:px-8

              lg:grid-cols-4
              lg:px-10
              lg:pb-14

              xl:px-12

              2xl:px-14
            "
          >

            {/* MONITORAMENTO */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-border
                bg-card
                p-5
                shadow-sm

                sm:min-h-[180px]
                sm:p-6

                lg:min-h-[195px]
                lg:p-6

                xl:p-7
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-muted-foreground

                  sm:text-[10px]
                  xl:text-[11px]
                "
              >
                <Activity className="size-4 shrink-0" />
                Monitoramento
              </div>

              <div className="mt-5 flex items-center gap-3 sm:mt-6">
                <span className="relative flex size-4 shrink-0 sm:size-5">
                  <span
                    className="
                      absolute
                      inline-flex
                      size-full
                      animate-ping
                      rounded-full
                      bg-live
                      opacity-40
                    "
                  />

                  <span
                    className="
                      relative
                      inline-flex
                      size-full
                      rounded-full
                      bg-live
                    "
                  />
                </span>

                <p
                  className="
                    font-display
                    text-[22px]
                    font-semibold
                    text-foreground

                    sm:text-[25px]
                    xl:text-[28px]
                  "
                >
                  Ativo
                </p>
              </div>

              <p
                className="
                  mt-3
                  text-[12px]
                  leading-5
                  text-muted-foreground

                  sm:mt-4
                  sm:text-[13px]

                  xl:text-[14px]
                "
              >
                Coletando resultados em tempo real
              </p>
            </div>

            {/* ÚLTIMA RODADA */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-border
                bg-card
                p-5
                shadow-sm

                sm:min-h-[180px]
                sm:p-6

                lg:min-h-[195px]
                lg:p-6

                xl:p-7
              "
            >
              <div
                className="
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-muted-foreground

                  sm:text-[10px]
                  xl:text-[11px]
                "
              >
                Última rodada
              </div>

              {ultimaRodada ? (
                <>
                  <div className="mt-5 flex items-center gap-3 sm:mt-6">
                    <p
                      className="
                        font-display
                        text-[38px]
                        font-semibold
                        tabular-nums
                        text-foreground

                        sm:text-[42px]
                        xl:text-5xl
                      "
                    >
                      {ultimaRodada.number}
                    </p>

                    <div
                      className={`
                        size-8
                        shrink-0
                        rounded-full
                        border
                        sm:size-9
                        xl:size-10
                        ${
                          ultimaRodada.color === "RED"
                            ? "border-red-500/30 bg-red-500"
                            : ultimaRodada.color === "BLACK"
                              ? "border-zinc-700 bg-zinc-950"
                              : "border-zinc-300 bg-white"
                        }
                      `}
                    />
                  </div>

                  <p
                    className="
                      mt-3
                      break-words
                      font-mono
                      text-[10px]
                      text-muted-foreground

                      sm:mt-4
                      sm:text-[11px]

                      xl:text-xs
                    "
                  >
                    {ultimaRodada.time}
                  </p>
                </>
              ) : (
                <p className="mt-6 text-3xl">
                  —
                </p>
              )}
            </div>

            {/* BRANCOS HOJE */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-border
                bg-card
                p-5
                shadow-sm

                sm:min-h-[180px]
                sm:p-6

                lg:min-h-[195px]
                lg:p-6

                xl:p-7
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-muted-foreground

                  sm:text-[10px]
                  xl:text-[11px]
                "
              >
                <CircleDot className="size-4 shrink-0" />
                Brancos hoje
              </div>

              <p
                className="
                  mt-5
                  font-display
                  text-[38px]
                  font-semibold
                  tabular-nums
                  text-foreground

                  sm:mt-6
                  sm:text-[42px]

                  xl:text-5xl
                "
              >
                {brancosHoje.toLocaleString("pt-BR")}
              </p>

              <p
                className="
                  mt-3
                  text-[12px]
                  leading-5
                  text-muted-foreground

                  sm:mt-4
                  sm:text-[13px]

                  xl:text-[14px]
                "
              >
                Registrados no dia de hoje
              </p>
            </div>

            {/* PRÓXIMA ANÁLISE */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-border
                bg-card
                p-5
                shadow-sm

                sm:min-h-[180px]
                sm:p-6

                lg:min-h-[195px]
                lg:p-6

                xl:p-7
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-[9px]
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-muted-foreground

                  sm:text-[10px]
                  xl:text-[11px]
                "
              >
                <Clock3 className="size-4 shrink-0" />
                Próxima análise
              </div>

              <div className="mt-5 flex items-center gap-3 sm:mt-6">
                <span className="relative flex size-3.5 shrink-0 sm:size-4">
                  <span
                    className="
                      absolute
                      inline-flex
                      size-full
                      animate-ping
                      rounded-full
                      bg-live
                      opacity-40
                    "
                  />

                  <span
                    className="
                      relative
                      inline-flex
                      size-full
                      rounded-full
                      bg-live
                    "
                  />
                </span>

                <p
                  className="
                    font-display
                    text-[19px]
                    font-semibold
                    leading-tight
                    text-foreground

                    sm:text-[21px]
                    xl:text-[25px]
                  "
                >
                  Em andamento
                </p>
              </div>

              <p
                className="
                  mt-3
                  text-[12px]
                  text-muted-foreground

                  sm:mt-4
                  sm:text-[13px]

                  xl:text-[14px]
                "
              >
                Aguarde...
              </p>
            </div>
          </section>
        </div>
      </AppShell>
    );
  }