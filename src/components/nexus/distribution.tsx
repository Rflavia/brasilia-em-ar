import type { DistributionItem } from "@/types/nexus";
import { cn } from "@/lib/utils";

const colors = { RED: "bg-data-red", BLACK: "bg-data-black", WHITE: "bg-data-white" };
const labels = { RED: "VERMELHO", BLACK: "PRETO", WHITE: "BRANCO" };

export function Distribution({ items }: { items: DistributionItem[] }) {
  return (
    <div className="flex h-full flex-col justify-between py-1">
      <div className="grid grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.color}>
            <p className="font-display text-2xl font-light tabular-nums md:text-3xl">{item.percentage.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</p>
            <p className="mt-3 text-[10px] tracking-[0.14em] text-muted-foreground">{labels[item.color]}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 flex h-1 w-full overflow-hidden bg-secondary" aria-label="Distribuição dos resultados">
        {items.map((item) => <span key={item.color} className={cn("h-full", colors[item.color])} style={{ width: `${item.percentage}%` }} />)}
      </div>
    </div>
  );
}
