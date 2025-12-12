import { setupPDF as setupPDFDefault } from './pdf.js';
import { Chart, registerables } from './vendor/chart.js';
Chart.register(...registerables);

const formatCurrency = (value = 0) => {
  const numeric = Number(value) || 0;
  const absVal = Math.abs(numeric);
  if (absVal < 10) return `$${numeric.toFixed(2)}`;
  return `$${Math.round(numeric).toLocaleString()}`;
};

const formatPercent = (value = 0) => `${Number(value || 0).toFixed(1)}%`;

export async function calculateValuation(deps = {}) {
  let jsPDF;
  let pdfEnabled = true;
  try {
    let jspdfModule;
    if (deps.jspdf) {
      jspdfModule = deps.jspdf;
    } else if (window.jspdf && (window.jspdf.jsPDF || window.jspdf.default)) {
      jspdfModule = window.jspdf;
    } else {
      jspdfModule = await import('./vendor/jspdf.es.min.js');
    }
    jsPDF = jspdfModule.jsPDF || jspdfModule.default;
    if (!jsPDF) throw new Error('jsPDF not available');
    if (!window.jspdf) window.jspdf = { jsPDF };
  } catch (error) {
    console.error('Failed to load jsPDF:', error);
    alert('Unable to load PDF library. PDF download disabled.');
    pdfEnabled = false;
    const downloadBtn = document.getElementById('download-report');
    if (downloadBtn) downloadBtn.disabled = true;
  }

  try {
    const methods = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(input => input.value);
    const companyName = document.getElementById('company-name')?.value.trim() || '';
    const userEmail = document.getElementById('user-email')?.value.trim() || '';
    const arr = parseFloat(document.getElementById('arr').value) || 0;
    const netProfit = parseFloat(document.getElementById('net-profit').value) || 0;
    const growthYoy = parseFloat(document.getElementById('revenue-growth-yoy').value) || 0;
    const revenueGrowthMom = parseFloat(document.getElementById('revenue-growth-mom').value) || 0;
    const customerChurn = parseFloat(document.getElementById('customer-churn').value) || 0;
    const revenueChurn = parseFloat(document.getElementById('revenue-churn').value) || 0;
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
    const ownerSalary = parseFloat(document.getElementById('owner-salary')?.value) || 0;
    const averageSalary = parseFloat(document.getElementById('average-salary')?.value) || 0;
    const employeeBenefits = parseFloat(document.getElementById('employee-benefits')?.value) || 0;
    const yearsOperating = parseInt(document.getElementById('years-operating')?.value) || 0;
    const businessTypeSelect = document.getElementById('business-type');
    const baseMultiplier = businessTypeSelect ? parseFloat(businessTypeSelect.value) || 5 : 5;
    const businessTypeOption = businessTypeSelect?.options[businessTypeSelect.selectedIndex];
    const businessType = businessTypeOption?.dataset.name || '';
    const useMultipliers = businessTypeOption?.dataset.useMultiplier !== 'false';
    const activeCustomers = parseFloat(document.getElementById('active-customers').value) || 0;
    const mau = parseFloat(document.getElementById('monthly-active-users').value) || 0;
    const customerSegment = document.getElementById('customer-segment').value;
    const buyerType = document.getElementById('buyer-type').value;
    const productMarketFit = document.getElementById('product-market-fit').value;
    const proprietaryTech = document.getElementById('proprietary-tech').value;
    const codeQuality = document.getElementById('code-quality').value;
    const scalableInfrastructure = document.getElementById('scalable-infrastructure').value;
    const featureReleaseFrequency = document.getElementById('feature-release-frequency').value;
    const securityCompliance = document.getElementById('security-compliance').value;
    const fte = parseFloat(document.getElementById('fte').value) || 0;
    const keyStaff = parseFloat(document.getElementById('key-staff').value) || 0;
    const turnoverRate = parseFloat(document.getElementById('turnover-rate').value) || 0;
    const engSalesRatio = parseFloat(document.getElementById('eng-sales-ratio').value) || 0;
    const supportTickets = parseFloat(document.getElementById('support-tickets').value) || 0;
    const supportRating = parseFloat(document.getElementById('support-rating').value) || 0;
    const headcountGrowth = parseFloat(document.getElementById('headcount-growth').value) || 0;
    const legalEntity = document.getElementById('legal-entity').value;
    const contractLength = parseFloat(document.getElementById('contract-length').value) || 0;
    const contractValue = parseFloat(document.getElementById('contract-value').value) || 0;
    const vendorLockin = document.getElementById('vendor-lockin').value;
    const dataPrivacy = document.getElementById('data-privacy').value;
    const cyberInsurance = document.getElementById('cyber-insurance').value;
    const debtLevel = parseFloat(document.getElementById('debt-level').value) || 0;
    const customMultiplier = parseFloat(document.getElementById('custom-multiplier').value);
    const discountRateInput = parseFloat(document.getElementById('discount-rate').value);
    const discountRate = !isNaN(discountRateInput) ? discountRateInput / 100 : 0.1;

    const netProfitMargin = arr > 0 ? (netProfit / arr) * 100 : 0;
    const ruleOf40 = growthYoy + netProfitMargin;

    let valuations = [];
    let warnings = [];
    let multiplier = !isNaN(customMultiplier) ? customMultiplier : baseMultiplier;
    if (!isNaN(discountRateInput) && discountRateInput < 0) {
      warnings.push('Discount rate cannot be negative.');
    }
    if (useMultipliers) {
      if (growthYoy > 20) multiplier += 2;
      if (customerChurn < 5) multiplier += 1;
      if (retentionRate > 80) multiplier += 1;
      if (nps > 50) multiplier += 0.5;
      if (legalIssues !== 'none') multiplier -= 1;
      if (ipOwnership === 'fully-owned') multiplier += 0.5;
      if (ruleOf40 >= 40) multiplier += 1;
      else multiplier -= 1;
    }
    multiplier = Math.max(multiplier, 1);

    if (methods.includes('multiplier')) {
      if (!useMultipliers) {
        warnings.push('Revenue multipliers are disabled for the selected business type. Choose income, earnings, or DCF instead.');
      } else if (arr <= 0) {
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
        const profitMultiplier = Math.max(multiplier - 1, 1);
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
      } else if (netProfit <= 0) {
        warnings.push('Net profit must be positive to project discounted cash flows.');
      } else {
        const valuation = cashFlow / discountRate;
        valuations.push({ method: 'DCF', value: valuation });
      }
    }

    const usedMethods = valuations.map(v => v.method);
    const methodCount = usedMethods.length || methods.length;
    const avgValuation = valuations.length ? valuations.reduce((sum, v) => sum + v.value, 0) / valuations.length : 0;
    const rangeLow = avgValuation * 0.9;
    const rangeHigh = avgValuation * 1.1;
    const confidence = Math.min(95, 60 + (methodCount * 10) + (growthYoy > 20 ? 10 : 0) + (customerChurn < 5 ? 10 : 0));

    const warningEl = document.getElementById('valuation-warnings');
    if (warnings.length) {
      warningEl.innerHTML = warnings.map(w => `<p>${w}</p>`).join('');
      warningEl.classList.remove('hidden');
    } else {
      warningEl.classList.add('hidden');
      warningEl.innerHTML = '';
    }

    document.getElementById('valuation-amount').textContent = formatCurrency(avgValuation);
    document.getElementById('valuation-range').textContent = `${formatCurrency(rangeLow)} - ${formatCurrency(rangeHigh)}`;
    document.getElementById('confidence-score').textContent = formatPercent(Math.round(confidence));

    // Charts
    try {
      const baseFont = { family: 'Inter, Arial, sans-serif', size: 12 };
      const buildOptions = (yTitle, max = undefined) => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: '#233041', font: baseFont, usePointStyle: true } },
          tooltip: { backgroundColor: '#ffffff', titleColor: '#233041', bodyColor: '#233041', borderColor: '#e5e7eb', borderWidth: 1 }
        },
        layout: { padding: 12 },
        scales: {
          x: { ticks: { color: '#233041', font: baseFont }, grid: { color: '#eef2f7' } },
          y: { beginAtZero: true, max, title: { display: true, text: yTitle, color: '#233041', font: baseFont }, ticks: { color: '#233041', font: baseFont }, grid: { color: '#eef2f7' } }
        },
        elements: { bar: { borderRadius: 6 } }
      });

      const valuationCanvas = document.getElementById('valuation-chart');
      new Chart(valuationCanvas, {
        type: 'bar',
        data: {
          labels: valuations.map(v => v.method),
          datasets: [{
            label: 'Valuation ($)',
            data: valuations.map(v => v.value),
            backgroundColor: 'rgba(56, 178, 172, 0.7)',
            borderColor: '#38b2ac',
            borderWidth: 1
          }]
        },
        options: buildOptions('Valuation ($)')
      });

      const financialCanvas = document.getElementById('financial-chart');
      new Chart(financialCanvas, {
        type: 'bar',
        data: {
          labels: ['ARR', 'Net Profit', 'LTV', 'CAC'],
          datasets: [{
            label: 'Financial Metrics ($)',
            data: [arr, netProfit, ltv, cac],
            backgroundColor: ['rgba(56, 178, 172, 0.7)', 'rgba(251, 191, 36, 0.7)', 'rgba(45, 55, 72, 0.7)', 'rgba(255, 99, 132, 0.7)'],
            borderColor: ['#38b2ac', '#fbbf24', '#2d3748', '#ff6384'],
            borderWidth: 1
          }]
        },
        options: buildOptions('Amount ($)')
      });

      const growthChurnCanvas = document.getElementById('growth-churn-chart');
      new Chart(growthChurnCanvas, {
        type: 'bar',
        data: {
          labels: ['YoY Growth', 'MoM Growth', 'Customer Churn', 'Revenue Churn'],
          datasets: [{
            label: 'Percentage (%)',
            data: [
              growthYoy,
              revenueGrowthMom,
              customerChurn,
              revenueChurn
            ],
            backgroundColor: ['rgba(56, 178, 172, 0.7)', 'rgba(251, 191, 36, 0.7)', 'rgba(255, 99, 132, 0.7)', 'rgba(45, 55, 72, 0.7)'],
            borderColor: ['#38b2ac', '#fbbf24', '#ff6384', '#2d3748'],
            borderWidth: 1
          }]
        },
        options: buildOptions('Rate (%)', 100)
      });

      const riskCanvas = document.getElementById('risk-chart');
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
            pointBackgroundColor: 'rgba(255, 99, 132, 1)'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: '#233041', font: baseFont } } },
          scales: { r: { min: 0, max: 10, grid: { color: '#eef2f7' }, pointLabels: { color: '#233041', font: baseFont }, ticks: { display: false } } }
        }
      });

      const chartCaptions = {
        'valuation-chart': valuations.length > 1
          ? 'Methods are cross-checked; alignments within range improve confidence.'
          : 'Single-method result—add another approach to validate the headline number.',
        'financial-chart': ltv && cac
          ? `LTV/CAC balance guides buyer confidence; LTV ${formatCurrency(ltv)} vs CAC ${formatCurrency(cac)}.`
          : 'Populate LTV and CAC to show acquisition efficiency clearly.',
        'growth-churn-chart': growthYoy > customerChurn
          ? 'Growth outpaces churn, supporting the applied multiple.'
          : 'Churn is eroding growth—improve retention to defend the valuation.',
        'risk-chart': `Risk inputs reflect legal (${legalIssues}), IP (${ipOwnership}), and debt ${formatCurrency(debtLevel)}.`
      };

      Object.entries(chartCaptions).forEach(([id, text]) => {
        const el = document.getElementById(`${id}-caption`);
        if (el) el.textContent = text;
      });
    } catch (error) {
      console.error('Failed to render charts:', error);
    }

    const setupPDF = deps.setupPDF || setupPDFDefault;
    if (pdfEnabled) {
      setupPDF({
        valuations,
        avgValuation,
        rangeLow,
        rangeHigh,
        confidence,
        companyName,
        email: userEmail,
        arr,
        netProfit,
        growthYoy,
        revenueGrowthMom,
        revenueChurn,
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
        ownerSalary,
        averageSalary,
        employeeBenefits,
        yearsOperating,
        businessType,
        baseMultiplier,
        activeCustomers,
        mau,
        customerSegment,
        buyerType,
        productMarketFit,
        proprietaryTech,
        codeQuality,
        scalableInfrastructure,
        featureReleaseFrequency,
        securityCompliance,
        fte,
        keyStaff,
        turnoverRate,
        engSalesRatio,
        supportTickets,
        supportRating,
        headcountGrowth,
        legalEntity,
        contractLength,
        contractValue,
        vendorLockin,
        dataPrivacy,
        cyberInsurance,
        debtLevel,
        multiplier,
        discountRate,
        ruleOf40,
        methods: usedMethods.length ? usedMethods : methods
      });
    }

    if (typeof fetch === 'function') {
      try {
        await fetch('https://formspree.io/f/mjkowkld', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            companyName,
            email: userEmail,
            avgValuation,
            rangeLow,
            rangeHigh,
            methods
          })
        });
      } catch (error) {
        console.error('Failed to send data to Formspree:', error);
      }
    }
  } catch (error) {
    console.error('Error calculating valuation:', error);
    alert('An error occurred while calculating valuation. Please try again.');
  }
}
