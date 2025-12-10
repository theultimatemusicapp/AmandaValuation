import { generateValuationPdf } from './pdf.js';

function buildSampleData() {
  const arr = 1200000;
  const netProfit = 650000;
  const discountRate = 0.12;
  const multiplier = 6.5;

  const valuations = [
    { method: 'Revenue Multiplier', value: arr * multiplier },
    { method: 'Income-Based', value: netProfit * Math.max(multiplier - 1, 1) },
    { method: 'Discounted Cash Flow', value: (netProfit * 1.2) / discountRate }
  ];

  const valuationValues = valuations.map((entry) => entry.value);
  const avgValuation = valuationValues.reduce((sum, value) => sum + value, 0) / valuations.length;

  return {
    valuations,
    methods: valuations.map((entry) => entry.method),
    avgValuation,
    rangeLow: Math.min(...valuationValues),
    rangeHigh: Math.max(...valuationValues),
    confidence: 82,
    companyName: 'Acme Analytics (sample)',
    email: 'founder@acmeanalytics.com',
    arr,
    netProfit,
    growthYoy: 35,
    revenueGrowthMom: 3.1,
    revenueChurn: 4,
    customerChurn: 3.8,
    retentionRate: 92,
    nps: 46,
    legalIssues: 'None reported',
    ipOwnership: 'All code owned; third-party licenses tracked',
    mrr: 100000,
    ltv: 4200,
    cac: 850,
    grossMargin: 78,
    burnRate: -25000,
    runway: 14,
    ownerSalary: 120000,
    averageSalary: 95000,
    employeeBenefits: 15,
    yearsOperating: 4,
    businessType: 'B2B SaaS',
    baseMultiplier: multiplier,
    activeCustomers: 420,
    mau: 2600,
    customerSegment: 'SMB productivity',
    buyerType: 'Strategic buyer',
    productMarketFit: 'Strong retention and expansion from cohorts',
    proprietaryTech: 'Workflow AI orchestration',
    codeQuality: 'CI/CD with robust coverage',
    scalableInfrastructure: 'Horizontally scalable on AWS',
    featureReleaseFrequency: 'Bi-weekly releases',
    securityCompliance: 'SOC2-ready controls',
    fte: 14,
    keyStaff: 3,
    turnoverRate: 8,
    engSalesRatio: 1.5,
    supportTickets: 240,
    supportRating: 4.6,
    headcountGrowth: 18,
    legalEntity: 'C-Corp',
    contractLength: 12,
    contractValue: 12000,
    vendorLockin: 'Low; open API integrations',
    dataPrivacy: 'GDPR-aligned policies',
    cyberInsurance: 'In place',
    debtLevel: 0,
    multiplier,
    discountRate,
    ruleOf40: 35
  };
}

async function renderSamplePdf() {
  const iframe = document.getElementById('sample-pdf-frame');
  const downloadLink = document.getElementById('sample-pdf-link');
  const errorText = document.getElementById('sample-pdf-error');
  if (!iframe || !downloadLink) return;

  const waitForJsPdf = async (timeoutMs = 5000) => {
    const start = performance.now();
    return new Promise((resolve, reject) => {
      const check = () => {
        if (window.jspdf && window.jspdf.jsPDF) return resolve();
        if (performance.now() - start > timeoutMs) return reject(new Error('jsPDF did not load in time'));
        requestAnimationFrame(check);
      };
      check();
    });
  };

  try {
    await waitForJsPdf();
    const { blob } = await generateValuationPdf(buildSampleData(), { save: false });
    const url = URL.createObjectURL(blob);
    iframe.src = url;
    downloadLink.href = url;
  } catch (error) {
    console.error('Sample PDF generation failed:', error);
    if (errorText) {
      errorText.textContent = 'Preview unavailable right now. Download the sample PDF instead while we reload.';
      errorText.classList.remove('hidden');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderSamplePdf();
});
