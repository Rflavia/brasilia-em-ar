import { createFileRoute } from "@tanstack/react-router";
import { BrasiliaConditionsPage } from "@/components/brasilia/home-page";

export const Route = createFileRoute("/condicoes")({
  head: () => ({
    meta: [
      { title: "Condições — Brasília em Ar" },
      {
        name: "description",
        content:
          "Clima, qualidade do ar e evolução de PM2.5 em Brasília. Demonstração com dados ilustrativos.",
      },
    ],
  }),
  component: BrasiliaConditionsPage,
});
