import type { ResultColor, ResultsSnapshot } from "@/types/nexus";

const API_URL = "http://127.0.0.1:8000";


export type AnalysisHistoryItem = {
  id: number;
  analysisId: number;
  target: number;
  start: string;
  end: string;
  result: "ACERTO" | "ERRO";
  whiteTimes: string;
  technique: string;
};


export type AnalysisHistoryResponse = {
  total: number;
  hits: number;
  errors: number;
  hitRate: number;
  errorRate: number;
  history: AnalysisHistoryItem[];
};


export const resultsService = {

  // =====================================================
  // SNAPSHOT GERAL
  // =====================================================

  async getSnapshot(): Promise<ResultsSnapshot> {
    const response = await fetch(`${API_URL}/snapshot`);

    if (!response.ok) {
      throw new Error("Erro ao buscar dados da API");
    }

    return response.json();
  },


  // =====================================================
  // RESULTADOS DAS RODADAS
  // =====================================================

  async getResults(limite: number = 500) {
    const response = await fetch(
      `${API_URL}/resultados?limite=${limite}`
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar histórico");
    }

    const data = await response.json();

    return data.resultados.map((item: any) => {

      let color: ResultColor;

      if (item.cor.includes("BRANCO")) {
        color = "WHITE";
      } else if (item.cor.includes("VERMELHO")) {
        color = "RED";
      } else {
        color = "BLACK";
      }

      return {
        id: item.id,
        time: item.horario,
        number: item.numero,
        color: color,
      };

    });
  },


  // =====================================================
  // HISTÓRICO DAS ANÁLISES
  // =====================================================

  async getAnalysisHistory(
    limite: number = 100
  ): Promise<AnalysisHistoryResponse> {

    const response = await fetch(
      `${API_URL}/historico-analises?limite=${limite}`
    );

    if (!response.ok) {
      throw new Error(
        "Erro ao buscar histórico das análises"
      );
    }

    const data: AnalysisHistoryResponse =
      await response.json();

    return data;
  },


  // =====================================================
  // FILTRAR RESULTADOS
  // =====================================================

  async filterResults(color: ResultColor | "ALL") {
    const snapshot = await this.getSnapshot();

    const results = snapshot.recent;

    return color === "ALL"
      ? results
      : results.filter(
          (item) => item.color === color
        );
  },

};