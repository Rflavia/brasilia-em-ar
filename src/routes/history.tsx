import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/nexus/app-shell";
import { LiveFeed } from "@/components/nexus/live-feed";
import { ResultsTable } from "@/components/nexus/results-table";
import { resultsService } from "@/services/results-service";

import type { ResultItem } from "@/types/nexus";


export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      {
        title: "Histórico — BOOT",
      },
      {
        name: "description",
        content: "Explore o histórico completo dos resultados monitorados.",
      },
      {
        property: "og:title",
        content: "Histórico — NEXUS",
      },
      {
        property: "og:description",
        content: "Explore o histórico completo dos resultados monitorados.",
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

  component: HistoryPage,
});


function HistoryPage() {
  const [results, setResults] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function carregarHistorico() {
      try {
        const dados = await resultsService.getResults(500);

        setResults(dados);
      } catch (erro) {
        console.error(
          "Erro ao carregar histórico:",
          erro
        );
      } finally {
        setLoading(false);
      }
    }

    carregarHistorico();
  }, []);


  if (loading) {
    return (
      <AppShell title="Histórico">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Carregando histórico...
          </p>
        </div>
      </AppShell>
    );
  }


  return (
    <AppShell title="Histórico">
      <div className="mx-auto max-w-[1180px] px-5 pb-28 pt-16 md:px-10 lg:px-12">

        <div className="mb-16 max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Banco de resultados
          </p>

          <h2 className="mt-5 font-display text-5xl font-light">
            Histórico completo.
          </h2>

          <p className="mt-5 text-sm text-muted-foreground">
            Exibindo os últimos {results.length} resultados monitorados.
          </p>
        </div>


        <LiveFeed
          results={results.slice(0, 20)}
          showHistoryLink={false}
        />


        <div className="pt-16">
          <ResultsTable
            results={results}
            title="Todos os resultados"
          />
        </div>

      </div>
    </AppShell>
  );
}