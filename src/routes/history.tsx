import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Check,
  ChevronDown,
  History,
  Target,
  X,
} from "lucide-react";

import { AppShell } from "@/components/nexus/app-shell";


export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      {
        title: "Histórico — BOOT",
      },
      {
        name: "description",
        content:
          "Acompanhe o histórico e o desempenho das análises realizadas pelo BOOT.",
      },
      {
        property: "og:title",
        content: "Histórico — BOOT",
      },
      {
        property: "og:description",
        content:
          "Acompanhe o histórico e o desempenho das análises realizadas pelo BOOT.",
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

  component: HistoryPage,
});


type StatusAnalise = "acerto" | "erro";

type AnaliseHistorica = {
  id: number;
  data: string;
  dataOriginal: string;
  alvo: string;
  resultado: StatusAnalise;
  tecnica: string;
  inicio: string;
  fim: string;
  horariosBrancos: string[];
};


type ItemHistoricoAPI = {
  id: number;
  analysisId: number;
  target: number;
  start: string;
  end: string;
  result: string;
  whiteTimes: string[];
  technique: string;
};


type HistoricoAPI = {
  total: number;
  hits: number;
  errors: number;
  hitRate: number;
  errorRate: number;
  history: ItemHistoricoAPI[];
};


const API_URL = "http://127.0.0.1:8000";


function converterData(data: string) {
  if (!data) {
    return "-";
  }

  const [parteData, parteHora] = data.split(" ");

  if (!parteData) {
    return data;
  }

  const [ano, mes, dia] = parteData.split("-");

  if (!ano || !mes || !dia) {
    return data;
  }

  const hora = parteHora
    ? parteHora.substring(0, 5)
    : "";

  return hora
    ? `${dia}/${mes}/${ano} ${hora}`
    : `${dia}/${mes}/${ano}`;
}


