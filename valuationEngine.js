// valuationEngine.js – core math separated from UI / DOM
// This keeps all calculations pure so we can test them and re‑use
// them both for on‑screen charts and for the PDF generator.

/**
 * @typedef {Object} ValuationMethod
 * @property {string} method               Human friendly name.
 * @property {number} value                Valuation dollars.
 */

/**
 * @typedef {Object} ValuationResult
 * @property {ValuationMethod[]} valuations All individual method outputs.
 * @property {number} avg                   Mean of all selected methods.
 * @property {number} rangeLow              −10 % band.
 * @property {number} rangeHigh             +10 % band.
 * @property {number} confidence            0‑100 confidence score.
 * @property {Object[]} sensitivity         Tornado‑chart dataset (label/value pairs).
 */

/**
 * Main façade – pass the raw form numbers; get everything back.
 * No DOM access, no Chart.js, no jsPDF calls.
 *
 * @param {Object} i – raw inputs straight from your form parser
 * @returns {ValuationResult}
 */
export function calculateValuation (i) {
  // 1. Shared multipliers & helpers
  let multiplier = 5;
  if (i.growthYoy > 20) multiplier += 2;
  if (i.customerChurn < 5) multiplier += 1;
  if (i.retentionRate > 80) multiplier += 1;
  if (i.nps > 50)        multiplier += 0.5;
  if (i.legalIssues !== 'none') multiplier -= 1;
  if (i.ipOwnership === 'fully-owned') multiplier += 0.5;

  /** @type {ValuationMethod[]} */
  const valuations = [];

  // 2. Revenue Multiplier
  if (i.methods.includes('multiplier')) {
    valuations.push({ method: 'Revenue Multiplier', value: i.arr * multiplier });
  }

  // 3. Income‑Based
  if (i.methods.includes('income')) {
    valuations.push({ method: 'Income‑Based', value: i.netProfit * (multiplier - 1) });
  }

  // 4. Earnings‑Based
  if (i.methods.includes('earnings')) {
    const hybrid = (i.arr * 0.6 + i.netProfit * 0.4) * multiplier;
    valuations.push({ method: 'Earnings‑Based', value: hybrid });
  }

  // 5. DCF (very simplifed – improve later!)
  if (i.methods.includes('dcf')) {
    const cashFlow = i.netProfit * 1.2;
    valuations.push({ method: 'DCF', value: cashFlow / 0.1 });
  }

  // 6. Aggregate
  const avg = mean(valuations.map(v => v.value));
  const rangeLow  = avg * 0.9;
  const rangeHigh = avg * 1.1;
  const confidence = Math.min(95, 60 + i.methods.length * 10 + (i.growthYoy > 20 ? 10 : 0) + (i.customerChurn < 5 ? 10 : 0));

  // 7. Sensitivity matrix (Δ in valuation if a driver moves ±10 %)
  const sensitivity = buildSensitivity(i, multiplier);

  return { valuations, avg, rangeLow, rangeHigh, confidence, sensitivity };
}

// ---------- helpers -----------
function mean (arr) { return arr.reduce((s, n) => s + n, 0) / arr.length; }

function buildSensitivity (i, baseMult) {
  const drivers = [
    { key: 'ARR',          delta: val => val.arr * 0.1 * baseMult },
    { key: 'Growth YoY',   delta: ()  => (i.arr * 0.1) }, // simplistic
    { key: 'Cust Churn',   delta: ()  => -(i.arr * 0.08) },
    { key: 'LTV/CAC',      delta: ()  => (i.ltv - i.cac) * 0.5 },
    { key: 'Gross Margin', delta: ()  => (i.grossMargin > 70 ? 0 : i.arr * 0.05) }
  ];
  return drivers.map(d => ({ label: d.key, value: Math.round(d.delta(i)) }));
}

// Default export for convenience
export default calculateValuation;
