import type { AnalysisOutput, DatasetSample } from "@/types/nexus";

const sizes: Record<DatasetSample, number> = { "100": 100, "500": 500, "1000": 1000, "2000": 2000, all: 2008 };

export const analysisService = {
  async run(sample: DatasetSample): Promise<AnalysisOutput> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      id: "001",
      result: "WHITE",
      confidence: 72,
      datasetSize: sizes[sample],
      processedAt: "13:43:02",
      simulated: true,
    };
  },
};
