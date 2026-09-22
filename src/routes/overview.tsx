import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/nexus/app-shell";
import { AnalysisPanel } from "@/components/nexus/analysis-panel";
import { Distribution } from "@/components/nexus/distribution";
import { LiveFeed } from "@/components/nexus/live-feed";
import { MetricCounter } from "@/components/nexus/metric-counter";
import { ResultsTable } from "@/components/nexus/results-table";
import { SectionLabel } from "@/components/nexus/section-label";

import { resultsService } from "@/services/results-service";

import type { ResultsSnapshot } from "@/types/nexus";


export const Route = createFileRoute("/overview")({
  head: () => ({
    meta: [
      { title: "Visão geral — BOOT" },
      {
        name: "description",
        content:
          "Visão geral em tempo real dos resultados coletados, distribuição e análise.",
      },
      {
        property: "og:title",
        content: "Visão geral — NEXUS",
      },
      {
        property: "og:description",
        content:
          "Visão geral em tempo real dos resultados coletados, distribuição e análise.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
  }),

  component: OverviewPage,
});


function OverviewPage() {

  const [data, setData] =
    useState<ResultsSnapshot | null>(null);


  useEffect(() => {

    let ativo = true;


    async function carregarDados() {

      try {

        const snapshot =
          await resultsService.getSnapshot();

        if (ativo) {
          setData(snapshot);
        }

      } catch (erro) {

        console.error(
          "Erro ao carregar dados:",
          erro
        );

      }

    }


    // Carrega imediatamente ao abrir a página
    carregarDados();


    // Atualiza automaticamente a cada 5 segundos
    const intervalo = setInterval(() => {

      carregarDados();

    }, 5000);


    // Para o intervalo quando sair da página
    return () => {

      ativo = false;

      clearInterval(intervalo);

    };

  }, []);


  if (!data) {

    return (

      <AppShell title="Visão geral">

        <div className="flex min-h-[400px] items-center justify-center">

          <p className="text-sm text-muted-foreground">
            Carregando dados...
          </p>

        </div>

      </AppShell>

    );

  }


  return (

    <AppShell
      title="Visão geral"
      lastUpdate={data.lastUpdate}
    >

      <div className="mx-auto max-w-[1380px] px-5 pb-28 md:px-10 lg:px-12">


        {/* =====================================================
            RESUMO PRINCIPAL
        ===================================================== */}

        <section className="grid min-h-[440px] items-center gap-16 py-20 lg:grid-cols-[1.08fr_.92fr] lg:gap-24">


          <div>

            <p className="font-display text-[clamp(5rem,10vw,9rem)] font-light leading-none tabular-nums">

              <MetricCounter value={data.total} />

            </p>


            <SectionLabel>
              Resultados coletados
            </SectionLabel>


            <div className="mt-12 flex gap-10 text-xs">


              <div>

                <p className="text-muted-foreground">
                  Monitoramento contínuo
                </p>

              </div>


              <div>

                <p className="text-muted-foreground">
                  Desde
                </p>

                <p className="mt-2 font-mono">
                  {data.since}
                </p>

              </div>


            </div>

          </div>


          <Distribution
            items={data.distribution}
          />


        </section>


        {/* =====================================================
            RESULTADOS EM TEMPO REAL
        ===================================================== */}

        <LiveFeed
          results={data.recent}
        />


        {/* =====================================================
            PAINEL DE ANÁLISE
            Agora recebe a quantidade REAL do banco
        ===================================================== */}

        <AnalysisPanel
          compact
          totalResults={data.total}
        />


        {/* =====================================================
            DADOS RECENTES + OCORRÊNCIAS DE BRANCO
        ===================================================== */}

        <div className="grid gap-20 border-t border-border py-16 xl:grid-cols-[1.35fr_.65fr]">


          <ResultsTable
            results={data.recent}
          />


          <section>


            <SectionLabel>
              Ocorrências de branco
            </SectionLabel>


            <div className="mt-8 grid grid-cols-2 gap-10 border-b border-border pb-8">


              <div>

                <p className="font-display text-4xl font-light">

                  {data.whiteTotal}

                </p>

                <p className="mt-2 text-[9px] uppercase tracking-[0.14em] text-muted-foreground">

                  Total

                </p>

              </div>


              <div>

                <p className="font-display text-4xl font-light">

                  {data.whiteAverageInterval.toLocaleString(
                    "pt-BR"
                  )}

                </p>

                <p className="mt-2 text-[9px] uppercase tracking-[0.14em] text-muted-foreground">

                  Intervalo médio

                </p>

              </div>


            </div>


            <div>

              {data.whiteOccurrences.map(
                (item) => (

                  <div
                    key={`${item.time}-${item.rounds}`}
                    className="flex justify-between border-b border-border/70 py-5 text-xs"
                  >

                    <span className="font-mono text-muted-foreground">

                      {item.time}

                    </span>


                    <span>

                      {item.rounds} rodadas

                    </span>

                  </div>

                )
              )}

            </div>


          </section>


        </div>


      </div>

    </AppShell>

  );

}