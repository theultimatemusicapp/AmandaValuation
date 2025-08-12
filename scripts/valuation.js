import { setupPDF as setupPDFDefault } from './pdf.js';

export async function calculateValuation(deps = {}) {
  let Chart;
  try {
    Chart = deps.Chart || (await import('./vendor/chart.js')).default;
  } catch (error) {
    console.error('Failed to load Chart.js:', error);
    alert('Unable to load chart library. Please refresh and try again.');
    return;
  }
  let jsPDF;
  try {
    const jspdfModule = deps.jspdf || (await import('./vendor/jspdf.es.min.js'));
    jsPDF = jspdfModule.jsPDF;
    window.jspdf = { jsPDF };
  } catch (error) {
    console.error('Failed to load jsPDF:', error);
    alert('Unable to load PDF library. Please refresh and try again.');
    return;
  }

  try {
    const methods = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(input => input.value);
    const arr = parseFloat(document.getElementById('arr').value) || 0;
    const netProfit = parseFloat(document.getElementById('net-profit').value) || 0;
    const growthYoy = parseFloat(document.getElementById('revenue-growth-yoy').value) || 0;
    const customerChurn = parseFloat(document.getElementById('customer-churn').value) || 0;
    const retentionRate = parseFloat(document.getElementById('retention-rate').value) || 0;
    const nps = parseFloat(document.getElementById('nps').value) || 0;
    const legalIssues = document.getElementById('legal-issues').value;
    const ipOwnership = document.getElementById('ip-ownership').value;
    const mrr = parseFloat(document.getElementById('mrr').value) || 0;
    const ltv = parseFloat(document.getElementById('ltv').value) || 0;
    const cac = parseFloat(document.getElementById('cac').value) || 0;
    const grossMargin = parseFloat(document.getElementById('gross-margin').value) || 0;
    const burnRate = parseFloat(document.getElementById('burn-rate').value) || 0;
    const runway = parseFloat(document.getElementById('runway').value) || 0;
    const activeCustomers = parseFloat(document.getElementById('active-customers').value) || 0;
    const mau = parseFloat(document.getElementById('monthly-active-users').value) || 0;
    const debtLevel = parseFloat(document.getElementById('debt-level').value) || 0;
    const customMultiplier = parseFloat(document.getElementById('custom-multiplier').value) || null;
    const discountRateInput = parseFloat(document.getElementById('discount-rate').value) || null;
    const discountRate = discountRateInput ? discountRateInput / 100 : 0.1;

    const netProfitMargin = arr > 0 ? (netProfit / arr) * 100 : 0;
    const ruleOf40 = growthYoy + netProfitMargin;

    let valuations = [];
    let warnings = [];
    let multiplier = customMultiplier || 5;
    if (growthYoy > 20) multiplier += 2;
    if (customerChurn < 5) multiplier += 1;
    if (retentionRate > 80) multiplier += 1;
    if (nps > 50) multiplier += 0.5;
    if (legalIssues !== 'none') multiplier -= 1;
    if (ipOwnership === 'fully-owned') multiplier += 0.5;
    if (ruleOf40 >= 40) multiplier += 1;
    else multiplier -= 1;
    multiplier = Math.max(multiplier, 1);

    if (methods.includes('multiplier')) {
      if (arr <= 0) {
        warnings.push('ARR must be greater than 0 for Revenue Multiplier method.');
      } else {
        const valuation = arr * multiplier;
        valuations.push({ method: 'Revenue Multiplier', value: valuation });
      }
    }
    if (methods.includes('income')) {
      if (netProfit <= 0) {
        warnings.push('Net profit should be positive for Income-Based method.');
      } else {
        const profitMultiplier = multiplier - 1;
        const valuation = netProfit * profitMultiplier;
        valuations.push({ method: 'Income-Based', value: valuation });
      }
    }
    if (methods.includes('earnings')) {
      if (arr <= 0 || netProfit <= 0) {
        warnings.push('Earnings-Based method requires positive ARR and net profit.');
      } else {
        const valuation = (arr * 0.6 + netProfit * 0.4) * multiplier;
        valuations.push({ method: 'Earnings-Based', value: valuation });
      }
    }
    if (methods.includes('dcf')) {
      const cashFlow = netProfit * 1.2;
      if (discountRate <= 0) {
        warnings.push('Discount rate must be greater than 0 for DCF method.');
      } else {
        const valuation = cashFlow / discountRate;
        valuations.push({ method: 'DCF', value: valuation });
      }
    }

    const avgValuation = valuations.length ? valuations.reduce((sum, v) => sum + v.value, 0) / valuations.length : 0;
    const rangeLow = avgValuation * 0.9;
    const rangeHigh = avgValuation * 1.1;
    const confidence = Math.min(95, 60 + (methods.length * 10) + (growthYoy > 20 ? 10 : 0) + (customerChurn < 5 ? 10 : 0));

    const warningEl = document.getElementById('valuation-warnings');
    if (warnings.length) {
      warningEl.innerHTML = warnings.map(w => `<p>${w}</p>`).join('');
      warningEl.classList.remove('hidden');
    } else {
      warningEl.classList.add('hidden');
      warningEl.innerHTML = '';
    }

    document.getElementById('valuation-amount').textContent = `$${Math.round(avgValuation).toLocaleString()}`;
    document.getElementById('valuation-range').textContent = `$${Math.round(rangeLow).toLocaleString()} - $${Math.round(rangeHigh).toLocaleString()}`;
    document.getElementById('confidence-score').textContent = `${Math.round(confidence)}%`;

    // Charts
    const valuationCanvas = document.getElementById('valuation-chart');
    valuationCanvas.width = 800;
    valuationCanvas.height = 500;
    new Chart(valuationCanvas, {
      type: 'bar',
      data: {
        labels: valuations.map(v => v.method),
        datasets: [{
          label: 'Valuation ($)',
          data: valuations.map(v => v.value),
          backgroundColor: 'rgba(56, 178, 172, 0.6)',
        }]
      },
      options: { scales: { y: { beginAtZero: true } } }
    });

    const financialCanvas = document.getElementById('financial-chart');
    financialCanvas.width = 800;
    financialCanvas.height = 500;
    new Chart(financialCanvas, {
      type: 'bar',
      data: {
        labels: ['ARR', 'Net Profit', 'LTV', 'CAC'],
        datasets: [{
          label: 'Financial Metrics ($)',
          data: [arr, netProfit, ltv, cac],
          backgroundColor: ['rgba(56, 178, 172, 0.6)', 'rgba(251, 191, 36, 0.6)', 'rgba(45, 55, 72, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        }]
      },
      options: { scales: { y: { beginAtZero: true } } }
    });

    const growthChurnCanvas = document.getElementById('growth-churn-chart');
    growthChurnCanvas.width = 800;
    growthChurnCanvas.height = 500;
    new Chart(growthChurnCanvas, {
      type: 'bar',
      data: {
        labels: ['YoY Growth', 'MoM Growth', 'Customer Churn', 'Revenue Churn'],
        datasets: [{
          label: 'Percentage (%)',
          data: [
            growthYoy,
            parseFloat(document.getElementById('revenue-growth-mom').value) || 0,
            customerChurn,
            parseFloat(document.getElementById('revenue-churn').value) || 0
          ],
          backgroundColor: ['rgba(56, 178, 172, 0.6)', 'rgba(251, 191, 36, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(45, 55, 72, 0.6)'],
        }]
      },
      options: { scales: { y: { beginAtZero: true, max: 100 } } }
    });

    const riskCanvas = document.getElementById('risk-chart');
    riskCanvas.width = 800;
    riskCanvas.height = 500;
    new Chart(riskCanvas, {
      type: 'radar',
      data: {
        labels: ['Legal Issues', 'IP Ownership', 'Data Privacy', 'Debt Level'],
        datasets: [{
          label: 'Risk Score (0-10)',
          data: [
            legalIssues === 'none' ? 2 : legalIssues === 'minor' ? 5 : 8,
            ipOwnership === 'fully-owned' ? 2 : ipOwnership === 'partial' ? 5 : 8,
            document.getElementById('data-privacy').value === 'full' ? 2 : document.getElementById('data-privacy').value === 'partial' ? 5 : 8,
            debtLevel < 100000 ? 2 : 5
          ],
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          pointBackgroundColor: 'rgba(255, 99, 132, 1)',
        }]
      },
      options: { scales: { r: { min: 0, max: 10 } } }
    });

    const setupPDF = deps.setupPDF || setupPDFDefault;
    setupPDF({
      valuations,
      avgValuation,
      rangeLow,
      rangeHigh,
      confidence,
      arr,
      netProfit,
      growthYoy,
      customerChurn,
      retentionRate,
      nps,
      legalIssues,
      ipOwnership,
      mrr,
      ltv,
      cac,
      grossMargin,
      burnRate,
      runway,
      activeCustomers,
      mau,
      debtLevel,
      multiplier,
      discountRate,
      ruleOf40
    });
  } catch (error) {
    console.error('Error calculating valuation:', error);
    alert('An error occurred while calculating valuation. Please try again.');
  }
}
