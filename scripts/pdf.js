export function setupPDF(data) {
  const button = document.getElementById('download-report');
  if (!button) return;

  button.onclick = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let yPos = margin;

    const addHeader = () => {
      doc.setFillColor(56, 178, 172);
      doc.rect(0, 0, pageWidth, 15, 'F');
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text('The SaaS Valuation App™', margin, 10);
    };

    // Cover Page
    addHeader();
    yPos = 25;
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text('The SaaS Valuation App™', margin, yPos);
    yPos += 10;
    doc.setFontSize(16);
    doc.text('The Official Valuation Score with Real Metrics', margin, yPos);
    yPos += 15;
    doc.setFontSize(12);
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 40, 'F');
    doc.setDrawColor(251, 191, 36);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 40);
    yPos += 10;
    doc.text(`Valuation: $${Math.round(data.avgValuation).toLocaleString()}`, margin + 5, yPos);
    yPos += 10;
    doc.text(`Range: $${Math.round(data.rangeLow).toLocaleString()} - $${Math.round(data.rangeHigh).toLocaleString()}`, margin + 5, yPos);
    yPos += 10;
    doc.text(`Confidence: ${Math.round(data.confidence)}%`, margin + 5, yPos);
    yPos += 15;
    doc.setFontSize(10);
    doc.text('Generated on May 09, 2025', margin, yPos);

    // Valuation Details Page
    doc.addPage();
    addHeader();
    yPos = 25;
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Valuation Details', margin, yPos);
    yPos += 10;
    data.valuations.forEach(v => {
      doc.setFontSize(12);
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPos, pageWidth - 2 * margin, 50, 'F');
      doc.setDrawColor(251, 191, 36);
      doc.rect(margin, yPos, pageWidth - 2 * margin, 50);
      yPos += 10;
      doc.text(`${v.method}: $${Math.round(v.value).toLocaleString()}`, margin + 5, yPos);
      doc.setFontSize(10);
      yPos += 8;
      if (v.method === 'Revenue Multiplier') {
        doc.text(`Why: Multiplies ARR ($${data.arr.toLocaleString()}) by ${data.multiplier}x, reflecting revenue stability.`, margin + 5, yPos);
        yPos += 5;
        doc.text(`Improve: Increase ARR via customer acquisition or upselling; reduce churn (${data.customerChurn}%).`, margin + 5, yPos);
        yPos += 5;
        doc.text(`Risk: High churn or low growth (${data.growthYoy}%) lowers multiplier.`, margin + 5, yPos);
        yPos += 5;
        doc.text('Means: Signals revenue potential to investors.', margin + 5, yPos);
      } else if (v.method === 'Income-Based') {
        doc.text(`Why: Multiplies profit ($${data.netProfit.toLocaleString()}) by ${data.multiplier - 1}x, showing profitability.`, margin + 5, yPos);
        yPos += 5;
        doc.text(`Improve: Boost margins (${data.grossMargin}%) or cut costs (burn: $${data.burnRate.toLocaleString()}).`, margin + 5, yPos);
        yPos += 5;
        doc.text(`Risk: Low profit or short runway (${data.runway} months) reduces value.`, margin + 5, yPos);
        yPos += 5;
        doc.text('Means: Highlights cash flow for buyers.', margin + 5, yPos);
      } else if (v.method === 'Earnings-Based') {
        doc.text(`Why: Combines ARR ($${data.arr.toLocaleString()}) and profit, adjusted for retention (${data.retentionRate}%).`, margin + 5, yPos);
        yPos += 5;
        doc.text(`Improve: Enhance retention or NPS (${data.nps}); grow revenue.`, margin + 5, yPos);
        yPos += 5;
        doc.text('Risk: Weak customer metrics lower valuation.', margin + 5, yPos);
        yPos += 5;
        doc.text('Means: Balances growth and profit for investors.', margin + 5, yPos);
      } else if (v.method === 'DCF') {
        doc.text(`Why: Discounts cash flow ($${Math.round(data.netProfit * 1.2).toLocaleString()}) at 10%, factoring risks.`, margin + 5, yPos);
        yPos += 5;
        doc.text(`Improve: Extend runway (${data.runway} months) or reduce risks (e.g., legal: ${data.legalIssues}).`, margin + 5, yPos);
        yPos += 5;
        doc.text(`Risk: High debt ($${data.debtLevel.toLocaleString()}) or legal issues hurt value.`, margin + 5, yPos);
        yPos += 5;
        doc.text('Means: Shows long-term potential to buyers.', margin + 5, yPos);
      }
      yPos += 10;
    });

    // Metrics Overview Page
    doc.addPage();
    addHeader();
    yPos = 25;
    doc.setFontSize(16);
    doc.text('Key Metrics Overview', margin, yPos);
    yPos += 10;
    const metrics = [
      { label: 'ARR', value: `$${data.arr.toLocaleString()}`, insight: data.arr > 1000000 ? 'Strong revenue base.' : 'Grow revenue to boost value.' },
      { label: 'MRR', value: `$${data.mrr.toLocaleString()}`, insight: data.mrr > 100000 ? 'Stable monthly income.' : 'Increase subscriptions.' },
      { label: 'LTV', value: `$${data.ltv.toLocaleString()}`, insight: data.ltv > 3 * data.cac ? 'High customer value.' : 'Extend customer lifetime.' },
      { label: 'CAC', value: `$${data.cac.toLocaleString()}`, insight: data.cac < data.ltv / 3 ? 'Efficient acquisition.' : 'Lower acquisition costs.' },
      { label: 'Gross Margin', value: `${data.grossMargin}%`, insight: data.grossMargin > 70 ? 'Efficient operations.' : 'Optimize costs.' },
      { label: 'Net Profit', value: `$${data.netProfit.toLocaleString()}`, insight: data.netProfit > 0 ? 'Profitable business.' : 'Focus on profitability.' },
      { label: 'Burn Rate', value: `$${data.burnRate.toLocaleString()}`, insight: data.burnRate < data.mrr ? 'Sustainable spending.' : 'Reduce expenses.' },
      { label: 'Runway', value: `${data.runway} months`, insight: data.runway > 12 ? 'Long-term stability.' : 'Secure funding.' },
      { label: 'YoY Growth', value: `${data.growthYoy}%`, insight: data.growthYoy > 20 ? 'Strong growth.' : 'Accelerate revenue growth.' },
      { label: 'Customer Churn', value: `${data.customerChurn}%`, insight: data.customerChurn < 5 ? 'Loyal customers.' : 'Improve retention.' },
      { label: 'Active Customers', value: data.activeCustomers, insight: data.activeCustomers > 1000 ? 'Large customer base.' : 'Expand customer pool.' },
      { label: 'MAU', value: data.mau, insight: data.mau > 1000 ? 'High engagement.' : 'Increase user activity.' },
      { label: 'NPS', value: data.nps, insight: data.nps > 50 ? 'Satisfied customers.' : 'Enhance customer experience.' },
      { label: 'Debt Level', value: `$${data.debtLevel.toLocaleString()}`, insight: data.debtLevel < 100000 ? 'Low financial risk.' : 'Reduce debt.' }
    ];
    metrics.forEach(m => {
      doc.setFontSize(12);
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPos, pageWidth - 2 * margin, 15, 'F');
      doc.setDrawColor(251, 191, 36);
      doc.rect(margin, yPos, pageWidth - 2 * margin, 15);
      doc.text(`${m.label}: ${m.value}`, margin + 5, yPos + 5);
      doc.setFontSize(10);
      doc.text(m.insight, margin + 5, yPos + 12);
      yPos += 20;
      if (yPos > 250) {
        doc.addPage();
        addHeader();
        yPos = 25;
      }
    });

    // Graphs Pages
    const graphs = [
      { id: 'valuation-chart', title: 'Valuation by Method', desc: 'Shows valuation per selected method.' },
      { id: 'financial-chart', title: 'Financial Metrics Impact', desc: 'Highlights key financial inputs.' },
      { id: 'growth-churn-chart', title: 'Growth vs. Churn', desc: 'Compares growth and churn rates.' },
      { id: 'risk-chart', title: 'Risk Factors', desc: 'Visualizes key risk metrics.' }
    ];
    graphs.forEach((graph, index) => {
      if (index % 2 === 0) {
        doc.addPage();
        addHeader();
        yPos = 25;
      }
      const canvas = document.getElementById(graph.id);
      const imgData = canvas.toDataURL('image/png');
      doc.setFontSize(14);
      doc.text(graph.title, margin, yPos);
      yPos += 8;
      doc.setFontSize(10);
      doc.text(graph.desc, margin, yPos);
      yPos += 8;
      doc.addImage(imgData, 'PNG', margin, yPos, 80, 50);
      yPos += 60;
    });

    // About & Disclaimer Page
    doc.addPage();
    addHeader();
    yPos = 25;
    doc.setFontSize(16);
    doc.text('About The SaaS Valuation App™', margin, yPos);
    yPos += 10;
    doc.setFontSize(10);
    const aboutText = 'The SaaS Valuation App™ empowers businesses with AI-driven, transparent valuations. We value honest opinions and real calculations to help investors, partners, and buyers make informed decisions without speculation. Our mission is to deliver accurate, data-driven insights based on your inputs. Contact us: support@saasvaluation.app | Visit: www.saasvaluation.app';
    doc.text(doc.splitTextToSize(aboutText, pageWidth - 2 * margin), margin, yPos);
    yPos += 40;
    doc.setFontSize(16);
    doc.text('Why Trust Us', margin, yPos);
    yPos += 10;
    doc.setFontSize(10);
    const trustText = 'Our valuations are built on industry-standard methods and real-time data analysis. We prioritize transparency, ensuring every calculation is clear and actionable. Note: The accuracy of this report depends on the data you provide. Always verify inputs for reliable results.';
    doc.text(doc.splitTextToSize(trustText, pageWidth - 2 * margin), margin, yPos);
    yPos += 30;
    doc.setFontSize(16);
    doc.text('Disclaimer', margin, yPos);
    yPos += 10;
    doc.setFontSize(10);
    const disclaimerText = 'This valuation is an estimate based on user-provided data and standard methods. It is not financial advice. Consult a professional advisor for business decisions. The SaaS Valuation App™ is not liable for actions taken based on this report. Accuracy depends on the correctness of your inputs.';
    doc.text(doc.splitTextToSize(disclaimerText, pageWidth - 2 * margin), margin, yPos);

    doc.save('saas_valuation_report.pdf');
  };
}
