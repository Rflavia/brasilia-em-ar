import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/nexus/app-shell";
import { AnalysisPanel } from "@/components/nexus/analysis-panel";
export const Route = createFileRoute("/analysis")({ head: () => ({ meta: [
  { title: "Análise — NEXUS" }, { name: "description", content: "Execute uma análise simulada utilizando os dados históricos selecionados." }, { property: "og:title", content: "Análise — NEXUS" }, { property: "og:description", content: "Execute uma análise simulada utilizando os dados históricos selecionados." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: AnalysisPage });
function AnalysisPage() { return <AppShell title="Análise"><div className="mx-auto max-w-[1180px] px-5 pb-28 md:px-10 lg:px-12"><AnalysisPanel /></div></AppShell>; }
