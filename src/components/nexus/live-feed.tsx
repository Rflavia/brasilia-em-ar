import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

import type { ResultItem } from "@/types/nexus";

import { ResultDot } from "./result-dot";
import { SectionLabel } from "./section-label";

interface LiveFeedProps {
  results: ResultItem[];
  showHistoryLink?: boolean;
}

export function LiveFeed({
  results,
  showHistoryLink = true,
}: LiveFeedProps) {
  return (
    <section className="border-y border-border py-7">
      <div className="mb-7 flex items-center justify-between">
        <SectionLabel>Resultados em tempo real</SectionLabel>

        {showHistoryLink && (
          <Link
            to="/history"
            className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Ver histórico completo
            <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>

      <div className="scrollbar-none flex min-h-8 items-center gap-7 overflow-x-auto px-1">
        {results.map((result, index) => (
          <ResultDot
            key={result.id}
            result={result}
            entering={index === 0}
          />
        ))}
      </div>
    </section>
  );
}