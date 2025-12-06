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

      // Cover Page (Executive Summary)
      drawHeader('Executive Summary – Investor Ready');
      let yPos = 30;
      doc.setFontSize(20);
      doc.text('SaaS Valuation Executive Summary', margin, yPos);
      yPos += 6;
      doc.setFontSize(11);
      doc.text('Prepared by The SaaS Valuation App™', margin, yPos);

      yPos += 10;
      doc.setFillColor(...palette.soft);
      doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 42, 3, 3, 'F');
      doc.setDrawColor(...palette.brand);
      doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 42, 3, 3);
      const statWidth = (pageWidth - 2 * margin - 10) / 3;
      yPos = statBand('Fair Market Value (FMV)', `$${Math.round(sanitizedData.avgValuation).toLocaleString()}`, margin + 4, yPos + 4, statWidth);
      statBand('Expected Range', `$${Math.round(sanitizedData.rangeLow).toLocaleString()} – $${Math.round(sanitizedData.rangeHigh).toLocaleString()}`, margin + statWidth + 9, yPos - 24, statWidth, palette.ink);
      statBand('Confidence Score', `${sanitizedData.confidence}%`, margin + 2 * statWidth + 14, yPos - 24, statWidth, palette.amber);

      yPos += 8;
      doc.setFontSize(10);
      doc.text(`Business: ${sanitizedData.companyName || 'Not specified'}`, margin, yPos);
      doc.text(`Business Type: ${sanitizedData.businessType || 'Not specified'}`, pageWidth / 2, yPos);
      yPos += 5;
      doc.text(`Valuation Methods Used: ${sanitizedData.methods.join(', ') || 'Not specified'}`, margin, yPos);
      doc.text(`Report Prepared For: ${sanitizedData.email || 'Not provided'}`, pageWidth / 2, yPos);
      yPos += 5;
      doc.text(`Report Date: ${new Date().toLocaleDateString()}`, margin, yPos);
      yPos += 8;

      yPos = sectionTitle('What This Valuation Means', yPos + 2);
      doc.setFontSize(10);
      doc.setTextColor(...palette.slate);
      const meaningText = 'This report estimates the current fair market value of your SaaS business based on the financial, customer, operational, and risk inputs you provided. The valuation reflects what an informed buyer or investor would reasonably pay today under normal market conditions.';
      doc.text(doc.splitTextToSize(meaningText, pageWidth - 2 * margin), margin, yPos);
      yPos += 16;
      const rangeText = `Your business is valued at approximately $${Math.round(sanitizedData.avgValuation).toLocaleString()}, with an expected negotiation range between $${Math.round(sanitizedData.rangeLow).toLocaleString()} and $${Math.round(sanitizedData.rangeHigh).toLocaleString()}, depending on deal structure, buyer profile, and due-diligence outcomes.`;
      doc.text(doc.splitTextToSize(rangeText, pageWidth - 2 * margin), margin, yPos);
      doc.setTextColor(...palette.ink);
      yPos += 18;

      yPos = sectionTitle('How This Report Can Be Used', yPos);
      doc.setFontSize(10);
      doc.setTextColor(...palette.slate);
      const uses = [
        'Investor pitch decks & fundraising',
        'Acquisition and exit planning',
        'Partner equity negotiations',
        'Buy/sell negotiations',
        'Business planning & growth benchmarking',
        'Preparing for due diligence',
        'Internal performance tracking over time'
      ];
      uses.forEach((item, idx) => {
        doc.text(`✅ ${item}`, margin, yPos + idx * 5);
      });
      yPos += uses.length * 5 + 6;
      doc.text('Many founders update this report every 3–6 months to track value growth.', margin, yPos);
      doc.setTextColor(...palette.ink);
      yPos += 12;

      yPos = sectionTitle('What Drives Your Valuation Most', yPos);
      const drivers = [
        ['Net Profit', `$${sanitizedData.netProfit.toLocaleString()}`],
        ['Growth Rate', `${sanitizedData.growthYoy}% YoY`],
        ['Adjusted Industry Multiple', `${sanitizedData.multiplier}×`],
        ['Recurring Revenue (ARR)', `$${sanitizedData.arr.toLocaleString()}`],
        ['Customer Churn', `${sanitizedData.customerChurn}%`],
        ['Gross Margin', `${sanitizedData.grossMargin}%`]
      ];
      doc.autoTable({
        head: [['Driver', 'Current Value']],
        body: drivers,
        startY: yPos,
        theme: 'grid',
        styles: { fillColor: [255, 255, 255], textColor: palette.ink, lineColor: palette.soft },
        headStyles: { fillColor: palette.ink, textColor: [255, 255, 255] },
        margin: { left: margin, right: margin }
      });
      yPos = doc.lastAutoTable.finalY + 6;
      doc.setFontSize(10);
      doc.setTextColor(...palette.slate);
      doc.text('Improving just one or two of these KPIs can materially increase your company’s valuation.', margin, yPos);
      doc.setTextColor(...palette.ink);
      yPos += 12;

      yPos = sectionTitle('How to Interpret This Report', yPos);
      doc.setFontSize(10);
      doc.setTextColor(...palette.slate);
      const interpretLines = [
        'Use the low end of the range for conservative offers',
        'Use the midpoint for internal planning',
        'Use the high end for strategic acquisition discussions',
        'Confidence reflects the completeness of inputs, consistency between valuation methods, and quality of financial data. Higher data accuracy produces tighter valuation ranges.'
      ];
      interpretLines.forEach((line, idx) => {
        doc.text(`• ${line}`, margin, yPos + idx * 5);
      });
      doc.setTextColor(...palette.ink);

      // Valuation Details Page
      yPos = addPage('Valuation Breakdown & Interpretation');
      yPos = sectionTitle('Valuation Breakdown & Interpretation', yPos);
      yPos = sectionSubtitle('This valuation uses a multi-method framework to triangulate a defensible market range rather than relying on a single formula.', yPos);
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
        head: [['Method', 'Valuation', 'Interpretation']],
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
      const breakdownGuidance = [
        'Conservative buyers rely heavily on income-based valuation.',
        'Strategic buyers may exceed this range if strong synergies exist.',
        'This blended output reflects real-world M&A behavior.'
      ];
      breakdownGuidance.forEach((line, idx) => {
        doc.text(`• ${line}`, margin, yPos + idx * 5);
      });
      doc.setTextColor(...palette.ink);

      // Input Summary Page
      yPos = addPage('Inputs & Assumptions');
      yPos = sectionTitle('Input Summary', yPos);
      doc.setFontSize(10);
      doc.setTextColor(...palette.slate);
      const inputsIntro = 'This valuation is calculated using the operational, financial, customer, and technical inputs supplied by the business owner. These inputs directly affect both valuation outcome and investor risk perception. Any changes to these figures will result in a new valuation.';
      doc.text(doc.splitTextToSize(inputsIntro, pageWidth - 2 * margin), margin, yPos);
      doc.setTextColor(...palette.ink);
      yPos += 14;
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
      yPos = doc.lastAutoTable.finalY + 6;
      doc.setFontSize(10);
      doc.setTextColor(...palette.slate);
      doc.text('⚠️ Important: Missing compliance, infrastructure, or product-market fit signals reduce attainable valuation multiples during due diligence.', margin, yPos, { maxWidth: pageWidth - 2 * margin });
      doc.setTextColor(...palette.ink);
      yPos += 10;

      // Metrics Overview Page
      yPos = addPage('Metrics & Health');
      yPos = sectionTitle('Key Metrics & Health', yPos);
      yPos = sectionTitle('Why These Metrics Matter to Buyers', yPos);
      doc.setFontSize(10);
      doc.setTextColor(...palette.slate);
      const metricContext = [
        'Revenue sustainability',
        'Customer quality',
        'Growth efficiency',
        'Risk profile',
        'Operational scalability'
      ];
      metricContext.forEach((line, idx) => {
        doc.text(`• ${line}`, margin, yPos + idx * 5);
      });
      yPos += metricContext.length * 5 + 6;
      doc.text('These metrics directly determine valuation multiples, deal structure, and earn-out terms.', margin, yPos);
      doc.setTextColor(...palette.ink);
      yPos += 8;
      yPos = sectionSubtitle('Importance shows why each KPI matters; insight provides an immediate recommendation.', yPos);
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
      doc.setTextColor(...palette.ink);
      yPos += 6;
      doc.setFontSize(10);
      doc.setTextColor(...palette.slate);
      doc.text('🎯 Investor Priority Metrics: ARR Growth, Net Profit Margin, Customer Retention', margin, yPos);
      yPos += 5;
      doc.text('Improving these three metrics typically produces the fastest valuation uplift.', margin, yPos);
      doc.setTextColor(...palette.ink);

      // Risk & Opportunity Page
      yPos = addPage('Risks & Upside');
      yPos = sectionTitle('Risk & Upside Assessment', yPos);
      doc.setFontSize(10);
      doc.setTextColor(...palette.slate);
      const riskIntro = 'This section highlights factors that most influence valuation discounts or acquisition premiums during due diligence. Each risk listed below directly impacts buyer confidence and deal structure.';
      doc.text(doc.splitTextToSize(riskIntro, pageWidth - 2 * margin), margin, yPos);
      doc.setTextColor(...palette.ink);
      yPos += 12;
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
      yPos = doc.lastAutoTable.finalY + 8;
      doc.setFontSize(10);
      doc.setTextColor(...palette.slate);
      doc.text('Businesses with low debt, documented IP, and strong retention command materially higher exit multiples.', margin, yPos, { maxWidth: pageWidth - 2 * margin });
      doc.setTextColor(...palette.ink);
      yPos += 6;

      // Methodology Page
      yPos = addPage('Methodology');
      yPos = sectionTitle('Valuation Methodology Overview', yPos);
      doc.setFontSize(10);
      doc.setTextColor(...palette.slate);
      const methodologyIntro = 'This valuation applies industry-standard financial models used by private equity firms, venture investors, and strategic acquirers. Each method isolates a different risk-return profile and is blended into a defensible final range.';
      doc.text(doc.splitTextToSize(methodologyIntro, pageWidth - 2 * margin), margin, yPos);
      doc.setTextColor(...palette.ink);
      yPos += 12;
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
      doc.text('Sensitivity analysis shows that ARR growth, churn rate, and gross margin have the largest impact on valuation.', margin, yPos, { maxWidth: pageWidth - 2 * margin });
      doc.setTextColor(...palette.ink);

      // Graphs Pages
      const graphs = [
        { id: 'valuation-chart', title: 'Valuation by Method', desc: 'Visual comparison of outputs across selected valuation frameworks.' },
        { id: 'financial-chart', title: 'Financial Metrics Impact', desc: 'Highlights which financial inputs contribute most to value formation.' },
        { id: 'growth-churn-chart', title: 'Growth vs. Churn', desc: 'Demonstrates revenue momentum versus customer loss pressure.' },
        { id: 'risk-chart', title: 'Risk Factors', desc: 'Visual risk profile used during early-stage due diligence.' }
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
        doc.text(graph.desc, margin, yPos);
        yPos += 8;
        doc.addImage(imgData, 'JPEG', margin, yPos, 120, 75);
        yPos += 85;
      });

      // About & Disclaimer Page
      yPos = addPage('About & Disclaimer');
      yPos = sectionTitle('About The SaaS Valuation App™', yPos);
      doc.setFontSize(10);
      const aboutText = 'The SaaS Valuation App™ empowers businesses with AI-driven, transparent valuations. We value honest opinions and real calculations to help investors, partners, and buyers make informed decisions without speculation. Our mission is to deliver accurate, data-driven insights based on your inputs. Contact us: support@saasvaluation.app | Visit: www.saasvaluation.app';
      doc.text(doc.splitTextToSize(aboutText, pageWidth - 2 * margin), margin, yPos);
      yPos += 36;
      yPos = sectionTitle('Why Founders Trust The SaaS Valuation App™', yPos + 2);
      doc.setFontSize(10);
      doc.setTextColor(...palette.slate);
      const trustBullets = [
        'Industry-standard valuation models',
        'Transparent, formula-driven calculations',
        'No speculative hype or artificial inflation',
        'Designed specifically for SaaS founders, operators, and investors',
        'Updated continuously to reflect real market conditions'
      ];
      trustBullets.forEach((line, idx) => {
        doc.text(`• ${line}`, margin, yPos + idx * 5);
      });
      doc.setTextColor(...palette.ink);
      yPos += trustBullets.length * 5 + 10;
      yPos = sectionTitle('Disclaimer', yPos);
      doc.setFontSize(10);
      const disclaimerText = 'This valuation is an estimate based on user-provided data and standard methods. It is not financial advice. Consult a professional advisor for business decisions. The SaaS Valuation App™ is not liable for actions taken based on this report. Accuracy depends on the correctness of your inputs.';
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

