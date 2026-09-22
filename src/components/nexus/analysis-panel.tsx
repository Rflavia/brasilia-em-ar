import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { analysisService } from "@/services/analysis-service";
import type { AnalysisOutput, DatasetSample } from "@/types/nexus";
import { SectionLabel } from "./section-label";

const sampleLabels: Record<DatasetSample, string> = { "100": "Últimos 100", "500": "Últimos 500", "1000": "Últimos 1.000", "2000": "Últimos 2.000", all: "Todos os dados" };
type RunState = "idle" | "preparing" | "processing" | "complete";

export function AnalysisPanel({ compact = false }: { compact?: boolean }) {
  const [sample, setSample] = useState<DatasetSample>("1000");
  const [state, setState] = useState<RunState>("idle");
  const [output, setOutput] = useState<AnalysisOutput | null>(null);

  const run = async () => {
    setOutput(null); setState("preparing");
    await new Promise((resolve) => setTimeout(resolve, 350));
    setState("processing");
    const result = await analysisService.run(sample);
    setOutput(result); setState("complete");
  };

  const stateLabel = state === "preparing" ? "Preparando dados" : state === "processing" ? "Processando dados" : state === "complete" ? "Análise concluída" : "Executar análise";

  return (
    <section className={compact ? "py-16" : "py-8"}>
      <div className="max-w-2xl">
        <SectionLabel>Análise</SectionLabel>
        <h2 className="mt-5 max-w-xl font-display text-4xl font-light leading-[1.12] md:text-5xl">Transforme dados históricos<br />em informação.</h2>
        <p className="mt-5 text-sm text-muted-foreground">Execute uma análise utilizando os dados históricos selecionados.</p>
      </div>
      <div className="mt-14 grid border-y border-border lg:grid-cols-[.8fr_1.2fr]">
        <div className="border-b border-border py-10 lg:border-b-0 lg:border-r lg:pr-12">
          <SectionLabel>Conjunto de dados</SectionLabel>
          <dl className="mt-8 space-y-5 text-xs">
            <div className="flex justify-between border-b border-border/70 pb-4"><dt className="text-muted-foreground">Fonte</dt><dd>Banco de resultados</dd></div>
            <div className="flex justify-between border-b border-border/70 pb-4"><dt className="text-muted-foreground">Disponíveis</dt><dd>2.008 resultados</dd></div>
          </dl>
          <label className="mt-7 block text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Amostra</label>
          <Select value={sample} onValueChange={(value) => setSample(value as DatasetSample)}>
            <SelectTrigger className="mt-3 h-11 rounded-none border-border bg-secondary px-4 shadow-none"><SelectValue /></SelectTrigger>
            <SelectContent className="rounded-none border-border bg-popover shadow-none">
              {(Object.keys(sampleLabels) as DatasetSample[]).map((key) => <SelectItem key={key} value={key}>{sampleLabels[key]}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="mt-7 flex items-center justify-between"><SectionLabel>Status</SectionLabel><span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.1em]"><span className="size-1.5 rounded-full bg-live" />Pronto</span></div>
          <Button variant="nexus" className="mt-10 w-full" disabled={state === "preparing" || state === "processing"} onClick={run}>{stateLabel}<ArrowRight className="size-3.5" /></Button>
        </div>
        <div className="min-h-[400px] py-10 lg:pl-14">
          {!output ? (
            <div className="flex h-full min-h-72 flex-col justify-center">
              <SectionLabel>{state === "idle" ? "Nenhuma análise realizada" : stateLabel}</SectionLabel>
              <p className="mt-4 text-sm text-muted-foreground">{state === "idle" ? "Execute uma análise para visualizar o resultado." : "Preparando o conjunto de dados demonstrativo selecionado."}</p>
              {state !== "idle" && <div className="mt-8 h-px overflow-hidden bg-border"><div className="analysis-progress h-full bg-foreground" /></div>}
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between"><SectionLabel>Análise / {output.id}</SectionLabel><span className="border border-border px-2 py-1 text-[8px] uppercase tracking-[0.14em] text-muted-foreground">Dados simulados</span></div>
              <p className="mt-12 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Resultado demonstrativo</p>
              <div className="mt-5 flex items-end justify-between border-b border-border pb-10"><span className="font-display text-4xl font-light">BRANCO</span><span className="font-display text-6xl font-light tabular-nums">{output.confidence}%</span></div>
              <p className="mt-4 text-right text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Confiança demonstrativa</p>
              <dl className="mt-10 grid grid-cols-2 gap-8 text-xs"><div><dt className="text-muted-foreground">Conjunto de dados</dt><dd className="mt-2">{output.datasetSize.toLocaleString("pt-BR")} resultados</dd></div><div><dt className="text-muted-foreground">Processado</dt><dd className="mt-2 font-mono">{output.processedAt}</dd></div></dl>
              <p className="mt-12 border-t border-border pt-5 text-[11px] text-muted-foreground">Apenas demonstração. Integração com o modelo real pendente.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
