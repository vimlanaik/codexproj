# forex-updater

Small TypeScript library to fetch and produce forex rates JSON while allowing:
- fixed base currencies (treated as rate 1)
- exceptions for specific currencies (fixed to a provided rate)
- pluggable rate provider (default: exchangerate.host)

## Installation

npm install
npm run build

## Example usage

```ts
import { ForexUpdater } from "./dist/index.js";

async function run() {
  const updater = new ForexUpdater({
    baseCurrency: "USD",
    fixedBaseCurrencies: ["USD", "EUR"],
    exceptions: { "JPY": 110 }
  });

  const result = await updater.updateRates();
  console.log(JSON.stringify(result, null, 2));
}

run().catch(console.error);
```

## Output format (per currency)

Each currency in `result.rates` has the structure:

```json
{
  "currency": "EUR",
  "rate": 0.92,
  "useRate": 1.0,
  "fixed": true,
  "fixedTo": 1.0
}
```
