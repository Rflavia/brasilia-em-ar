import type {
  DatasetSample,
  ResultItem,
} from "@/types/nexus";

import { resultsService } from "@/services/results-service";


export interface RealAnalysisOutput {
  datasetSize: number;

  redCount: number;
  blackCount: number;
  whiteCount: number;

  redPercentage: number;
  blackPercentage: number;
  whitePercentage: number;

  processedAt: string;
}


export const analysisService = {

  async run(
    sample: DatasetSample
  ): Promise<RealAnalysisOutput> {

    const limite = Number(sample);

    const resultados: ResultItem[] =
      await resultsService.getResults(limite);

    const total = resultados.length;


    const redCount = resultados.filter(
      (item) => item.color === "RED"
    ).length;

    const blackCount = resultados.filter(
      (item) => item.color === "BLACK"
    ).length;

    const whiteCount = resultados.filter(
      (item) => item.color === "WHITE"
    ).length;


    const redPercentage =
      total > 0
        ? Number(((redCount / total) * 100).toFixed(2))
        : 0;

    const blackPercentage =
      total > 0
        ? Number(((blackCount / total) * 100).toFixed(2))
        : 0;

    const whitePercentage =
      total > 0
        ? Number(((whiteCount / total) * 100).toFixed(2))
        : 0;


    return {
      datasetSize: total,

      redCount,
      blackCount,
      whiteCount,

      redPercentage,
      blackPercentage,
      whitePercentage,

      processedAt: new Date().toLocaleTimeString("pt-BR"),
    };
  },

};