function HistoryPage() {

  const [periodo, setPeriodo] = useState("7");
  const [resultado, setResultado] = useState("todos");
  const [tecnica, setTecnica] = useState("todas");

  const [analises, setAnalises] =
    useState<AnaliseHistorica[]>([]);

  const [carregando, setCarregando] =
    useState(true);

  const [erroAPI, setErroAPI] =
    useState(false);


  // ============================================================
  // BUSCA HISTÓRICO NA API
  // ============================================================

  useEffect(() => {

    let ativo = true;

    async function carregarHistorico() {

      try {

        const response = await fetch(
          `${API_URL}/historico-analises`
        );

        if (!response.ok) {
          throw new Error(
            "Erro ao buscar histórico"
          );
        }

        const data: HistoricoAPI =
          await response.json();

        if (!ativo) {
          return;
        }


        const historicoConvertido: AnaliseHistorica[] =
          data.history.map((item) => {

            const resultadoConvertido: StatusAnalise =
              item.result.toUpperCase() === "ACERTO"
                ? "acerto"
                : "erro";


            return {
              id: item.id,

              data: converterData(
                item.start
              ),

              dataOriginal: item.start,

              alvo: `Alvo ${item.target}`,

              resultado:
                resultadoConvertido,

              tecnica:
                item.technique?.trim()
                  ? item.technique
                  : "Não informada",

              inicio: item.start,

              fim: item.end,

              horariosBrancos:
                item.whiteTimes ?? [],
            };

          });


        setAnalises(
          historicoConvertido
        );

        setErroAPI(false);

      } catch (erro) {

        console.error(
          "Erro ao carregar histórico:",
          erro
        );

        if (ativo) {
          setErroAPI(true);
        }

      } finally {

        if (ativo) {
          setCarregando(false);
        }

      }

    }


    carregarHistorico();


    // Atualiza automaticamente.
    const intervalo = window.setInterval(
      carregarHistorico,
      5000
    );


    return () => {

      ativo = false;

      window.clearInterval(
        intervalo
      );

    };

  }, []);


  // ============================================================
  // FILTROS
  // ============================================================

  const analisesFiltradas = useMemo(() => {

    return analises.filter((item) => {

      const filtroResultado =
        resultado === "todos" ||
        item.resultado === resultado;


      const filtroTecnica =
        tecnica === "todas" ||
        item.tecnica === tecnica;


      let filtroPeriodo = true;


      if (periodo !== "todos") {

        const dias =
          Number(periodo);

        const agora =
          new Date();

        const limite =
          new Date();

        limite.setDate(
          agora.getDate() - dias
        );


        const dataItem =
          new Date(
            item.dataOriginal.replace(
              " ",
              "T"
            )
          );


        filtroPeriodo =
          dataItem >= limite;

      }


      return (
        filtroResultado &&
        filtroTecnica &&
        filtroPeriodo
      );

    });

  }, [
    analises,
    periodo,
    resultado,
    tecnica,
  ]);


  // ============================================================
  // RESUMO
  // ============================================================

  const totalAnalises =
    analisesFiltradas.length;


  const totalAcertos =
    analisesFiltradas.filter(
      (item) =>
        item.resultado === "acerto"
    ).length;


  const totalErros =
    analisesFiltradas.filter(
      (item) =>
        item.resultado === "erro"
    ).length;


  const percentualAcertos =
    totalAnalises > 0
      ? (
          totalAcertos /
          totalAnalises
        ) * 100
      : 0;


  const percentualErros =
    totalAnalises > 0
      ? (
          totalErros /
          totalAnalises
        ) * 100
      : 0;


  // ============================================================
  // TÉCNICAS DISPONÍVEIS
  // ============================================================

  const tecnicasDisponiveis =
    useMemo(() => {

      const lista =
        analises
          .map(
            (item) =>
              item.tecnica
          )
          .filter(
            (item) =>
              item &&
              item !== "Não informada"
          );


      return Array.from(
        new Set(lista)
      );

    }, [analises]);


  return (

    <AppShell title="Histórico">

      <div className="mx-auto w-full max-w-[1720px] px-5 pb-28 pt-10 sm:px-6 md:px-8 md:pt-12 lg:px-10 lg:pt-14 xl:px-12 2xl:px-14">


        {/* =====================================================
            CABEÇALHO
        ===================================================== */}

        <section className="mb-12">

          <div className="flex items-start gap-4">

            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">

              <History
                className="size-6 text-primary"
                strokeWidth={1.8}
              />

            </div>


            <div>

              <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">

                Histórico de Análises

              </h1>


              <p className="mt-2 text-sm leading-6 text-muted-foreground md:text-base">

                Acompanhe o desempenho das análises anteriores.

              </p>

            </div>

          </div>

        </section>


        {/* =====================================================
            FILTROS
        ===================================================== */}

        <section className="mb-7 grid gap-4 md:grid-cols-3">


          {/* PERÍODO */}

          <div>

            <label className="mb-2 block text-xs font-medium text-muted-foreground">

              Período

            </label>


            <div className="relative">

              <select
                value={periodo}
                onChange={(event) =>
                  setPeriodo(
                    event.target.value
                  )
                }
                className="h-12 w-full appearance-none rounded-xl border border-border bg-card px-4 pr-10 text-sm text-foreground outline-none transition-colors hover:border-primary/40 focus:border-primary"
              >

                <option value="7">
                  Últimos 7 dias
                </option>

                <option value="15">
                  Últimos 15 dias
                </option>

                <option value="30">
                  Últimos 30 dias
                </option>

                <option value="todos">
                  Todo o período
                </option>

              </select>


              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            </div>

          </div>


          {/* RESULTADO */}

          <div>

            <label className="mb-2 block text-xs font-medium text-muted-foreground">

              Resultado

            </label>


            <div className="relative">

              <select
                value={resultado}
                onChange={(event) =>
                  setResultado(
                    event.target.value
                  )
                }
                className="h-12 w-full appearance-none rounded-xl border border-border bg-card px-4 pr-10 text-sm text-foreground outline-none transition-colors hover:border-primary/40 focus:border-primary"
              >

                <option value="todos">
                  Todos
                </option>

                <option value="acerto">
                  Acertos
                </option>

                <option value="erro">
                  Erros
                </option>

              </select>


              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            </div>

          </div>


          {/* TÉCNICA */}

          <div>

            <label className="mb-2 block text-xs font-medium text-muted-foreground">

              Técnica

            </label>


            <div className="relative">

              <select
                value={tecnica}
                onChange={(event) =>
                  setTecnica(
                    event.target.value
                  )
                }
                className="h-12 w-full appearance-none rounded-xl border border-border bg-card px-4 pr-10 text-sm text-foreground outline-none transition-colors hover:border-primary/40 focus:border-primary"
              >

                <option value="todas">
                  Todas
                </option>


                {tecnicasDisponiveis.map(
                  (item) => (

                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>

                  )
                )}

              </select>


              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            </div>

          </div>

        </section>


        {/* =====================================================
            TABELA
        ===================================================== */}

        <section className="overflow-hidden rounded-2xl border border-border bg-card">


          {/* CABEÇALHO DA TABELA */}

          <div className="hidden grid-cols-[.7fr_1fr_1fr_1.4fr] border-b border-border bg-secondary/40 px-6 py-4 text-xs font-medium text-muted-foreground md:grid">

            <span>Data</span>

            <span>Alvo</span>

            <span>Resultado</span>

            <span>Técnica</span>

          </div>


          {/* CARREGANDO */}

          {carregando ? (

            <div className="flex min-h-[270px] items-center justify-center px-6 text-center">

              <p className="text-sm text-muted-foreground">

                Carregando histórico...

              </p>

            </div>


          ) : erroAPI ? (

            <div className="flex min-h-[270px] items-center justify-center px-6 text-center">

              <p className="text-sm text-destructive">

                Não foi possível carregar o histórico da API.

              </p>

            </div>


          ) : analisesFiltradas.length > 0 ? (

            <div>

              {analisesFiltradas.map(
                (item) => (

                  <div
                    key={item.id}
                    className="grid gap-4 border-b border-border/70 px-6 py-5 last:border-b-0 md:grid-cols-[.7fr_1fr_1fr_1.4fr] md:items-center"
                  >


                    {/* DATA */}

                    <div>

                      <span className="mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground md:hidden">

                        Data

                      </span>

                      <span className="font-mono text-sm text-foreground">

                        {item.data}

                      </span>

                    </div>


                    {/* ALVO */}

                    <div>

                      <span className="mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground md:hidden">

                        Alvo

                      </span>

                      <span className="font-medium text-foreground">

                        {item.alvo}

                      </span>

                    </div>


                    {/* RESULTADO */}

                    <div>

                      <span className="mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground md:hidden">

                        Resultado

                      </span>


                      {item.resultado ===
                      "acerto" ? (

                        <span className="inline-flex items-center gap-2 font-medium text-live">

                          <span className="flex size-5 items-center justify-center rounded-md bg-live/15">

                            <Check className="size-3.5" />

                          </span>

                          Acertou

                        </span>

                      ) : (

                        <span className="inline-flex items-center gap-2 font-medium text-destructive">

                          <span className="flex size-5 items-center justify-center rounded-md bg-destructive/15">

                            <X className="size-3.5" />

                          </span>

                          Não caiu

                        </span>

                      )}

                    </div>


                    {/* TÉCNICA */}

                    <div>

                      <span className="mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground md:hidden">

                        Técnica

                      </span>

                      <span className="text-sm text-foreground">

                        {item.tecnica}

                      </span>

                    </div>


                  </div>

                )
              )}

            </div>

          ) : (

            <div className="flex min-h-[270px] flex-col items-center justify-center px-6 text-center">

              <div className="flex size-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">

                <Target
                  className="size-6 text-primary"
                  strokeWidth={1.7}
                />

              </div>


              <p className="mt-5 text-base font-semibold text-foreground">

                Nenhuma análise encontrada

              </p>


              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">

                Não existem análises para os filtros selecionados.

              </p>

            </div>

          )}

        </section>


        {/* =====================================================
            CARDS DE RESUMO
        ===================================================== */}

        <section className="mt-6 grid gap-4 md:grid-cols-3">


          {/* TOTAL */}

          <div className="rounded-2xl border border-border bg-card p-6">

            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">

              Total de análises

            </p>


            <p className="mt-3 font-display text-4xl font-semibold text-foreground">

              {totalAnalises}

            </p>

          </div>


          {/* ACERTOS */}

          <div className="rounded-2xl border border-border bg-card p-6">

            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">

              Acertos

            </p>


            <div className="mt-3 flex items-end gap-3">

              <p className="font-display text-4xl font-semibold text-live">

                {totalAcertos}

              </p>


              <p className="pb-1 text-sm font-medium text-live">

                ({percentualAcertos.toFixed(1)}%)

              </p>

            </div>

          </div>


          {/* ERROS */}

          <div className="rounded-2xl border border-border bg-card p-6">

            <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">

              Erros

            </p>


            <div className="mt-3 flex items-end gap-3">

              <p className="font-display text-4xl font-semibold text-destructive">

                {totalErros}

              </p>


              <p className="pb-1 text-sm font-medium text-destructive">

                ({percentualErros.toFixed(1)}%)

              </p>

            </div>

          </div>

        </section>


        {/* =====================================================
            OBSERVAÇÃO
        ===================================================== */}

        <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/[0.04] px-6 py-5">

          <p className="text-sm leading-6 text-muted-foreground">

            O histórico é atualizado automaticamente conforme
            novas análises forem avaliadas pelo sistema.

          </p>

        </div>


      </div>

    </AppShell>

  );

}