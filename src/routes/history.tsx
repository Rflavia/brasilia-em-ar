import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/nexus/app-shell";
import { LiveFeed } from "@/components/nexus/live-feed";
import { ResultsTable } from "@/components/nexus/results-table";
import { resultsService } from "@/services/results-service";
export const Route = createFileRoute("/history")({ head: () => ({ meta: [
  { title: "Histórico — NEXUS" }, { name: "description", content: "Explore o histórico completo dos resultados monitorados." }, { property: "og:title", content: "Histórico — NEXUS" }, { property: "og:description", content: "Explore o histórico completo dos resultados monitorados." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: HistoryPage });
function HistoryPage() { const data = resultsService.getSnapshot(); return <AppShell title="Histórico"><div className="mx-auto max-w-[1180px] px-5 pb-28 pt-16 md:px-10 lg:px-12"><div className="mb-16 max-w-2xl"><p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Banco de resultados</p><h2 className="mt-5 font-display text-5xl font-light">Histórico completo.</h2><p className="mt-5 text-sm text-muted-foreground">Revise os últimos resultados monitorados e filtre o conjunto de dados por resultado.</p></div><LiveFeed results={data.recent} /><div className="pt-16"><ResultsTable results={data.recent} title="Todos os resultados" /></div></div></AppShell>; }
