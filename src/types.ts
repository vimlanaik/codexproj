export type RatesMap = Record<string, number>;

export interface CurrencyResult {
  currency: string;
  rate: number | null;
  useRate: number | null;
  fixed: boolean;
  fixedTo: number | null;
}

export interface RatesResult {
  base: string;
  timestamp?: string | number;
  rates: Record<string, CurrencyResult>;
}
