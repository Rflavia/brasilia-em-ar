export type ResultColor = "RED" | "BLACK" | "WHITE";

export interface ResultItem {
  id: number;
  time: string;
  number: number;
  color: ResultColor;
}

export interface DistributionItem {
  color: ResultColor;
  percentage: number;
}

export interface WhiteOccurrence {
  time: string;
  rounds: number;
}

export interface ResultsSnapshot {
  total: number;
  since: string;
  lastUpdate: string;
  distribution: DistributionItem[];
  recent: ResultItem[];
  whiteTotal: number;
  whiteAverageInterval: number;
  whiteOccurrences: WhiteOccurrence[];
}

export type DatasetSample = "100" | "500" | "1000" | "2000" | "all";

export interface AnalysisOutput {
  id: string;
  result: ResultColor;
  confidence: number;
  datasetSize: number;
  processedAt: string;
  simulated: true;
}
