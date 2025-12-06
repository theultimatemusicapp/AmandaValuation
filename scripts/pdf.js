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
        const { applyPlugin } = await import('./vendor/jspdf.plugin.autotable.js');
        applyPlugin(jsPDF);
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
        companyName: sanitizeText(data.companyName),
        email: sanitizeText(data.email),
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

      const doc = new jsPDF({ compress: true });
      doc.setProperties({
        title: 'SaaS Valuation Report',
        subject: 'Investor-ready valuation summary',
        creator: 'The SaaS Valuation App™'
      });
      if (typeof doc.autoTable !== 'function') {
        console.error('jsPDF autoTable plugin failed to initialize');
        alert('Failed to initialize table plugin. Please refresh and try again.');
        return;
      }
      doc.setFont('helvetica');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      const palette = {
        brand: [56, 178, 172],
        ink: [35, 48, 65],
        slate: [100, 116, 139],
        amber: [251, 191, 36],
        soft: [246, 247, 249]
      };

      const drawHeader = (title) => {
        doc.setFillColor(...palette.brand);
        doc.rect(0, 0, pageWidth, 18, 'F');
        doc.setFontSize(12);
        doc.setTextColor(255, 255, 255);
        doc.text('The SaaS Valuation App™', margin, 11);
        if (title) {
          doc.setFontSize(10);
          doc.text(title, pageWidth - margin, 11, { align: 'right' });
        }
        doc.setTextColor(...palette.ink);
      };

      const addPage = (title) => {
        if (doc.getNumberOfPages() > 0) doc.addPage();
        drawHeader(title);
        return 28;
      };

      const sectionTitle = (text, y) => {
        doc.setFontSize(16);
        doc.setTextColor(...palette.ink);
        doc.text(text, margin, y);
        return y + 8;
      };

      const sectionSubtitle = (text, y) => {
        doc.setFontSize(10);
        doc.setTextColor(...palette.slate);
        doc.text(text, margin, y);
        doc.setTextColor(...palette.ink);
        return y + 6;
      };

      const statBand = (label, value, x, y, width, color = palette.brand) => {
        const height = 20;
        doc.setFillColor(...color);
        doc.roundedRect(x, y, width, height, 3, 3, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.text(label.toUpperCase(), x + 4, y + 8);
        doc.setFontSize(12);
        doc.text(value, x + 4, y + 16);
        doc.setTextColor(...palette.ink);
        return y + height + 4;
      };

      // Cover Page
      drawHeader('Valuation Summary');
      let yPos = 32;
      doc.setFontSize(20);
      doc.text('SaaS Valuation Report', margin, yPos);
      yPos += 10;
      doc.setFontSize(12);
      doc.setTextColor(...palette.slate);
      doc.text('Investor-ready output with clear valuation logic, usage guidance, and confidence notes tied to your inputs.', margin, yPos, { maxWidth: pageWidth - 2 * margin });
      doc.setTextColor(...palette.ink);
      yPos += 12;
      doc.setFillColor(...palette.soft);
      doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 40, 3, 3, 'F');
      doc.setDrawColor(...palette.brand);
      doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 40, 3, 3);
      const statWidth = (pageWidth - 2 * margin - 10) / 3;
      yPos = statBand('Average valuation', `$${Math.round(sanitizedData.avgValuation).toLocaleString()}`, margin + 4, yPos + 4, statWidth);
      statBand('Valuation range', `$${Math.round(sanitizedData.rangeLow).toLocaleString()} - $${Math.round(sanitizedData.rangeHigh).toLocaleString()}`, margin + statWidth + 9, yPos - 24, statWidth, palette.ink);
      statBand('Confidence', `${sanitizedData.confidence}%`, margin + 2 * statWidth + 14, yPos - 24, statWidth, palette.amber);
      yPos += 10;
      doc.setFontSize(10);
      doc.text(`Business: ${sanitizedData.companyName || 'Not specified'} • Type: ${sanitizedData.businessType} • Methods: ${sanitizedData.methods.join(', ')}`, margin, yPos);
      yPos += 6;
      doc.text(`Prepared for: ${sanitizedData.email || 'Not provided'} • Report date: ${new Date().toLocaleDateString()}`, margin, yPos);
      yPos += 10;
      doc.setTextColor(...palette.slate);
      const midpoint = Math.round((sanitizedData.rangeLow + sanitizedData.rangeHigh) / 2);
      doc.text(`Fair market value midpoint: $${midpoint.toLocaleString()} with a ${sanitizedData.confidence}% confidence score based on completeness and method alignment.`, margin, yPos, { maxWidth: pageWidth - 2 * margin });
      yPos += 8;
      doc.text('Use the low end for conservative offers, the midpoint for planning, and the high end when strategic fit or competitive tension exists.', margin, yPos, { maxWidth: pageWidth - 2 * margin });
      doc.setTextColor(...palette.ink);
      yPos += 12;

      const coverNotes = [
        ['How to Use', 'Share as an executive summary for investors, buyers, and advisors. Add diligence links and KPI definitions as appendices when sharing externally.'],
        ['Valuation Drivers', `Growth ${sanitizedData.growthYoy}% YoY, churn ${sanitizedData.customerChurn}%, and gross margin ${sanitizedData.grossMargin}% drive the applied ${sanitizedData.multiplier}x multiple.`],
        ['Interpretation', `Range captures sensitivity across methods: ${sanitizedData.methods.join(', ')}. Confidence is lower if inputs are sparse or methods diverge.`]
      ];
      doc.autoTable({
        head: [['Executive Summary']],
        body: coverNotes.map(([label, text]) => [`${label}: ${text}`]),
        startY: yPos,
        theme: 'plain',
        styles: { textColor: palette.ink, lineColor: palette.soft },
        headStyles: { fillColor: palette.brand, textColor: [255, 255, 255] },
        columnStyles: { 0: { cellWidth: pageWidth - 2 * margin } }
      });
      yPos = doc.lastAutoTable.finalY + 6;
      doc.setTextColor(...palette.slate);
      doc.text('Next steps: refresh inputs monthly, rerun scenarios with updated churn or growth, and attach supporting dashboards for investor diligence.', margin, yPos, { maxWidth: pageWidth - 2 * margin });
      doc.setTextColor(...palette.ink);

      // Valuation Details Page
      yPos = addPage('Valuation Breakdown');
      yPos = sectionTitle('Valuation Details', yPos);
      yPos = sectionSubtitle('Blend of approaches to triangulate a defensible range.', yPos);
      const valuationRows = sanitizedData.valuations.map(v => {
        const value = `$${Math.round(v.value).toLocaleString()}`;
        const insights = {
          'Revenue Multiplier': `ARR ${sanitizedData.multiplier}x shows revenue stability; churn at ${sanitizedData.customerChurn}% impacts multiple.`,
          'Income-Based': `Profit focus; margins ${sanitizedData.grossMargin}% and burn $${sanitizedData.burnRate.toLocaleString()} influence quality.`,
          'Earnings-Based': `Balances ARR and retention (${sanitizedData.retentionRate}%); higher NPS (${sanitizedData.nps}) improves confidence.`,
          DCF: `Discounts future cash at ${(sanitizedData.discountRate * 100).toFixed(2)}%; runway ${sanitizedData.runway}m and debt $${sanitizedData.debtLevel.toLocaleString()} are key.`
        };
        return [v.method, value, insights[v.method] || 'Methodology detail unavailable'];
      });
      doc.autoTable({
        head: [['Method', 'Valuation', 'Notes']],
        body: valuationRows,
        startY: yPos,
        theme: 'grid',
        headStyles: { fillColor: palette.brand, textColor: [255, 255, 255] },
        styles: { fillColor: [255, 255, 255], textColor: palette.ink, lineColor: palette.soft },
        columnStyles: { 0: { cellWidth: 45 }, 1: { cellWidth: 40 }, 2: { cellWidth: pageWidth - 2 * margin - 85 } }
      });
      yPos = doc.lastAutoTable.finalY + 8;
      doc.setFontSize(10);
      doc.setTextColor(...palette.slate);
      doc.text('Use the midpoint for planning, the low end for conservative offers, and the high end when negotiating with strategic buyers.', margin, yPos, { maxWidth: pageWidth - 2 * margin });
      yPos += 6;
      doc.text('Method alignment check: larger spreads between methods signal areas where better inputs (growth, churn, margin) can tighten confidence.', margin, yPos, { maxWidth: pageWidth - 2 * margin });
      doc.setTextColor(...palette.ink);

      // Input Summary Page
      yPos = addPage('Inputs & Assumptions');
      yPos = sectionTitle('Input Summary', yPos);
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
      doc.autoTable({
        head: [['Metric', 'Value']],
        body: inputs,
        startY: yPos,
        theme: 'striped',
        styles: { fillColor: palette.soft, textColor: palette.ink },
        headStyles: { fillColor: palette.brand, textColor: [255, 255, 255] }
      });
      yPos = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      doc.setTextColor(...palette.slate);
      doc.text('Assumptions: higher-quality data tightens the confidence band. If any inputs are estimates (e.g., churn or LTV), rerun after aligning them to system-of-record dashboards.', margin, yPos, { maxWidth: pageWidth - 2 * margin });
      yPos += 6;
      doc.text('Operational levers: growth and churn move the multiple fastest; gross margin and CAC/LTV set profitability quality; legal/IP answers reduce diligence friction.', margin, yPos, { maxWidth: pageWidth - 2 * margin });
      doc.setTextColor(...palette.ink);
      yPos += 4;

      // Metrics Overview Page
      yPos = addPage('Metrics & Health');
      yPos = sectionTitle('Key Metrics Overview', yPos);
      yPos = sectionSubtitle('Importance shows why each KPI matters; insight provides an immediate recommendation.', yPos);
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
      doc.autoTable({
        head: [['Label', 'Value', 'Importance', 'Insight']],
        body: metrics.map(m => [m.label, m.value, m.importance, m.insight]),
        startY: yPos,
        theme: 'striped',
        styles: { fillColor: palette.soft, textColor: palette.ink },
        headStyles: { fillColor: palette.brand, textColor: [255, 255, 255] },
        columnStyles: { 0: { cellWidth: 32 }, 1: { cellWidth: 35 } }
      });
      yPos = doc.lastAutoTable.finalY + 8;
      doc.setFontSize(10);
      doc.setTextColor(...palette.slate);
      doc.text('Highlight top three metrics to focus on before investor review to meaningfully improve the multiple.', margin, yPos, { maxWidth: pageWidth - 2 * margin });
      yPos += 6;
      const driverNote = sanitizedData.growthYoy > sanitizedData.customerChurn ? 'Growth outruns churn—protect this advantage with retention playbooks.' : 'Churn is outpacing growth—stabilize retention before pushing paid acquisition.';
      doc.text(`Valuation driver check: ${driverNote}`, margin, yPos, { maxWidth: pageWidth - 2 * margin });
      doc.setTextColor(...palette.ink);

      // Risk & Opportunity Page
      yPos = addPage('Risks & Upside');
      yPos = sectionTitle('Risk and Opportunity Notes', yPos);
      const riskRows = [
        ['Churn & Retention', `${sanitizedData.customerChurn}% churn; ${sanitizedData.retentionRate}% retention`, sanitizedData.customerChurn < 6 ? 'Healthy retention keeps revenue durable.' : 'Prioritize save flows and onboarding to slow churn.'],
        ['Runway', `${sanitizedData.runway} months`, sanitizedData.runway >= 12 ? 'Comfortable runway supports growth investments.' : 'Extend runway with spend discipline or new capital.'],
        ['Debt & Legal', `$${sanitizedData.debtLevel.toLocaleString()} debt; legal: ${sanitizedData.legalIssues || 'None'}`, sanitizedData.debtLevel < 100000 ? 'Low leverage risk.' : 'Reduce debt or restructure for cleaner balance sheet.'],
        ['Customer Love', `NPS ${sanitizedData.nps}; Support rating ${sanitizedData.supportRating}`, sanitizedData.nps > 50 ? 'Promoters can drive referrals and upsell.' : 'Invest in CX and proactive support.'],
        ['Technology', `${sanitizedData.proprietaryTech}; ${sanitizedData.securityCompliance}`, sanitizedData.proprietaryTech.includes('Yes') ? 'Defensible IP strengthens moat.' : 'Document IP and security posture for diligence.']
      ];
      doc.autoTable({
        head: [['Area', 'Current State', 'Recommendation']],
        body: riskRows,
        startY: yPos,
        theme: 'striped',
        styles: { fillColor: palette.soft, textColor: palette.ink },
        headStyles: { fillColor: palette.brand, textColor: [255, 255, 255] },
        columnStyles: { 0: { cellWidth: 38 }, 1: { cellWidth: 55 } }
      });
      yPos = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(10);
      doc.setTextColor(...palette.slate);
      doc.text('Risk interpretation: items flagged here typically drive diligence questions and discounting. Address the largest gaps before circulating the report externally.', margin, yPos, { maxWidth: pageWidth - 2 * margin });
      doc.setTextColor(...palette.ink);

      // Methodology Page
      yPos = addPage('Methodology');
      yPos = sectionTitle('Valuation Methodology', yPos);
      const methodology = [
        ['Revenue Multiplier', `ARR $${sanitizedData.arr.toLocaleString()} × ${sanitizedData.multiplier}x`, 'Anchored to industry multiples, adjusted for churn, growth, and market segment.'],
        ['Income-Based', `Profit $${sanitizedData.netProfit.toLocaleString()} × ${(sanitizedData.multiplier - 1).toFixed(1)}x`, 'Focuses on cash flow quality and margin durability for financial buyers.'],
        ['Earnings-Based', 'Hybrid growth & retention lens', 'Balances profitability and retention to normalize outlier inputs.'],
        ['DCF', `${(sanitizedData.discountRate * 100).toFixed(2)}% discount`, 'Projects cash flows and discounts for risk, runway, and leverage.']
      ];
      doc.autoTable({
        head: [['Approach', 'Formula / Key Inputs', 'How to Read']],
        body: methodology,
        startY: yPos,
        theme: 'grid',
        headStyles: { fillColor: palette.ink, textColor: [255, 255, 255] },
        styles: { fillColor: [255, 255, 255], textColor: palette.ink, lineColor: palette.soft }
      });
      yPos = doc.lastAutoTable.finalY + 8;
      doc.setFontSize(10);
      doc.setTextColor(...palette.slate);
      doc.text('Sensitivity: strongest drivers are ARR growth, churn, and gross margin. Updating those inputs will refresh the range.', margin, yPos, { maxWidth: pageWidth - 2 * margin });
      yPos += 6;
      doc.text('If methods diverge widely, revisit the inputs above (especially churn, CAC/LTV, and discount rate) and re-run to tighten the spread.', margin, yPos, { maxWidth: pageWidth - 2 * margin });
      doc.setTextColor(...palette.ink);

      // Graphs Pages
      const graphs = [
        { id: 'valuation-chart', title: 'Valuation by Method', desc: 'Shows valuation per selected method.' },
        { id: 'financial-chart', title: 'Financial Metrics Impact', desc: 'Highlights key financial inputs.' },
        { id: 'growth-churn-chart', title: 'Growth vs. Churn', desc: 'Compares growth and churn rates.' },
        { id: 'risk-chart', title: 'Risk Factors', desc: 'Visualizes key risk metrics.' }
      ];
      graphs.forEach((graph, index) => {
        if (index % 2 === 0) {
          yPos = addPage('Charts & Visuals');
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
        const interpretation = {
          'Valuation by Method': 'Compare bars to see how each approach pulls the range; large gaps suggest refining inputs.',
          'Financial Metrics Impact': 'Higher ARR, profit, and LTV relative to CAC lift valuation and reduce downside risk.',
          'Growth vs. Churn': 'Growth above churn indicates momentum; if churn is higher, focus on retention and onboarding.',
          'Risk Factors': 'Lower scores on legal/IP/privacy reduce diligence friction and discounting.'
        }[graph.title];
        doc.text(`${graph.desc} ${interpretation || ''}`.trim(), margin, yPos, { maxWidth: pageWidth - 2 * margin });
        yPos += 8;
        doc.addImage(imgData, 'JPEG', margin, yPos, 120, 75);
        yPos += 85;
      });

      // About & Disclaimer Page
      yPos = addPage('About & Disclaimer');
      yPos = sectionTitle('About The SaaS Valuation App™', yPos);
      doc.setFontSize(10);
      const aboutText = 'The SaaS Valuation App™ delivers transparent valuations built on industry-standard methods and auditable calculations. Every figure in this report is tied to the inputs you provided and can be refreshed as metrics change. Contact us: support@saasvaluation.app | Visit: www.saasvaluation.app';
      doc.text(doc.splitTextToSize(aboutText, pageWidth - 2 * margin), margin, yPos);
      yPos += 40;
      yPos = sectionTitle('Why Trust Us', yPos + 2);
      doc.setFontSize(10);
      const trustText = 'We follow revenue, earnings, and DCF techniques common to investors, buyers, and brokers. The logic, multipliers, and discounting choices are visible in this PDF so stakeholders can diligence assumptions quickly. Accuracy depends on the integrity of your inputs—verify them before sharing.';
      doc.text(doc.splitTextToSize(trustText, pageWidth - 2 * margin), margin, yPos);
      yPos += 30;
      yPos = sectionTitle('Disclaimer', yPos + 2);
      doc.setFontSize(10);
      const disclaimerText = 'This valuation is an estimate based on user-provided data and standard methods. It is not investment, tax, or legal advice. Consult professional advisors before acting on this report. The SaaS Valuation App™ is not liable for actions taken based on this document. Accuracy depends on the correctness and timeliness of your inputs.';
      doc.text(doc.splitTextToSize(disclaimerText, pageWidth - 2 * margin), margin, yPos);
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(...palette.slate);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
        doc.text('Confidential — generated by The SaaS Valuation App™', margin, pageHeight - 10);
        doc.setTextColor(...palette.ink);
      }

      await doc.save('saas_valuation_report.pdf', { returnPromise: true });
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('An error occurred while generating the PDF. Please try again.');
    }
  };
}

