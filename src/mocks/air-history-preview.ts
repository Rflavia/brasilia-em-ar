/** Séries fictícias para a prévia. Não são observações nem previsões. */
export type AirPoint = { label: string; value: number };
export type AirPeriod = "today" | "week" | "month";

const dailyValues = [5.2, 4.8, 5.1, 4.6, 4.2, 4.5, 4.1, 4.7, 5.3, 5.0, 4.8, 5.7, 6.3, 6.0, 6.4];
const monthlyValues = [
  7.4, 8.1, 7.8, 6.9, 6.2, 5.8, 6.3, 7.1, 8.4, 9.2, 8.6, 7.5, 6.8, 6.1, 5.5, 5.9, 6.7, 7.3, 7.9,
  8.2, 7.6, 6.8, 6.0, 5.6, 6.1, 7.0, 6.6, 5.8, 6.2, 5.7,
];
const days = (values: number[], start: number): AirPoint[] =>
  values.map((value, i) => ({ label: `${String(start + i).padStart(2, "0")}/09`, value }));

export const AIR_HISTORY_PREVIEW: Record<
  AirPeriod,
  { label: string; description: string; points: AirPoint[] }
> = {
  today: {
    label: "Hoje",
    description: "Leituras por hora · até 14h · cenário ilustrativo",
    points: dailyValues.map((value, hour) => ({
      label: `${String(hour).padStart(2, "0")}h`,
      value,
    })),
  },
  week: {
    label: "7 dias",
    description: "Médias diárias · 24 a 30/09 · cenário ilustrativo",
    points: days(monthlyValues.slice(-7), 24),
  },
  month: {
    label: "30 dias",
    description: "Médias diárias · 01 a 30/09 · cenário ilustrativo",
    points: days(monthlyValues, 1),
  },
};
