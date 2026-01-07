import { ForexUpdater } from "./index";

async function example() {
  const updater = new ForexUpdater({
    baseCurrency: "USD",
    fixedBaseCurrencies: ["EUR"],
    exceptions: { "JPY": 130 }
  });

  const result = await updater.updateRates(["USD", "EUR", "GBP", "JPY", "INR"]);
  console.log(JSON.stringify(result, null, 2));
}

example().catch(console.error);
