import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/nexus/app-shell";
import { AnalysisPanel } from "@/components/nexus/analysis-panel";

import { resultsService } from "@/services/results-service";

import type { ResultsSnapshot } from "@/types/nexus";


export const Route = createFileRoute("/analysis")({
  head: () => ({
    meta: [
      {
        title: "Análise — BOOT",
      },
      {
        name: "description",
        content:
          "Execute análises estatísticas utilizando os dados históricos coletados pelo NEXUS.",
      },
      {
        property: "og:title",
        content: "Análise — NEXUS",
      },
      {
        property: "og:description",
        content:
          "Execute análises estatísticas utilizando os dados históricos coletados pelo NEXUS.",
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

  component: AnalysisPage,
});


function AnalysisPage() {

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
          "Erro ao carregar dados da análise:",
          erro
        );

      }

    }


    // Carrega imediatamente
    carregarDados();


    // Atualiza os dados a cada 5 segundos
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

      <AppShell title="Análise">

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
      title="Análise"
      lastUpdate={data.lastUpdate}
    >

      <div className="mx-auto max-w-[1180px] px-5 pb-28 md:px-10 lg:px-12">

        <AnalysisPanel
          totalResults={data.total}
        />

      </div>

    </AppShell>

  );

}