import type { ResultsSnapshot } from "@/types/nexus";

export const MOCK_SNAPSHOT: ResultsSnapshot = {
  total: 2008,
  since: "18 set. 2026",
  lastUpdate: "13:42:31",
  distribution: [
    { color: "RED", percentage: 50 },
    { color: "BLACK", percentage: 48.65 },
    { color: "WHITE", percentage: 1.35 },
  ],
  recent: [
    { id: 1, time: "13:41:32", number: 7, color: "RED" },
    { id: 2, time: "13:41:02", number: 11, color: "BLACK" },
    { id: 3, time: "13:40:32", number: 0, color: "WHITE" },
    { id: 4, time: "13:40:02", number: 4, color: "RED" },
    { id: 5, time: "13:39:32", number: 9, color: "BLACK" },
    { id: 6, time: "13:39:02", number: 6, color: "RED" },
    { id: 7, time: "13:38:32", number: 12, color: "BLACK" },
    { id: 8, time: "13:38:02", number: 2, color: "RED" },
    { id: 9, time: "13:37:32", number: 8, color: "BLACK" },
    { id: 10, time: "13:37:02", number: 0, color: "WHITE" },
    { id: 11, time: "13:36:32", number: 3, color: "RED" },
    { id: 12, time: "13:36:02", number: 10, color: "BLACK" },
    { id: 13, time: "13:35:32", number: 5, color: "RED" },
  ],
  whiteTotal: 27,
  whiteToday: 0,
  whiteAverageInterval: 30.2,
  whiteOccurrences: [
    { time: "13:21:02", rounds: 31 },
    { time: "12:58:31", rounds: 27 },
    { time: "12:36:01", rounds: 34 },
    { time: "12:07:32", rounds: 29 },
  ],
};
