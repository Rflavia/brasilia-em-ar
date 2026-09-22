import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/nexus/app-shell";
import { Distribution } from "@/components/nexus/distribution";
import { SectionLabel } from "@/components/nexus/section-label";

import { resultsService } from "@/services/results-service";

import type { ResultsSnapshot } from "@/types/nexus";


export const Route = createFileRoute("/data")({
  head: () => ({
    meta: [
      {
        title: "Dados — BOOT",
      },
      {
        name: "description",
        content:
          "Volume, distribuição, fonte e detalhes de atualização do conjunto de dados.",
      },
      {
        property: "og:title",
        content: "Dados — NEXUS",
      },
      {
        property: "og:description",
        content:
          "Volume, distribuição, fonte e detalhes de atualização do conjunto de dados.",
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

  component: DataPage,
});


function DataPage() {

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


    // Carrega imediatamente
    carregarDados();


    // Atualiza automaticamente a cada 5 segundos
    const intervalo = setInterval(() => {

      carregarDados();

    }, 5000);


    return () => {

      ativo = false;

      clearInterval(intervalo);

    };

  }, []);


  if (!data) {

    return (

      <AppShell title="Dados">

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
      title="Dados"
      lastUpdate={data.lastUpdate}
    >

      <div className="mx-auto max-w-[1180px] px-5 pb-28 pt-16 md:px-10 lg:px-12">


        <div className="max-w-2xl">

          <SectionLabel>
            Conjunto de dados
          </SectionLabel>

          <h2 className="mt-5 font-display text-5xl font-light">
            Dados coletados.
          </h2>

          <p className="mt-5 text-sm text-muted-foreground">
            Volume atual do conjunto de dados,
            fonte e distribuição dos resultados.
          </p>

        </div>


        <div className="mt-20 grid border-y border-border lg:grid-cols-2">


          <div className="py-12 lg:border-r lg:border-border lg:pr-14">


            <p className="font-display text-7xl font-light tabular-nums">

              {data.total.toLocaleString("pt-BR")}

            </p>


            <p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Resultados disponíveis
            </p>


            <dl className="mt-14 space-y-5 text-xs">


              <div className="flex justify-between border-b border-border/70 pb-5">

                <dt className="text-muted-foreground">
                  Fonte
                </dt>

                <dd>
                  Banco de resultados
                </dd>

              </div>


              <div className="flex justify-between border-b border-border/70 pb-5">

                <dt className="text-muted-foreground">
                  Monitoramento
                </dt>

                <dd className="flex items-center gap-2">

                  <span className="size-1.5 rounded-full bg-live" />

                  Ativo

                </dd>

              </div>


              <div className="flex justify-between border-b border-border/70 pb-5">

                <dt className="text-muted-foreground">
                  Desde
                </dt>

                <dd className="font-mono">
                  {data.since}
                </dd>

              </div>


              <div className="flex justify-between">

                <dt className="text-muted-foreground">
                  Última atualização
                </dt>

                <dd className="font-mono">
                  {data.lastUpdate}
                </dd>

              </div>


            </dl>


          </div>


          <div className="border-t border-border py-12 lg:border-t-0 lg:pl-14">

            <Distribution
              items={data.distribution}
            />

          </div>


        </div>


        <p className="mt-7 text-[10px] text-muted-foreground">
          Dados obtidos em tempo real através da API do NEXUS.
        </p>


      </div>

    </AppShell>

  );

}