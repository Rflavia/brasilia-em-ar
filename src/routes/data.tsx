import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Radio } from "lucide-react";

import { AppShell } from "@/components/nexus/app-shell";

import { resultsService } from "@/services/results-service";

import type {
  ResultColor,
  ResultsSnapshot,
} from "@/types/nexus";


export const Route = createFileRoute("/data")({
  head: () => ({
    meta: [
      {
        title: "Resultados — BOOT",
      },
      {
        name: "description",
        content: "Resultados coletados em tempo real.",
      },
      {
        property: "og:title",
        content: "Resultados — BOOT",
      },
      {
        property: "og:description",
        content: "Resultados coletados em tempo real.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
  }),

  component: DataPage,
});


type Resultado = {
  id: number;
  time: string;
  number: number;
  color: ResultColor;
};


function DataPage() {

  const [data, setData] =
    useState<ResultsSnapshot | null>(null);

  const [resultados, setResultados] =
    useState<Resultado[]>([]);


  useEffect(() => {

    let ativo = true;


    async function carregarDados() {

      try {

        const [
          snapshot,
          historico,
        ] = await Promise.all([
          resultsService.getSnapshot(),
          resultsService.getResults(500),
        ]);


        if (!ativo) {
          return;
        }


        setData(snapshot);

        setResultados(
          historico as Resultado[]
        );


      } catch (erro) {

        console.error(
          "Erro ao carregar resultados:",
          erro
        );

      }

    }


    carregarDados();


    const intervalo = setInterval(
      carregarDados,
      5000
    );


    return () => {

      ativo = false;

      clearInterval(intervalo);

    };

  }, []);


  const recentes = useMemo(() => {

    return resultados.slice(0, 10);

  }, [resultados]);


  const ultimos20 = useMemo(() => {

    return resultados.slice(0, 20);

  }, [resultados]);


  const distribuicao = useMemo(() => {

    const total = resultados.length;

    const vermelho = resultados.filter(
      (item) => item.color === "RED"
    ).length;

    const preto = resultados.filter(
      (item) => item.color === "BLACK"
    ).length;

    const branco = resultados.filter(
      (item) => item.color === "WHITE"
    ).length;


    function percentual(valor: number) {

      if (total === 0) {
        return 0;
      }

      return (valor / total) * 100;

    }


    return {
      total,
      vermelho,
      preto,
      branco,
      percentualVermelho:
        percentual(vermelho),
      percentualPreto:
        percentual(preto),
      percentualBranco:
        percentual(branco),
    };

  }, [resultados]);


  if (!data) {

    return (

      <AppShell title="Resultados">

        <div className="flex min-h-[500px] items-center justify-center">

          <p className="text-sm text-muted-foreground">
            Carregando resultados...
          </p>

        </div>

      </AppShell>

    );

  }


  return (

    <AppShell
      title="Resultados"
      lastUpdate={data.lastUpdate}
    >

    <div className="mx-auto w-full px-5 pb-24 pt-10 sm:px-6 md:px-8 md:pt-12 lg:px-10 lg:pt-14 xl:px-12 2xl:px-14">

        {/* CABEÇALHO */}

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

          <div className="flex items-center gap-4">

            <div className="flex size-11 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">

              <Radio className="size-5 text-red-500" />

            </div>


            <div>

              <h1 className="font-display text-3xl font-semibold">
                Resultados ao Vivo
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Últimas rodadas coletadas em tempo real.
              </p>

            </div>

          </div>


          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-xs">

            <span className="relative flex size-2">

              <span className="absolute inline-flex size-full animate-ping rounded-full bg-live opacity-50" />

              <span className="relative inline-flex size-2 rounded-full bg-live" />

            </span>

            <span className="text-live">
              Atualizando em tempo real
            </span>

          </div>

        </div>


        {/* ÚLTIMAS RODADAS */}

        <div className="mt-10 rounded-2xl border border-border bg-card p-5">

          <div className="grid grid-cols-5 gap-3 sm:grid-cols-10">

            {recentes.map((item) => (

              <ResultadoCard
                key={item.id}
                resultado={item}
              />

            ))}

          </div>

        </div>


        {/* PARTE INFERIOR */}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">


          {/* DISTRIBUIÇÃO DAS CORES */}

          <div className="rounded-2xl border border-border bg-card p-6">

            <h2 className="font-display text-lg font-semibold">
              Distribuição das Cores
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Últimos {distribuicao.total} resultados carregados
            </p>


            <div className="mt-8 flex flex-col items-center gap-10 sm:flex-row sm:justify-center">


              {/* GRÁFICO DE ROSCA */}

              <GraficoRosca
                total={distribuicao.total}
                vermelho={distribuicao.percentualVermelho}
                preto={distribuicao.percentualPreto}
                branco={distribuicao.percentualBranco}
              />


              {/* LEGENDA */}

              <div className="w-full max-w-[260px] space-y-5">

                <LegendaCor
                  nome="Vermelho"
                  quantidade={distribuicao.vermelho}
                  percentual={distribuicao.percentualVermelho}
                  cor="RED"
                />

                <LegendaCor
                  nome="Preto"
                  quantidade={distribuicao.preto}
                  percentual={distribuicao.percentualPreto}
                  cor="BLACK"
                />

                <LegendaCor
                  nome="Branco"
                  quantidade={distribuicao.branco}
                  percentual={distribuicao.percentualBranco}
                  cor="WHITE"
                />

              </div>

            </div>


            <div className="mt-8 border-t border-border pt-5">

              <div className="flex items-center justify-between text-xs">

                <span className="text-muted-foreground">
                  Banco completo
                </span>

                <span className="font-mono">
                  {data.total.toLocaleString("pt-BR")} resultados
                </span>

              </div>

            </div>

          </div>


          {/* ÚLTIMOS 20 */}

          <div className="rounded-2xl border border-border bg-card p-6">

            <h2 className="font-display text-lg font-semibold">
              Últimos 20 resultados
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Sequência mais recente registrada pelo sistema
            </p>


            <div className="mt-8 grid grid-cols-5 gap-4 sm:grid-cols-10">

              {ultimos20.map((item) => (

                <ResultadoBolinha
                  key={item.id}
                  resultado={item}
                />

              ))}

            </div>


            <div className="mt-8 border-t border-border pt-5">

              <div className="flex items-center justify-between text-xs">

                <span className="text-muted-foreground">
                  Última atualização
                </span>

                <span className="font-mono">
                  {formatarDataHora(data.lastUpdate)}
                </span>

              </div>

            </div>

          </div>


        </div>

      </div>

    </AppShell>

  );

}


/* =========================================================
   GRÁFICO DE ROSCA
========================================================= */

function GraficoRosca({
  total,
  vermelho,
  preto,
  branco,
}: {
  total: number;
  vermelho: number;
  preto: number;
  branco: number;
}) {

  const tamanho = 190;
  const centro = tamanho / 2;
  const raio = 70;

  const circunferencia =
    2 * Math.PI * raio;


  const tamanhoVermelho =
    (vermelho / 100) * circunferencia;

  const tamanhoPreto =
    (preto / 100) * circunferencia;

  const tamanhoBranco =
    (branco / 100) * circunferencia;


  const inicioVermelho = 0;

  const inicioPreto =
    tamanhoVermelho;

  const inicioBranco =
    tamanhoVermelho +
    tamanhoPreto;


  return (

    <div className="relative flex size-[190px] shrink-0 items-center justify-center">

      <svg
        width={tamanho}
        height={tamanho}
        viewBox={`0 0 ${tamanho} ${tamanho}`}
        className="-rotate-90"
      >

        {/* FUNDO */}

        <circle
          cx={centro}
          cy={centro}
          r={raio}
          fill="none"
          stroke="currentColor"
          strokeWidth="22"
          className="text-secondary"
        />


        {/* VERMELHO */}

        {tamanhoVermelho > 0 && (

          <circle
            cx={centro}
            cy={centro}
            r={raio}
            fill="none"
            stroke="#ff2d3d"
            strokeWidth="22"
            strokeDasharray={
              `${tamanhoVermelho} ${circunferencia - tamanhoVermelho}`
            }
            strokeDashoffset={
              -inicioVermelho
            }
          />

        )}


        {/* PRETO */}

        {tamanhoPreto > 0 && (

          <circle
            cx={centro}
            cy={centro}
            r={raio}
            fill="none"
            stroke="#050505"
            strokeWidth="22"
            strokeDasharray={
              `${tamanhoPreto} ${circunferencia - tamanhoPreto}`
            }
            strokeDashoffset={
              -inicioPreto
            }
          />

        )}


        {/* BRANCO */}

        {tamanhoBranco > 0 && (

          <circle
            cx={centro}
            cy={centro}
            r={raio}
            fill="none"
            stroke="#ffffff"
            strokeWidth="22"
            strokeDasharray={
              `${tamanhoBranco} ${circunferencia - tamanhoBranco}`
            }
            strokeDashoffset={
              -inicioBranco
            }
          />

        )}

      </svg>


      {/* TOTAL NO CENTRO */}

      <div className="absolute inset-0 flex flex-col items-center justify-center">

        <span className="font-display text-3xl font-semibold tabular-nums">
          {total}
        </span>

        <span className="mt-1 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          rodadas
        </span>

      </div>

    </div>

  );

}


/* =========================================================
   LEGENDA DO GRÁFICO
========================================================= */

function LegendaCor({
  nome,
  quantidade,
  percentual,
  cor,
}: {
  nome: string;
  quantidade: number;
  percentual: number;
  cor: ResultColor;
}) {

  return (

    <div className="flex items-center justify-between gap-8">

      <div className="flex items-center gap-3">

        <span
          className={`
            size-3
            shrink-0
            rounded-full
            ${classeBolinha(cor)}
          `}
        />

        <span className="text-sm">
          {nome}
        </span>

      </div>


      <div className="flex items-center gap-4 font-mono text-xs">

        <span className="text-muted-foreground">
          {quantidade}
        </span>

        <span className="w-14 text-right">
          {percentual.toFixed(1)}%
        </span>

      </div>

    </div>

  );

}


/* =========================================================
   CARDS SUPERIORES
========================================================= */

function ResultadoCard({
  resultado,
}: {
  resultado: Resultado;
}) {

  return (

    <div className="text-center">

      <div
        className={`
          flex
          aspect-square
          items-center
          justify-center
          rounded-xl
          border
          font-display
          text-xl
          font-semibold
          ${classeResultado(resultado.color)}
        `}
      >

        {resultado.number}

      </div>


      <p className="mt-2 font-mono text-[10px] text-muted-foreground">

        {formatarHorario(resultado.time)}

      </p>

    </div>

  );

}


/* =========================================================
   BOLINHAS DOS ÚLTIMOS 20
========================================================= */

function ResultadoBolinha({
  resultado,
}: {
  resultado: Resultado;
}) {

  return (

    <div
      title={`${resultado.number} — ${formatarHorario(
        resultado.time
      )}`}
      className={`
        flex
        aspect-square
        items-center
        justify-center
        rounded-full
        border
        text-xs
        font-semibold
        ${classeResultado(resultado.color)}
      `}
    >

      {resultado.number}

    </div>

  );

}


/* =========================================================
   CORES
========================================================= */

function classeResultado(
  cor: ResultColor
) {

  if (cor === "RED") {

    return "border-red-500/30 bg-red-500 text-white";

  }

  if (cor === "WHITE") {

    return "border-white/50 bg-white text-black";

  }

  return "border-white/10 bg-black text-white";

}


function classeBolinha(
  cor: ResultColor
) {

  if (cor === "RED") {
    return "bg-red-500";
  }

  if (cor === "WHITE") {
    return "border border-border bg-white";
  }

  return "border-2 border-slate-300 bg-black shadow-[0_0_0_1px_rgba(255,255,255,0.12)]";

}


/* =========================================================
   FORMATAÇÃO DE HORÁRIO
========================================================= */

function formatarHorario(
  horario: string
) {

  if (!horario) {
    return "--:--";
  }


  const encontrado =
    horario.match(
      /(\d{2}):(\d{2})(?::\d{2})?/
    );


  if (encontrado) {

    return `${encontrado[1]}:${encontrado[2]}`;

  }


  return horario;

}


function formatarDataHora(
  horario: string
) {

  if (!horario) {
    return "—";
  }


  const encontrado =
    horario.match(
      /(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/
    );


  if (!encontrado) {
    return horario;
  }


  return (
    `${encontrado[3]}/` +
    `${encontrado[2]}/` +
    `${encontrado[1]} ` +
    `${encontrado[4]}:` +
    `${encontrado[5]}:` +
    `${encontrado[6]}`
  );

}