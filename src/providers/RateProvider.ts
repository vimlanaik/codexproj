import { RatesMap } from "../types";

export interface RateProvider {
  /**
   * Fetch latest rates for the requested base currency.
   * Should return a map where keys are currency codes and values are rates compared to base.
   */
  fetchRates(base: string): Promise<{ rates: RatesMap; timestamp?: string | number }>;
}
