import { useQuery } from "@tanstack/react-query";
import type { ConditionsResponse } from "@/lib/conditions";
import { withBrowserWeatherFallback } from "@/lib/weather-fallback";

export function useConditions() {
  return useQuery({
    queryKey: ["brasilia-conditions"],
    queryFn: async ({ signal }): Promise<ConditionsResponse> => {
      const response = await fetch("/api/condicoes", {
        signal: AbortSignal.any([signal, AbortSignal.timeout(15000)]),
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("Não foi possível atualizar os dados. Tente novamente.");
      const data: ConditionsResponse = await response.json();
      return withBrowserWeatherFallback(data, signal);
    },
    staleTime: 300000,
    refetchInterval: 600000,
    retry: 1,
  });
}
