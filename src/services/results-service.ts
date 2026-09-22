import { MOCK_SNAPSHOT } from "@/mocks/nexus-data";
import type { ResultColor, ResultsSnapshot } from "@/types/nexus";

export const resultsService = {
  getSnapshot(): ResultsSnapshot {
    return structuredClone(MOCK_SNAPSHOT);
  },
  filterResults(color: ResultColor | "ALL") {
    const results = this.getSnapshot().recent;
    return color === "ALL" ? results : results.filter((item) => item.color === color);
  },
};
