import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { ResultItem } from "@/types/nexus";
import { cn } from "@/lib/utils";

const dotStyles = { RED: "bg-data-red", BLACK: "bg-data-black border border-border", WHITE: "bg-data-white border border-data-white-border" };
const labels = { RED: "Vermelho", BLACK: "Preto", WHITE: "Branco" };

export function ResultDot({ result, entering = false }: { result: ResultItem; entering?: boolean }) {
  return (
    <TooltipProvider delayDuration={120}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button aria-label={`${labels[result.color]}, número ${result.number}, ${result.time}`} className={cn("size-4 shrink-0 rounded-full transition-transform duration-200 hover:scale-125 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring", dotStyles[result.color], entering && "animate-slide-in-right")} />
        </TooltipTrigger>
        <TooltipContent side="top" className="w-36 border border-border bg-popover p-3 text-popover-foreground shadow-none">
          <dl className="grid grid-cols-2 gap-y-2 text-[10px] uppercase tracking-[0.1em]">
            <dt className="text-muted-foreground">Número</dt><dd className="text-right text-foreground">{result.number}</dd>
            <dt className="text-muted-foreground">Cor</dt><dd className="text-right text-foreground">{labels[result.color]}</dd>
            <dt className="text-muted-foreground">Horário</dt><dd className="text-right font-mono text-foreground">{result.time}</dd>
          </dl>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
