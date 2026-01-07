import { RateProvider } from "./providers/RateProvider";
import { ExchangerateHostProvider } from "./providers/ExchangerateHostProvider";
import { RatesResult, CurrencyResult } from "./types";

export interface ForexUpdaterOptions {
  baseCurrency?: string;
  fixedBaseCurrencies?: string[];
  exceptions?: Record<string, number>;
  provider?: RateProvider;
}

export class ForexUpdater {
  private baseCurrency: string;
  private fixedBaseSet: Set<string>;
  private exceptions: Map<string, number>;
  private provider: RateProvider;

  constructor(options?: ForexUpdaterOptions) {
    this.baseCurrency = (options?.baseCurrency ?? "USD").toUpperCase();
    this.fixedBaseSet = new Set((options?.fixedBaseCurrencies ?? []).map((c) => c.toUpperCase()));
    this.exceptions = new Map<string, number>();
    if (options?.exceptions) {
      for (const [k, v] of Object.entries(options.exceptions)) {
        this.exceptions.set(k.toUpperCase(), v);
      }
    }
    this.provider = options?.provider ?? new ExchangerateHostProvider();
    this.fixedBaseSet.add(this.baseCurrency);
  }

  addFixedCurrency(code: string) {
    this.fixedBaseSet.add(code.toUpperCase());
  }

  removeFixedCurrency(code: string) {
    this.fixedBaseSet.delete(code.toUpperCase());
  }

  setException(code: string, fixedRate: number) {
    this.exceptions.set(code.toUpperCase(), fixedRate);
  }

  removeException(code: string) {
    this.exceptions.delete(code.toUpperCase());
  }

  async updateRates(currencies?: string[]): Promise<RatesResult> {
    const resp = await this.provider.fetchRates(this.baseCurrency);
    const raw = resp.rates || {};
    const timestamp = resp.timestamp;
    const requested = currencies?.map((c) => c.toUpperCase()) ?? Object.keys(raw).map((c) => c.toUpperCase());
    if (!requested.includes(this.baseCurrency)) requested.unshift(this.baseCurrency);

    const ratesMap: Record<string, CurrencyResult> = {};

    for (const code of requested) {
      const fetchedRate = raw[code] ?? null;
      let useRate: number | null = null;
      let fixed = false;
      let fixedTo: number | null = null;

      if (this.exceptions.has(code)) {
        fixed = true;
        fixedTo = this.exceptions.get(code)!;
        useRate = fixedTo;
      } else if (this.fixedBaseSet.has(code)) {
        fixed = true;
        fixedTo = 1;
        useRate = 1;
      } else if (fetchedRate !== null) {
        useRate = fetchedRate;
      } else {
        useRate = null;
      }

      ratesMap[code] = {
        currency: code,
        rate: fetchedRate,
        useRate,
        fixed,
        fixedTo,
      };
    }

    return {
      base: this.baseCurrency,
      timestamp,
      rates: ratesMap,
    };
  }
}
