export type SalesType = "ALL" | "SPECIFIC_KEY";

export interface SalesConfig {
  type: SalesType;
  targetKey: string;
  startDate: string;
  endDate: string;
  messageKey: string;
  url: string;
  showCountdown: boolean;
}
