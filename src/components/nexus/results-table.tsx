import { useMemo, useState } from "react";
import type { ResultColor, ResultItem } from "@/types/nexus";
import { cn } from "@/lib/utils";
import { SectionLabel } from "./section-label";

const dotStyles = { RED: "bg-data-red", BLACK: "bg-data-black border border-border", WHITE: "bg-data-white border border-data-white-border" };
const filters: Array<ResultColor | "ALL"> = ["ALL", "RED", "BLACK", "WHITE"];
const labels = { ALL: "TODOS", RED: "VERMELHO", BLACK: "PRETO", WHITE: "BRANCO" };

export function ResultsTable({ results, title = "Dados recentes" }: { results: ResultItem[]; title?: string }) {
  const [filter, setFilter] = useState<ResultColor | "ALL">("ALL");
  const filtered = useMemo(() => filter === "ALL" ? results : results.filter((row) => row.color === filter), [filter, results]);
  return (
    <section>
      <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <SectionLabel>{title}</SectionLabel>
        <div className="flex gap-1" aria-label="Filtrar resultados">
          {filters.map((item) => (
            <button key={item} onClick={() => setFilter(item)} className={cn("h-8 border-b px-3 text-[9px] tracking-[0.12em] transition-colors duration-200", filter === item ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}>{labels[item]}</button>
          ))}
        </div>
      </div>
      <div className="w-full">
        <div className="grid grid-cols-[1.2fr_.7fr_1fr] border-b border-border pb-3 text-[9px] uppercase tracking-[0.14em] text-muted-foreground"><span>Horário</span><span>Número</span><span>Resultado</span></div>
        <div className="transition-opacity duration-200">
          {filtered.map((row) => (
            <div key={row.id} className="grid grid-cols-[1.2fr_.7fr_1fr] items-center border-b border-border/70 py-5 text-xs">
              <span className="font-mono text-muted-foreground">{row.time}</span><span className="font-mono text-foreground">{row.number}</span>
              <span className="flex items-center gap-3 text-[10px] tracking-[0.12em]"><span className={cn("size-2 rounded-full", dotStyles[row.color])} />{labels[row.color]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
