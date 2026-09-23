import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Database,
  LoaderCircle,
  Target,
} from "lucide-react";

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


  /*
    IMPORTANTE:

    Os alvos abaixo ainda NÃO são previsões reais.

    Estamos deixando o layout preparado para receber
    os dados do motor de análise posteriormente.

    Quando o backend gerar:
    - horário inicial
    - horário final
    - técnica
    - probabilidade
    - observação

    substituiremos estes placeholders pelos dados reais.
  */

  const aguardandoAnalise =
    state === "idle" || state === "processing";


  return (

    <section
      className={
        compact
          ? "py-12"
          : "py-10 md:py-14"
      }
    >

      {/* =====================================================
          CABEÇALHO
      ===================================================== */}

      <div className="flex flex-col gap-6 pb-8 md:flex-row md:items-start md:justify-between">


        <div className="flex items-start gap-4">

          {/* ÍCONE */}

          <div className="flex size-14 shrink-0 items-center justify-center rounded-full border border-[#ff315f]/40 bg-[#ff315f]/10 shadow-[0_0_35px_rgba(255,49,95,0.15)]">

            <Target className="size-7 text-[#ff315f]" />

          </div>


          {/* TÍTULO */}

          <div>

            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              Inteligência baseada em dados
            </p>

            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Análise Atual
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              Com base nos padrões identificados nos resultados
              coletados, acompanhe os próximos alvos da análise.
            </p>

          </div>

        </div>


        {/* STATUS */}

        <div className="flex flex-col items-start md:items-end">

          <div
            className={`
              flex items-center gap-2 rounded-full border px-4 py-2
              text-xs font-medium

              ${
                state === "processing"
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : state === "complete"
                  ? "border-live/30 bg-live/10 text-live"
                  : state === "error"
                  ? "border-destructive/30 bg-destructive/10 text-destructive"
                  : "border-border bg-card text-muted-foreground"
              }
            `}
          >

            {state === "processing" ? (

              <LoaderCircle className="size-4 animate-spin" />

            ) : state === "complete" ? (

              <CheckCircle2 className="size-4" />

            ) : (

              <Clock3 className="size-4" />

            )}


            {state === "processing"
              ? "Analisando"
              : state === "complete"
              ? "Análise concluída"
              : state === "error"
              ? "Erro na análise"
              : "Aguardando análise"}

          </div>


          <p className="mt-2 text-[11px] text-muted-foreground">

            {totalResults.toLocaleString("pt-BR")} resultados disponíveis

          </p>

        </div>

      </div>


      {/* =====================================================
          CONTROLE DA ANÁLISE
      ===================================================== */}

      <div className="mt-8 rounded-2xl border border-border bg-card/70 p-5 md:p-6">

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">


          <div className="flex-1">

            <div className="flex items-center gap-2">

              <Database className="size-4 text-primary" />

              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
                Base da análise
              </p>

            </div>


            <p className="mt-2 text-sm text-muted-foreground">
              Escolha quantos resultados recentes serão utilizados
              na análise estatística.
            </p>

          </div>


          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">


            <Select
              value={sample}
              onValueChange={(value) =>
                setSample(value as DatasetSample)
              }
            >

              <SelectTrigger className="h-12 w-full rounded-xl border-border bg-background px-4 shadow-none sm:w-[210px]">

                <SelectValue />

              </SelectTrigger>


              <SelectContent className="rounded-xl border-border bg-popover">

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


            <Button
              variant="nexus"
              disabled={state === "processing"}
              onClick={run}
              className="h-12 rounded-xl bg-primary px-7 text-primary-foreground hover:bg-primary/90"
            >

              {state === "processing"
                ? "Processando"
                : "Executar análise"}

              {state === "processing" ? (

                <LoaderCircle className="size-4 animate-spin" />

              ) : (

                <ArrowRight className="size-4" />

              )}

            </Button>

          </div>

        </div>


        {/* BARRA DE PROCESSAMENTO */}

        {state === "processing" && (

          <div className="mt-5 h-1 overflow-hidden rounded-full bg-background">

            <div className="analysis-progress h-full bg-primary" />

          </div>

        )}


        {/* ERRO */}

        {state === "error" && (

          <p className="mt-4 text-sm text-destructive">
            Não foi possível consultar os dados da API.
          </p>

        )}

      </div>


      {/* =====================================================
          ALVOS
      ===================================================== */}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">


        {/* =====================================================
            ALVO 01
        ===================================================== */}

        <article className="rounded-2xl border border-border bg-card p-6 shadow-[0_18px_60px_rgba(0,0,0,0.16)] md:p-8">


          <div className="flex items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              <Target className="size-6 text-[#ff315f]" />

              <h2 className="font-display text-2xl font-medium text-foreground">
                Alvo 01
              </h2>

            </div>


            <span className="rounded-full border border-[#ff315f]/30 bg-[#ff315f]/10 px-3 py-1.5 text-[11px] font-medium text-[#ff5c7d]">

              Aguardando

            </span>

          </div>


          {/* HORÁRIO */}

          <div className="mt-8">

            <p className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              --:-- – --:--
            </p>

          </div>


          {/* PROBABILIDADE */}

          <div className="mt-9">

            <div className="flex items-center justify-between">

              <p className="text-sm text-muted-foreground">
                Probabilidade estimada
              </p>

              <p className="text-sm font-medium text-muted-foreground">
                —
              </p>

            </div>


            <div className="mt-3 h-2 overflow-hidden rounded-full bg-background">

              <div className="h-full w-0 rounded-full bg-primary" />

            </div>

          </div>


          {/* TÉCNICA */}

          <div className="mt-8 border-t border-border/70 pt-6">

            <p className="text-sm text-muted-foreground">
              Técnica
            </p>

            <p className="mt-2 text-base font-medium text-foreground">
              Aguardando análise
            </p>

          </div>


          {/* OBSERVAÇÃO */}

          <div className="mt-6">

            <p className="text-sm text-muted-foreground">
              Observações
            </p>

            <p className="mt-2 text-sm leading-6 text-foreground/80">
              O motor de projeção ainda não forneceu
              um alvo para esta janela.
            </p>

          </div>

        </article>


        {/* =====================================================
            ALVO 02
        ===================================================== */}

        <article className="rounded-2xl border border-border bg-card p-6 shadow-[0_18px_60px_rgba(0,0,0,0.16)] md:p-8">


          <div className="flex items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              <Target className="size-6 text-[#ff315f]" />

              <h2 className="font-display text-2xl font-medium text-foreground">
                Alvo 02
              </h2>

            </div>


            <span className="rounded-full border border-[#ff315f]/30 bg-[#ff315f]/10 px-3 py-1.5 text-[11px] font-medium text-[#ff5c7d]">

              Aguardando

            </span>

          </div>


          {/* HORÁRIO */}

          <div className="mt-8">

            <p className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              --:-- – --:--
            </p>

          </div>


          {/* PROBABILIDADE */}

          <div className="mt-9">

            <div className="flex items-center justify-between">

              <p className="text-sm text-muted-foreground">
                Probabilidade estimada
              </p>

              <p className="text-sm font-medium text-muted-foreground">
                —
              </p>

            </div>


            <div className="mt-3 h-2 overflow-hidden rounded-full bg-background">

              <div className="h-full w-0 rounded-full bg-primary" />

            </div>

          </div>


          {/* TÉCNICA */}

          <div className="mt-8 border-t border-border/70 pt-6">

            <p className="text-sm text-muted-foreground">
              Técnica
            </p>

            <p className="mt-2 text-base font-medium text-foreground">
              Aguardando análise
            </p>

          </div>


          {/* OBSERVAÇÃO */}

          <div className="mt-6">

            <p className="text-sm text-muted-foreground">
              Observações
            </p>

            <p className="mt-2 text-sm leading-6 text-foreground/80">
              O motor de projeção ainda não forneceu
              um alvo para esta janela.
            </p>

          </div>

        </article>

      </div>


      {/* =====================================================
          CONTEXTO DA ANÁLISE
      ===================================================== */}

      <section className="mt-6 rounded-2xl border border-primary/20 bg-[#07172d] p-6 md:p-8">

        <div className="flex items-start gap-4">

          <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10">

            <Database className="size-5 text-primary" />

          </div>


          <div>

            <h3 className="font-display text-xl font-semibold text-foreground">
              Contexto da Análise
            </h3>


            {aguardandoAnalise && (

              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
                Execute a análise para consultar os dados históricos.
                Os alvos serão exibidos quando o motor de projeção
                estiver integrado ao sistema.
              </p>

            )}


            {state === "complete" && output && (

              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">

                A análise estatística foi concluída utilizando{" "}

                <span className="font-medium text-foreground">
                  {output.datasetSize.toLocaleString("pt-BR")} resultados
                </span>.

                {" "}Os dados abaixo representam a distribuição real
                encontrada na amostra selecionada.

              </p>

            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          RESULTADO ESTATÍSTICO REAL
      ===================================================== */}

      {state === "complete" && output && (

        <section className="mt-8 animate-fade-in rounded-2xl border border-border bg-card p-6 md:p-8">


          <div className="flex flex-col gap-3 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                Dados reais
              </p>

              <h3 className="mt-2 font-display text-2xl font-semibold text-foreground">
                Distribuição da amostra
              </h3>

            </div>


            <p className="font-mono text-xs text-muted-foreground">
              {output.processedAt}
            </p>

          </div>


          <div className="mt-7 grid gap-4 md:grid-cols-3">


            {/* VERMELHO */}

            <div className="rounded-xl border border-border bg-background/40 p-5">

              <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Vermelho
              </p>

              <p className="mt-3 font-display text-4xl font-semibold text-foreground">
                {output.redPercentage.toLocaleString("pt-BR")}%
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                {output.redCount.toLocaleString("pt-BR")} ocorrências
              </p>

            </div>


            {/* PRETO */}

            <div className="rounded-xl border border-border bg-background/40 p-5">

              <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Preto
              </p>

              <p className="mt-3 font-display text-4xl font-semibold text-foreground">
                {output.blackPercentage.toLocaleString("pt-BR")}%
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                {output.blackCount.toLocaleString("pt-BR")} ocorrências
              </p>

            </div>


            {/* BRANCO */}

            <div className="rounded-xl border border-border bg-background/40 p-5">

              <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Branco
              </p>

              <p className="mt-3 font-display text-4xl font-semibold text-foreground">
                {output.whitePercentage.toLocaleString("pt-BR")}%
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                {output.whiteCount.toLocaleString("pt-BR")} ocorrências
              </p>

            </div>


          </div>


          <p className="mt-6 text-xs leading-6 text-muted-foreground">
            Estatísticas calculadas diretamente a partir dos
            resultados armazenados no banco de dados.
          </p>

        </section>

      )}

    </section>

  );

}