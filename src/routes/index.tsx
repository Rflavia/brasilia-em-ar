import { createFileRoute, Navigate } from "@tanstack/react-router";

// No head() here: the home route inherits title/description/og/twitter from
// __root.tsx, and ships no og:image so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NEXUS — Data Intelligence" },
      { name: "description", content: "Monitoramento de resultados e análise de dados em tempo real." },
      { property: "og:title", content: "NEXUS — Data Intelligence" },
      { property: "og:description", content: "Monitoramento de resultados e análise de dados em tempo real." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  return <Navigate to="/overview" replace />;
}
