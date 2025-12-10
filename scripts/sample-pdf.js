const formatCurrency = (value = 0) => {
  const numeric = Number(value) || 0;
  const absVal = Math.abs(numeric);
  if (absVal < 10) return `$${numeric.toFixed(2)}`;
  return `$${Math.round(numeric).toLocaleString()}`;
};

function buildSampleData() {
  const arr = 1200000;
  const netProfit = 180000;
  const yoyGrowth = 35;
  const churn = 4;
  const discountRate = 0.12;
  const multiplier = 6.5;

  const revenueValuation = arr * multiplier;
  const incomeValuation = netProfit * Math.max(multiplier - 1, 1);
  const dcfValuation = (netProfit * 1.2) / discountRate;
  const avgValuation = (revenueValuation + incomeValuation + dcfValuation) / 3;

  return {
    arr,
    netProfit,
    yoyGrowth,
    churn,
    discountRate,
    multiplier,
    valuations: [
      { label: 'Revenue Multiplier', detail: `${formatCurrency(arr)} x ${multiplier}x`, value: revenueValuation },
      { label: 'Income-Based', detail: `${formatCurrency(netProfit)} x ${(multiplier - 1).toFixed(1)}x`, value: incomeValuation },
      { label: 'DCF', detail: `120% of profit / ${(discountRate * 100).toFixed(0)}% discount`, value: dcfValuation }
    ],
    avgValuation
  };
}

async function generateSamplePdf() {
  const iframe = document.getElementById('sample-pdf-frame');
  const downloadLink = document.getElementById('sample-pdf-link');
  if (!iframe || !downloadLink) return;

  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) {
    console.warn('jsPDF not available for sample PDF preview.');
    return;
  }

  const sample = buildSampleData();
  const doc = new jsPDF('p', 'mm', 'a4');
  let yPos = 20;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Sample SaaS Valuation (Pro Methods)', 14, yPos);
  yPos += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(`Scenario: $${(sample.arr / 1000000).toFixed(1)}m ARR, ${sample.yoyGrowth}% YoY growth, ${sample.churn}% churn`, 14, yPos);
  yPos += 6;
  doc.text(`Applied revenue multiplier: ${sample.multiplier}x`, 14, yPos);
  yPos += 10;

  doc.setFont('helvetica', 'bold');
  doc.text('Valuation by Method', 14, yPos);
  doc.setFont('helvetica', 'normal');
  yPos += 6;

  sample.valuations.forEach((method) => {
    doc.text(`• ${method.label}: ${formatCurrency(method.value)}`, 14, yPos);
    yPos += 5;
    doc.setFontSize(10);
    doc.text(`  (${method.detail})`, 18, yPos);
    doc.setFontSize(11);
    yPos += 6;
  });

  doc.setFont('helvetica', 'bold');
  doc.text(`Average valuation: ${formatCurrency(sample.avgValuation)}`, 14, yPos);
  yPos += 8;

  doc.setFont('helvetica', 'normal');
  doc.text('This preview uses the same Revenue Multiplier, Income-Based, and DCF methods available in the Pro report.', 14, yPos);
  yPos += 6;
  doc.text('Full reports include confidence scoring, operational risks, and growth scenarios.', 14, yPos + 5);

  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  iframe.src = url;
  downloadLink.href = url;
}

document.addEventListener('DOMContentLoaded', () => {
  generateSamplePdf().catch((error) => console.error('Sample PDF generation failed:', error));
});
