import { useQuery } from "@tanstack/react-query";
import { loadPublicConditions } from "@/lib/public-conditions";

export function useConditions() {
  return useQuery({
    queryKey: ["brasilia-conditions"],
    queryFn: ({ signal }) => loadPublicConditions(signal),
    staleTime: 300000,
    refetchInterval: 600000,
    // A rate limit should not trigger another immediate request to the same provider.
    retry: false,
    refetchOnWindowFocus: false,
  });
}
