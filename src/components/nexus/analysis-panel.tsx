import { useState } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  analysisService,
  type RealAnalysisOutput,
} from "@/services/analysis-service";

import type { DatasetSample } from "@/types/nexus";

import { SectionLabel } from "./section-label";


const sampleLabels: Record<DatasetSample, string> = {
  "100": "Últimos 100",
  "500": "Últimos 500",
  "1000": "Últimos 1.000",
  "2000": "Últimos 2.000",
};


type RunState =
  | "idle"
  | "processing"
  | "complete"
  | "error";


export function AnalysisPanel({
  compact = false,
  totalResults = 0,
}: {
  compact?: boolean;
  totalResults?: number;
}) {

  const [sample, setSample] =
    useState<DatasetSample>("1000");

  const [state, setState] =
    useState<RunState>("idle");

  const [output, setOutput] =
    useState<RealAnalysisOutput | null>(null);


  async function run() {

    try {

      setOutput(null);
      setState("processing");

      const result =
        await analysisService.run(sample);

      setOutput(result);
      setState("complete");

    } catch (erro) {

      console.error(
        "Erro ao executar análise:",
        erro
      );

      setState("error");

    }

  }


  return (

    <section className={compact ? "py-16" : "py-8"}>

      <div className="max-w-2xl">

        <SectionLabel>
          Análise
        </SectionLabel>

        <h2 className="mt-5 max-w-xl font-display text-4xl font-light leading-[1.12] md:text-5xl">
          Transforme dados históricos
          <br />
          em informação.
        </h2>

        <p className="mt-5 text-sm text-muted-foreground">
          Analise a distribuição dos resultados utilizando
          uma amostra real do banco de dados.
        </p>

      </div>


      <div className="mt-14 grid border-y border-border lg:grid-cols-[.8fr_1.2fr]">


        <div className="border-b border-border py-10 lg:border-b-0 lg:border-r lg:pr-12">

          <SectionLabel>
            Conjunto de dados
          </SectionLabel>


          <dl className="mt-8 space-y-5 text-xs">

            <div className="flex justify-between border-b border-border/70 pb-4">

              <dt className="text-muted-foreground">
                Fonte
              </dt>

              <dd>
                Banco de resultados
              </dd>

            </div>


            <div className="flex justify-between border-b border-border/70 pb-4">

              <dt className="text-muted-foreground">
                Disponíveis
              </dt>

              <dd>
                {totalResults.toLocaleString("pt-BR")} resultados
              </dd>

            </div>

          </dl>


          <label className="mt-7 block text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            Amostra
          </label>


          <Select
            value={sample}
            onValueChange={(value) =>
              setSample(value as DatasetSample)
            }
          >

            <SelectTrigger className="mt-3 h-11 rounded-none border-border bg-secondary px-4 shadow-none">

              <SelectValue />

            </SelectTrigger>


            <SelectContent className="rounded-none border-border bg-popover shadow-none">

              {(Object.keys(sampleLabels) as DatasetSample[]).map(
                (key) => (

                  <SelectItem
                    key={key}
                    value={key}
                  >
                    {sampleLabels[key]}
                  </SelectItem>

                )
              )}

            </SelectContent>

          </Select>


          <div className="mt-7 flex items-center justify-between">

            <SectionLabel>
              Status
            </SectionLabel>

            <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.1em]">

              <span className="size-1.5 rounded-full bg-live" />

              {state === "processing"
                ? "Processando"
                : state === "error"
                ? "Erro"
                : "Pronto"}

            </span>

          </div>


          <Button
            variant="nexus"
            className="mt-10 w-full"
            disabled={state === "processing"}
            onClick={run}
          >

            {state === "processing"
              ? "Processando dados"
              : "Executar análise"}

            <ArrowRight className="size-3.5" />

          </Button>

        </div>


        <div className="min-h-[400px] py-10 lg:pl-14">


          {state === "idle" && (

            <div className="flex h-full min-h-72 flex-col justify-center">

              <SectionLabel>
                Nenhuma análise realizada
              </SectionLabel>

              <p className="mt-4 text-sm text-muted-foreground">
                Selecione uma amostra e execute a análise.
              </p>

            </div>

          )}


          {state === "processing" && (

            <div className="flex h-full min-h-72 flex-col justify-center">

              <SectionLabel>
                Processando dados
              </SectionLabel>

              <p className="mt-4 text-sm text-muted-foreground">
                Consultando os resultados reais do banco.
              </p>

              <div className="mt-8 h-px overflow-hidden bg-border">

                <div className="analysis-progress h-full bg-foreground" />

              </div>

            </div>

          )}


          {state === "error" && (

            <div className="flex h-full min-h-72 flex-col justify-center">

              <SectionLabel>
                Erro na análise
              </SectionLabel>

              <p className="mt-4 text-sm text-muted-foreground">
                Não foi possível consultar os dados da API.
              </p>

            </div>

          )}


          {state === "complete" && output && (

            <div className="animate-fade-in">

              <div className="flex items-center justify-between">

                <SectionLabel>
                  Análise estatística
                </SectionLabel>

                <span className="border border-border px-2 py-1 text-[8px] uppercase tracking-[0.14em] text-muted-foreground">
                  Dados reais
                </span>

              </div>


              <p className="mt-10 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Distribuição da amostra
              </p>


              <div className="mt-6 space-y-6">


                <div className="border-b border-border pb-5">

                  <div className="flex items-end justify-between">

                    <span className="text-xs tracking-[0.12em]">
                      VERMELHO
                    </span>

                    <span className="font-display text-4xl font-light tabular-nums">
                      {output.redPercentage.toLocaleString("pt-BR")}%
                    </span>

                  </div>

                  <p className="mt-2 text-[10px] text-muted-foreground">
                    {output.redCount.toLocaleString("pt-BR")} ocorrências
                  </p>

                </div>


                <div className="border-b border-border pb-5">

                  <div className="flex items-end justify-between">

                    <span className="text-xs tracking-[0.12em]">
                      PRETO
                    </span>

                    <span className="font-display text-4xl font-light tabular-nums">
                      {output.blackPercentage.toLocaleString("pt-BR")}%
                    </span>

                  </div>

                  <p className="mt-2 text-[10px] text-muted-foreground">
                    {output.blackCount.toLocaleString("pt-BR")} ocorrências
                  </p>

                </div>


                <div className="border-b border-border pb-5">

                  <div className="flex items-end justify-between">

                    <span className="text-xs tracking-[0.12em]">
                      BRANCO
                    </span>

                    <span className="font-display text-4xl font-light tabular-nums">
                      {output.whitePercentage.toLocaleString("pt-BR")}%
                    </span>

                  </div>

                  <p className="mt-2 text-[10px] text-muted-foreground">
                    {output.whiteCount.toLocaleString("pt-BR")} ocorrências
                  </p>

                </div>


              </div>


              <dl className="mt-10 grid grid-cols-2 gap-8 text-xs">

                <div>

                  <dt className="text-muted-foreground">
                    Amostra analisada
                  </dt>

                  <dd className="mt-2">
                    {output.datasetSize.toLocaleString("pt-BR")} resultados
                  </dd>

                </div>


                <div>

                  <dt className="text-muted-foreground">
                    Processado
                  </dt>

                  <dd className="mt-2 font-mono">
                    {output.processedAt}
                  </dd>

                </div>

              </dl>


              <p className="mt-10 border-t border-border pt-5 text-[11px] text-muted-foreground">
                Estatísticas calculadas diretamente a partir dos resultados armazenados no banco.
              </p>

            </div>

          )}


        </div>

      </div>

    </section>

  );

}