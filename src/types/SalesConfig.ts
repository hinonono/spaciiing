export type SalesType = "DEFAULT" | "TIME_LIMITED";

export interface SalesConfig {
  targetKey: string;
  startDate: string;
  endDate: string;
  messageKey: string;
  url: string;
  type: SalesType;
}
