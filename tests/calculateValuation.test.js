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
      <select id="business-type"><option value="5" data-name="Project Management" selected>Project Management</option></select>
      <input id="active-customers" value="2000" />
      <input id="monthly-active-users" value="5000" />
      <select id="customer-segment"><option value="smb" selected>SMB</option></select>
      <select id="buyer-type"><option value="investors" selected>Investors</option></select>
      <select id="product-market-fit"><option value="strong" selected>Strong</option></select>
      <select id="proprietary-tech"><option value="yes" selected>Yes</option></select>
      <select id="code-quality"><option value="good" selected>Good</option></select>
      <select id="scalable-infrastructure"><option value="yes" selected>Yes</option></select>
      <select id="feature-release-frequency"><option value="monthly" selected>Monthly</option></select>
      <select id="security-compliance"><option value="full" selected>Full</option></select>
      <input id="fte" value="10" />
      <input id="key-staff" value="5" />
      <input id="turnover-rate" value="5" />
      <input id="eng-sales-ratio" value="1" />
      <input id="support-tickets" value="10" />
      <input id="support-rating" value="8" />
      <input id="headcount-growth" value="10" />
      <select id="legal-entity"><option value="llc" selected>LLC</option></select>
      <input id="contract-length" value="12" />
      <input id="contract-value" value="1000" />
      <select id="vendor-lockin"><option value="none" selected>None</option></select>
      <select id="data-privacy"><option value="full" selected>Full</option></select>
      <select id="cyber-insurance"><option value="yes" selected>Yes</option></select>
      <input id="debt-level" value="50000" />
      <input id="custom-multiplier" value="" />
      <input id="discount-rate" value="" />
      <input id="revenue-growth-mom" value="5" />
      <input id="revenue-churn" value="3" />
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
