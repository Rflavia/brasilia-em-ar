import type { ResultColor, ResultsSnapshot } from "@/types/nexus";

const API_URL = "http://127.0.0.1:8000";

export const resultsService = {

  async getSnapshot(): Promise<ResultsSnapshot> {
    const response = await fetch(`${API_URL}/snapshot`);

    if (!response.ok) {
      throw new Error("Erro ao buscar dados da API");
    }

    return response.json();
  },


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


  async filterResults(color: ResultColor | "ALL") {
    const snapshot = await this.getSnapshot();
    const results = snapshot.recent;

    return color === "ALL"
      ? results
      : results.filter((item) => item.color === color);
  },

};