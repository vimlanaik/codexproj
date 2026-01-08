const form = document.getElementById("rate-form");
const statusEl = document.getElementById("status");
const resultsEl = document.getElementById("results");
const baseEl = document.getElementById("result-base");
const timeEl = document.getElementById("result-time");
const bodyEl = document.getElementById("result-body");

const formatIso = (value) => value.trim().toUpperCase();

const renderRates = (base, timestamp, rates) => {
  baseEl.textContent = `Base: ${base}`;
  const date = new Date(timestamp * 1000);
  timeEl.textContent = `Updated: ${date.toLocaleString()}`;

  bodyEl.innerHTML = "";
  Object.entries(rates).forEach(([code, rate]) => {
    const row = document.createElement("tr");
    const currencyCell = document.createElement("td");
    currencyCell.textContent = code;
    const rateCell = document.createElement("td");
    rateCell.textContent = rate.toFixed(4);
    row.append(currencyCell, rateCell);
    bodyEl.appendChild(row);
  });
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusEl.textContent = "";
  resultsEl.hidden = true;

  const base = formatIso(form.base.value || "USD");
  const symbols = (form.symbols.value || "")
    .split(",")
    .map(formatIso)
    .filter(Boolean);

  if (!base || symbols.length === 0) {
    statusEl.textContent = "Enter a base and at least one target currency.";
    return;
  }

  try {
    statusEl.textContent = "Loading latest rates...";
    const query = new URLSearchParams({
      base,
      symbols: symbols.join(","),
    });
    const response = await fetch(`https://api.exchangerate.host/latest?${query}`);
    if (!response.ok) {
      throw new Error("Unable to fetch rates.");
    }
    const data = await response.json();
    if (!data?.rates) {
      throw new Error("Invalid response from rate provider.");
    }

    renderRates(base, data.timestamp, data.rates);
    statusEl.textContent = "";
    resultsEl.hidden = false;
  } catch (error) {
    statusEl.textContent = error.message || "Something went wrong.";
  }
});
