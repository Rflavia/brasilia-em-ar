import { createFileRoute } from "@tanstack/react-router";
import { getConditions } from "@/services/conditions.server";

export const Route = createFileRoute("/api/condicoes")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const data = await getConditions();
          return Response.json(data, {
            headers: {
              "Cache-Control": data.issues.length ? "no-store" : "public, max-age=60, s-maxage=300",
            },
          });
        } catch {
          return Response.json(
            { error: "Não foi possível consultar os dados agora. Tente novamente em instantes." },
            { status: 503, headers: { "Cache-Control": "no-store" } },
          );
        }
      },
    },
  },
});
