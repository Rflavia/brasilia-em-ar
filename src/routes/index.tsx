import { createFileRoute } from "@tanstack/react-router";
import { BrasiliaHomePage } from "@/components/brasilia/home-page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Brasília em Ar — Clima, ar e cidade" },
      {
        name: "description",
        content:
          "Um novo olhar para o clima e a qualidade do ar no Distrito Federal. Primeira versão com dados ilustrativos.",
      },
      { property: "og:title", content: "Brasília em Ar — Clima, ar e cidade" },
      {
        property: "og:description",
        content:
          "Clima e qualidade do ar, traduzidos em informação para acompanhar a cidade e o seu dia. Prévia com dados ilustrativos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BrasiliaHomePage,
});
