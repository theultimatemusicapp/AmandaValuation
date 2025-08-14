import { describe, test, expect, beforeEach, jest } from '@jest/globals';

let shouldThrow = false;
class ChartMock {
  constructor() {
    if (shouldThrow) throw new Error('fail');
  }
  static register() {}
}
const setupPDF = jest.fn();

jest.unstable_mockModule('../scripts/vendor/chart.js', () => ({
  Chart: ChartMock,
  registerables: []
}));

const { calculateValuation } = await import('../scripts/valuation.js');

describe('calculateValuation', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <input type="checkbox" value="multiplier" checked />
      <input id="arr" value="1000000" />
      <input id="net-profit" value="200000" />
      <input id="revenue-growth-yoy" value="30" />
      <input id="customer-churn" value="4" />
      <input id="retention-rate" value="85" />
      <input id="nps" value="60" />
      <select id="legal-issues"><option value="none" selected>None</option></select>
      <select id="ip-ownership"><option value="fully-owned" selected>Owned</option></select>
      <input id="mrr" value="90000" />
      <input id="ltv" value="5000" />
      <input id="cac" value="1000" />
      <input id="gross-margin" value="80" />
      <input id="burn-rate" value="50000" />
      <input id="runway" value="18" />
      <input id="active-customers" value="2000" />
      <input id="monthly-active-users" value="5000" />
      <input id="debt-level" value="50000" />
      <input id="custom-multiplier" value="" />
      <input id="discount-rate" value="" />
      <input id="revenue-growth-mom" value="5" />
      <input id="revenue-churn" value="3" />
      <select id="data-privacy"><option value="full" selected>Full</option></select>
      <div id="valuation-warnings" class="hidden"></div>
      <div id="valuation-amount"></div>
      <div id="valuation-range"></div>
      <div id="confidence-score"></div>
      <canvas id="valuation-chart"></canvas>
      <canvas id="financial-chart"></canvas>
      <canvas id="growth-churn-chart"></canvas>
      <canvas id="risk-chart"></canvas>
      <button id="download-report"></button>
    `;
    setupPDF.mockClear();
  });

  test('computes valuation and updates DOM', async () => {
    shouldThrow = false;
    await calculateValuation({ jspdf: { jsPDF: jest.fn() }, setupPDF });
    expect(document.getElementById('valuation-amount').textContent).toBe('$11,000,000');
    expect(document.getElementById('valuation-range').textContent).toBe('$9,900,000 - $12,100,000');
    expect(document.getElementById('confidence-score').textContent).toBe('90%');
    expect(setupPDF).toHaveBeenCalled();
  });

  test('warns when discount rate is zero', async () => {
    const dcfCheckbox = document.createElement('input');
    dcfCheckbox.type = 'checkbox';
    dcfCheckbox.value = 'dcf';
    dcfCheckbox.checked = true;
    document.body.appendChild(dcfCheckbox);
    document.getElementById('discount-rate').value = '0';
    shouldThrow = false;
    await calculateValuation({ jspdf: { jsPDF: jest.fn() }, setupPDF });
    expect(document.getElementById('valuation-warnings').innerHTML).toContain('Discount rate must be greater than 0 for DCF method.');
  });

  test('shows message for negative discount rate', async () => {
    document.getElementById('discount-rate').value = '-5';
    shouldThrow = false;
    await calculateValuation({ jspdf: { jsPDF: jest.fn() }, setupPDF });
    expect(document.getElementById('valuation-warnings').innerHTML).toContain('Discount rate cannot be negative.');
  });

  test('populates DOM even when chart rendering fails', async () => {
    shouldThrow = true;
    await calculateValuation({ jspdf: { jsPDF: jest.fn() }, setupPDF });
    shouldThrow = false;
    expect(document.getElementById('valuation-amount').textContent).toBe('$11,000,000');
    expect(document.getElementById('valuation-range').textContent).toBe('$9,900,000 - $12,100,000');
    expect(document.getElementById('confidence-score').textContent).toBe('90%');
    expect(setupPDF).toHaveBeenCalled();
  });
  test('disables download when jsPDF fails to load', async () => {
    window.alert = jest.fn();
    shouldThrow = false;
    await calculateValuation({ jspdf: {}, setupPDF });
    expect(document.getElementById('valuation-amount').textContent).toBe('$11,000,000');
    expect(document.getElementById('download-report').disabled).toBe(true);
    expect(setupPDF).not.toHaveBeenCalled();
  });

  test('uses existing window.jspdf if available', async () => {
    const globalJspdf = { jsPDF: jest.fn() };
    window.jspdf = globalJspdf;
    shouldThrow = false;
    await calculateValuation({ setupPDF });
    expect(window.jspdf).toBe(globalJspdf);
    expect(setupPDF).toHaveBeenCalled();
  });
});
