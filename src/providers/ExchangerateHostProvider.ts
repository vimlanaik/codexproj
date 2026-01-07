import fetch from "node-fetch";
import { RateProvider } from "./RateProvider";
import { RatesMap } from "../types";

/**
 * Default provider using exchangerate.host (free, no API key required).
 * Example request: https://api.exchangerate.host/latest?base=USD
 */
export class ExchangerateHostProvider implements RateProvider {
  private endpoint = "https://api.exchangerate.host/latest";

  constructor(private options?: { endpoint?: string }) {
    if (options?.endpoint) this.endpoint = options.endpoint;
  }

  async fetchRates(base: string): Promise<{ rates: RatesMap; timestamp?: string | number }> {
    const url = `${this.endpoint}?base=${encodeURIComponent(base)}`;
    const res = await fetch(url, { timeout: 10_000 });
    if (!res.ok) {
      throw new Error(`Rate provider responded with ${res.status}: ${res.statusText}`);
    }
    const body = await res.json();
    return { rates: body.rates ?? {}, timestamp: body.date ?? body.timestamp ?? Date.now() };
  }
}
