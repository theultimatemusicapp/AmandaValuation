export function setupPDF(data) {
  const button = document.getElementById('download-report');
  if (!button) return;

  button.onclick = async () => {
    try {
      const { jsPDF } = window.jspdf || {};
      if (!jsPDF) {
        alert('PDF library not loaded. Please generate a valuation first.');
        return;
      }
      try {
        await import('./vendor/jspdf.plugin.autotable.js');
      } catch (error) {
        console.error('Failed to load jsPDF autotable plugin:', error);
        alert('Failed to load table plugin. Please refresh and try again.');
        return;
      }
      let DOMPurify;
      try {
        const domPurifyModule = await import('./vendor/purify.es.min.js');
        DOMPurify = domPurifyModule.default || domPurifyModule;
      } catch (error) {
        console.error('Failed to load DOMPurify:', error);
        alert('Failed to load sanitization library. Please refresh and try again.');
        return;
      }
      const sanitizeText = (str) => DOMPurify.sanitize(String(str));
      const sanitizeNumber = (num) => parseFloat(num) || 0;
      const sanitizedData = {
        valuations: data.valuations.map(v => ({ method: sanitizeText(v.method), value: sanitizeNumber(v.value) })),
        methods: data.methods.map(sanitizeText),
        avgValuation: sanitizeNumber(data.avgValuation),
        rangeLow: sanitizeNumber(data.rangeLow),
        rangeHigh: sanitizeNumber(data.rangeHigh),
        confidence: sanitizeNumber(data.confidence),
        arr: sanitizeNumber(data.arr),
        netProfit: sanitizeNumber(data.netProfit),
        growthYoy: sanitizeNumber(data.growthYoy),
        revenueGrowthMom: sanitizeNumber(data.revenueGrowthMom),
        revenueChurn: sanitizeNumber(data.revenueChurn),
        customerChurn: sanitizeNumber(data.customerChurn),
        retentionRate: sanitizeNumber(data.retentionRate),
        nps: sanitizeNumber(data.nps),
        legalIssues: sanitizeText(data.legalIssues),
        ipOwnership: sanitizeText(data.ipOwnership),
        mrr: sanitizeNumber(data.mrr),
        ltv: sanitizeNumber(data.ltv),
        cac: sanitizeNumber(data.cac),
        grossMargin: sanitizeNumber(data.grossMargin),
        burnRate: sanitizeNumber(data.burnRate),
        runway: sanitizeNumber(data.runway),
        ownerSalary: sanitizeNumber(data.ownerSalary),
        averageSalary: sanitizeNumber(data.averageSalary),
        employeeBenefits: sanitizeNumber(data.employeeBenefits),
        yearsOperating: sanitizeNumber(data.yearsOperating),
        businessType: sanitizeText(data.businessType),
        baseMultiplier: sanitizeNumber(data.baseMultiplier),
        activeCustomers: sanitizeNumber(data.activeCustomers),
        mau: sanitizeNumber(data.mau),
        customerSegment: sanitizeText(data.customerSegment),
        buyerType: sanitizeText(data.buyerType),
        productMarketFit: sanitizeText(data.productMarketFit),
        proprietaryTech: sanitizeText(data.proprietaryTech),
        codeQuality: sanitizeText(data.codeQuality),
        scalableInfrastructure: sanitizeText(data.scalableInfrastructure),
        featureReleaseFrequency: sanitizeText(data.featureReleaseFrequency),
        securityCompliance: sanitizeText(data.securityCompliance),
        fte: sanitizeNumber(data.fte),
        keyStaff: sanitizeNumber(data.keyStaff),
        turnoverRate: sanitizeNumber(data.turnoverRate),
        engSalesRatio: sanitizeNumber(data.engSalesRatio),
        supportTickets: sanitizeNumber(data.supportTickets),
        supportRating: sanitizeNumber(data.supportRating),
        headcountGrowth: sanitizeNumber(data.headcountGrowth),
        legalEntity: sanitizeText(data.legalEntity),
        contractLength: sanitizeNumber(data.contractLength),
        contractValue: sanitizeNumber(data.contractValue),
        vendorLockin: sanitizeText(data.vendorLockin),
        dataPrivacy: sanitizeText(data.dataPrivacy),
        cyberInsurance: sanitizeText(data.cyberInsurance),
        debtLevel: sanitizeNumber(data.debtLevel),
        multiplier: sanitizeNumber(data.multiplier),
        discountRate: sanitizeNumber(data.discountRate),
        ruleOf40: sanitizeNumber(data.ruleOf40)
      };

      const doc = new jsPDF();
      doc.setFont('helvetica');
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      let yPos = margin;

      const addHeader = () => {
        doc.setFillColor(56, 178, 172);
        doc.rect(0, 0, pageWidth, 15, 'F');
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.text('The SaaS Valuation App™', margin, 10);
        doc.setTextColor(0, 0, 0);
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
      doc.text(`Valuation: $${Math.round(sanitizedData.avgValuation).toLocaleString()}`, margin + 5, yPos);
      yPos += 10;
      doc.text(`Range: $${Math.round(sanitizedData.rangeLow).toLocaleString()} - $${Math.round(sanitizedData.rangeHigh).toLocaleString()}`, margin + 5, yPos);
      yPos += 10;
      doc.text(`Confidence: ${Math.round(sanitizedData.confidence)}%`, margin + 5, yPos);
      yPos += 15;
      doc.setFontSize(10);
      const today = new Date().toLocaleDateString();
      doc.text(`Generated on ${today}`, margin, yPos);

      // Valuation Details Page
      doc.addPage();
      addHeader();
      yPos = 25;
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text('Valuation Details', margin, yPos);
      yPos += 10;
      sanitizedData.valuations.forEach(v => {
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
          doc.text(`Why: Multiplies ARR ($${sanitizedData.arr.toLocaleString()}) by ${sanitizedData.multiplier}x, reflecting revenue stability.`, margin + 5, yPos);
          yPos += 5;
          doc.text(`Improve: Increase ARR via customer acquisition or upselling; reduce churn (${sanitizedData.customerChurn}%).`, margin + 5, yPos);
          yPos += 5;
          doc.text(`Risk: High churn or low growth (${sanitizedData.growthYoy}%) lowers multiplier.`, margin + 5, yPos);
          yPos += 5;
          doc.text('Means: Signals revenue potential to investors.', margin + 5, yPos);
        } else if (v.method === 'Income-Based') {
          doc.text(`Why: Multiplies profit ($${sanitizedData.netProfit.toLocaleString()}) by ${sanitizedData.multiplier - 1}x, showing profitability.`, margin + 5, yPos);
          yPos += 5;
          doc.text(`Improve: Boost margins (${sanitizedData.grossMargin}%) or cut costs (burn: $${sanitizedData.burnRate.toLocaleString()}).`, margin + 5, yPos);
          yPos += 5;
          doc.text(`Risk: Low profit or short runway (${sanitizedData.runway} months) reduces value.`, margin + 5, yPos);
          yPos += 5;
          doc.text('Means: Highlights cash flow for buyers.', margin + 5, yPos);
        } else if (v.method === 'Earnings-Based') {
          doc.text(`Why: Combines ARR ($${sanitizedData.arr.toLocaleString()}) and profit, adjusted for retention (${sanitizedData.retentionRate}%).`, margin + 5, yPos);
          yPos += 5;
          doc.text(`Improve: Enhance retention or NPS (${sanitizedData.nps}); grow revenue.`, margin + 5, yPos);
          yPos += 5;
          doc.text('Risk: Weak customer metrics lower valuation.', margin + 5, yPos);
          yPos += 5;
          doc.text('Means: Balances growth and profit for investors.', margin + 5, yPos);
        } else if (v.method === 'DCF') {
          doc.text(`Why: Discounts cash flow ($${Math.round(sanitizedData.netProfit * 1.2).toLocaleString()}) at ${(sanitizedData.discountRate * 100).toFixed(2)}%, factoring risks.`, margin + 5, yPos);
          yPos += 5;
          doc.text(`Improve: Extend runway (${sanitizedData.runway} months) or reduce risks (e.g., legal: ${sanitizedData.legalIssues}).`, margin +5, yPos);
          yPos += 5;
          doc.text(`Risk: High debt ($${sanitizedData.debtLevel.toLocaleString()}) or legal issues hurt value.`, margin + 5, yPos);
          yPos += 5;
          doc.text('Means: Shows long-term potential to buyers.', margin + 5, yPos);
        }
        yPos += 10;
      });

      // Input Summary Page
      doc.addPage();
      addHeader();
      yPos = 25;
      doc.setFontSize(16);
      doc.text('Input Summary', margin, yPos);
      yPos += 10;
      const inputs = [
        ['Valuation Methods', sanitizedData.methods.join(', ')],
        ['Business Type', sanitizedData.businessType],
        ['Industry Multiplier', sanitizedData.baseMultiplier],
        ['Adjusted Multiplier', sanitizedData.multiplier],
        ['ARR', `$${sanitizedData.arr.toLocaleString()}`],
        ['MRR', `$${sanitizedData.mrr.toLocaleString()}`],
        ['Net Profit', `$${sanitizedData.netProfit.toLocaleString()}`],
        ['YoY Growth', `${sanitizedData.growthYoy}%`],
        ['MoM Growth', `${sanitizedData.revenueGrowthMom}%`],
        ['Customer Churn', `${sanitizedData.customerChurn}%`],
        ['Revenue Churn', `${sanitizedData.revenueChurn}%`],
        ['Retention Rate', `${sanitizedData.retentionRate}%`],
        ['NPS', sanitizedData.nps],
        ['Gross Margin', `${sanitizedData.grossMargin}%`],
        ['CAC', `$${sanitizedData.cac.toLocaleString()}`],
        ['LTV', `$${sanitizedData.ltv.toLocaleString()}`],
        ['Burn Rate', `$${sanitizedData.burnRate.toLocaleString()}`],
        ['Runway', `${sanitizedData.runway} months`],
        ['Owner Salary', `$${sanitizedData.ownerSalary.toLocaleString()}`],
        ['Average Employee Salary', `$${sanitizedData.averageSalary.toLocaleString()}`],
        ['Employee Benefits', `$${sanitizedData.employeeBenefits.toLocaleString()}`],
        ['Years in Operation', sanitizedData.yearsOperating],
        ['Active Customers', sanitizedData.activeCustomers],
        ['MAU', sanitizedData.mau],
        ['Customer Segment', sanitizedData.customerSegment],
        ['Buyer Type', sanitizedData.buyerType],
        ['Product-Market Fit', sanitizedData.productMarketFit],
        ['Proprietary Tech', sanitizedData.proprietaryTech],
        ['Code Quality', sanitizedData.codeQuality],
        ['Scalable Infrastructure', sanitizedData.scalableInfrastructure],
        ['Feature Release Frequency', sanitizedData.featureReleaseFrequency],
        ['Security Compliance', sanitizedData.securityCompliance],
        ['FTE', sanitizedData.fte],
        ['Key Staff', sanitizedData.keyStaff],
        ['Turnover Rate', `${sanitizedData.turnoverRate}%`],
        ['Eng/Sales Ratio', sanitizedData.engSalesRatio],
        ['Support Tickets', sanitizedData.supportTickets],
        ['Support Rating', sanitizedData.supportRating],
        ['Headcount Growth', `${sanitizedData.headcountGrowth}%`],
        ['Legal Entity', sanitizedData.legalEntity],
        ['Contract Length', `${sanitizedData.contractLength} months`],
        ['Contract Value', `$${sanitizedData.contractValue.toLocaleString()}`],
        ['Vendor Lock-in', sanitizedData.vendorLockin],
        ['Legal Issues', sanitizedData.legalIssues],
        ['IP Ownership', sanitizedData.ipOwnership],
        ['Data Privacy', sanitizedData.dataPrivacy],
        ['Cyber Insurance', sanitizedData.cyberInsurance],
        ['Debt Level', `$${sanitizedData.debtLevel.toLocaleString()}`],
        ['Discount Rate', `${(sanitizedData.discountRate * 100).toFixed(2)}%`],
        ['Rule of 40', sanitizedData.ruleOf40]
      ];
      if (typeof doc.autoTable === 'function') {
        doc.autoTable({
          head: [['Metric', 'Value']],
          body: inputs,
          startY: yPos,
          theme: 'striped',
          styles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
          headStyles: { fillColor: [56, 178, 172] }
        });
        yPos = doc.lastAutoTable.finalY + 10;
      } else {
        console.warn('autoTable plugin not loaded');
        yPos += 10;
      }

      // Metrics Overview Page
      doc.addPage();
      addHeader();
      yPos = 25;
      doc.setFontSize(16);
      doc.text('Key Metrics Overview', margin, yPos);
      yPos += 10;
      // Each metric now includes an "importance" explanation to show why it matters.
      const metrics = [
        {
          label: 'ARR',
          value: `$${sanitizedData.arr.toLocaleString()}`,
          importance: 'Shows recurring revenue baseline.',
          insight: sanitizedData.arr > 1000000 ? 'Strong revenue base.' : 'Grow revenue to boost value.'
        },
        {
          label: 'MRR',
          value: `$${sanitizedData.mrr.toLocaleString()}`,
          importance: 'Highlights monthly revenue consistency.',
          insight: sanitizedData.mrr > 100000 ? 'Stable monthly income.' : 'Increase subscriptions.'
        },
        {
          label: 'LTV',
          value: `$${sanitizedData.ltv.toLocaleString()}`,
          importance: 'Indicates lifetime revenue per customer.',
          insight: sanitizedData.ltv > 3 * sanitizedData.cac ? 'High customer value.' : 'Extend customer lifetime.'
        },
        {
          label: 'CAC',
          value: `$${sanitizedData.cac.toLocaleString()}`,
          importance: 'Reveals cost to acquire customers.',
          insight: sanitizedData.cac < sanitizedData.ltv / 3 ? 'Efficient acquisition.' : 'Lower acquisition costs.'
        },
        {
          label: 'Gross Margin',
          value: `${sanitizedData.grossMargin}%`,
          importance: 'Reflects operational efficiency.',
          insight: sanitizedData.grossMargin > 70 ? 'Efficient operations.' : 'Optimize costs.'
        },
        {
          label: 'Net Profit',
          value: `$${sanitizedData.netProfit.toLocaleString()}`,
          importance: 'Measures profitability.',
          insight: sanitizedData.netProfit > 0 ? 'Profitable business.' : 'Focus on profitability.'
        },
        {
          label: 'Burn Rate',
          value: `$${sanitizedData.burnRate.toLocaleString()}`,
          importance: 'Tracks cash consumption rate.',
          insight: sanitizedData.burnRate < sanitizedData.mrr ? 'Sustainable spending.' : 'Reduce expenses.'
        },
        {
          label: 'Runway',
          value: `${sanitizedData.runway} months`,
          importance: 'Estimates months before cash runs out.',
          insight: sanitizedData.runway > 12 ? 'Long-term stability.' : 'Secure funding.'
        },
        {
          label: 'Owner Salary',
          value: `$${sanitizedData.ownerSalary.toLocaleString()}`,
          importance: 'Shows owner compensation excluded from profit.',
          insight: sanitizedData.ownerSalary > 0 ? 'Track SDE adjustments.' : 'Enter salary for clarity.'
        },
        {
          label: 'Average Employee Salary',
          value: `$${sanitizedData.averageSalary.toLocaleString()}`,
          importance: 'Highlights staff cost structure.',
          insight: sanitizedData.averageSalary > 0 ? 'Competitive pay scale.' : 'Benchmark salaries.'
        },
        {
          label: 'Employee Benefits',
          value: `$${sanitizedData.employeeBenefits.toLocaleString()}`,
          importance: 'Captures non-salary compensation.',
          insight: sanitizedData.employeeBenefits > 0 ? 'Include in cost planning.' : 'Track benefit spend.'
        },
        {
          label: 'Years in Operation',
          value: sanitizedData.yearsOperating,
          importance: 'Indicates business maturity.',
          insight: sanitizedData.yearsOperating >= 2 ? 'Established track record.' : 'Early-stage risk.'
        },
        {
          label: 'YoY Growth',
          value: `${sanitizedData.growthYoy}%`,
          importance: 'Shows annual revenue momentum.',
          insight: sanitizedData.growthYoy > 20 ? 'Strong growth.' : 'Accelerate revenue growth.'
        },
        {
          label: 'Customer Churn',
          value: `${sanitizedData.customerChurn}%`,
          importance: 'Captures customer loss rate.',
          insight: sanitizedData.customerChurn < 5 ? 'Loyal customers.' : 'Improve retention.'
        },
        {
          label: 'Active Customers',
          value: sanitizedData.activeCustomers,
          importance: 'Signals market traction.',
          insight: sanitizedData.activeCustomers > 1000 ? 'Large customer base.' : 'Expand customer pool.'
        },
        {
          label: 'MAU',
          value: sanitizedData.mau,
          importance: 'Measures user engagement.',
          insight: sanitizedData.mau > 1000 ? 'High engagement.' : 'Increase user activity.'
        },
        {
          label: 'NPS',
          value: sanitizedData.nps,
          importance: 'Gauges customer satisfaction.',
          insight: sanitizedData.nps > 50 ? 'Satisfied customers.' : 'Enhance customer experience.'
        },
        {
          label: 'Debt Level',
          value: `$${sanitizedData.debtLevel.toLocaleString()}`,
          importance: 'Assesses financial risk.',
          insight: sanitizedData.debtLevel < 100000 ? 'Low financial risk.' : 'Reduce debt.'
        }
      ];
      if (typeof doc.autoTable === 'function') {
        doc.autoTable({
          head: [['Label', 'Value', 'Importance', 'Insight']],
          // Output four columns so readers understand each metric's role and takeaway
          body: metrics.map(m => [m.label, m.value, m.importance, m.insight]),
          startY: yPos,
          theme: 'striped',
          styles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] },
          headStyles: { fillColor: [56, 178, 172] }
        });
        yPos = doc.lastAutoTable.finalY + 10;
      } else {
        console.warn('autoTable plugin not loaded');
        yPos += 10;
      }

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
        if (!canvas) {
          console.warn(`Canvas with id ${graph.id} not found`);
          return;
        }
        const imgData = canvas.toDataURL('image/jpeg', 0.8);
        doc.setFontSize(14);
        doc.text(graph.title, margin, yPos);
        yPos += 8;
        doc.setFontSize(10);
        doc.text(graph.desc, margin, yPos);
        yPos += 8;
        doc.addImage(imgData, 'JPEG', margin, yPos, 120, 75);
        yPos += 85;
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
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Page ${i}`, doc.internal.pageSize.getWidth() - margin, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
      }

      await doc.save('saas_valuation_report.pdf', { returnPromise: true });
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('An error occurred while generating the PDF. Please try again.');
    }
  };
}

