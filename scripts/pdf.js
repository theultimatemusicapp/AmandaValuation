const config = {
  stageThresholds: { earlyARR: 50000, midARR: 500000 },
  confidenceWeights: { data: 0.3, methods: 0.25, revenue: 0.2, legal: 0.15, market: 0.1 },
  marketMultiples: {
    'Generic SaaS': { low: 1.5, high: 4 },
    'Education Tech': { low: 2, high: 6 },
    'Fintech SaaS': { low: 3, high: 8 },
    'Developer Tools': { low: 3, high: 7 },
    Other: { low: 1, high: 3.5 }
  }
};

const REVALUATION_COUPON_CODE = 'sasvalcoup26x92f';

export async function generateValuationPdf(data, options = {}) {
  const {
    save = true,
    filename = 'saas_valuation_report.pdf',
    includeCoupon = true
  } = options;
  try {
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) {
      throw new Error('PDF library not loaded. Please generate a valuation first.');
    }
    const { applyPlugin } = await import('./vendor/jspdf.plugin.autotable.js');
    applyPlugin(jsPDF);
    const domPurifyModule = await import('./vendor/purify.es.min.js');
    const DOMPurify = domPurifyModule.default || domPurifyModule;
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

      const formatCurrency = (value = 0) => {
        const numeric = Number(value) || 0;
        const absVal = Math.abs(numeric);
        if (absVal < 10) return `$${numeric.toFixed(2)}`;
        return `$${Math.round(numeric).toLocaleString()}`;
      };

      const formatPercent = (value = 0, decimals = 1) => `${(Number(value) || 0).toFixed(decimals)}%`;

      const inferStage = () => {
        if (sanitizedData.arr < config.stageThresholds.earlyARR) return 'early-stage';
        if (sanitizedData.arr < config.stageThresholds.midARR) return 'mid-stage';
        return 'later-stage';
      };

      const inferProfitProfile = () => {
        if (sanitizedData.netProfit > 0) return 'profitable';
        if (Math.abs(sanitizedData.netProfit) < sanitizedData.arr * 0.05) return 'breakeven';
        return 'loss-making';
      };

      const inferBuyerProfiles = () => {
        const profiles = [];
        const teamSize = sanitizedData.fte || sanitizedData.keyStaff || 0;
        if (sanitizedData.netProfit > 0 && sanitizedData.arr <= 200000 && teamSize <= 3) {
          profiles.push('Indie founder / solo SaaS buyer');
        }
        if (sanitizedData.arr >= 200000 && sanitizedData.growthYoy >= 20) {
          profiles.push('Micro-PE / roll-up fund');
        }
        if (sanitizedData.businessType) {
          profiles.push(`Strategic buyer in ${sanitizedData.businessType}`);
        }
        if ((sanitizedData.burnRate < 0 || sanitizedData.netProfit <= 0) && sanitizedData.growthYoy >= 20) {
          profiles.push('Growth investor / angel backing further scale rather than immediate acquisition');
        }
        return profiles.slice(0, 3);
      };

      const buildScenarios = () => {
        const optimisticGrowth = Math.min(sanitizedData.growthYoy + 20, 100);
        const conservativeGrowth = Math.max(sanitizedData.growthYoy - 10, 0);
        return [
          {
            label: 'Current',
            ARR: sanitizedData.arr,
            yoyGrowth: sanitizedData.growthYoy,
            churn: sanitizedData.customerChurn,
            valuation: sanitizedData.avgValuation
          },
          {
            label: 'Optimistic (12–18 months)',
            ARR: sanitizedData.arr * 2,
            yoyGrowth: optimisticGrowth,
            churn: Math.max(sanitizedData.customerChurn - 1, 0),
            valuation: sanitizedData.avgValuation * 2.5
          },
          {
            label: 'Conservative',
            ARR: sanitizedData.arr * 0.75,
            yoyGrowth: conservativeGrowth,
            churn: sanitizedData.customerChurn + 2,
            valuation: sanitizedData.avgValuation * 0.7
          }
        ];
      };

      const buildUpliftActions = () => {
        const actions = [];
        if (sanitizedData.customerChurn > 5) {
          actions.push({
            area: 'Churn & Retention',
            action: 'Implement onboarding emails, check-in sequences, and cancellation surveys to reduce churn by 1–2 points.',
            impact: 'Even a 1% churn improvement can support a higher revenue multiple.'
          });
        }
        if (sanitizedData.runway < 6 && sanitizedData.netProfit <= 0) {
          actions.push({
            area: 'Runway',
            action: 'Cut non-essential spend and test pricing increases or annual plans to extend runway beyond 9–12 months.',
            impact: 'Longer runway reduces buyer discounting and improves negotiating leverage.'
          });
        }
        if (sanitizedData.cac === 0 && sanitizedData.arr > 0) {
          actions.push({
            area: 'Tracking CAC',
            action: 'Start tracking CAC accurately across paid, organic, and referral channels.',
            impact: 'Credible CAC/LTV numbers increase buyer confidence in your growth engine.'
          });
        }
        if (sanitizedData.arr < 3000 && sanitizedData.growthYoy > 20) {
          actions.push({
            area: 'Revenue Scale',
            action: 'Prioritize converting free users to paid and test simple upgrade paths to lift ARR.',
            impact: 'Crossing ARR bands opens up different buyer profiles.'
          });
        }
        if (sanitizedData.grossMargin < 60) {
          actions.push({
            area: 'Margin Efficiency',
            action: 'Renegotiate hosting, streamline support workflows, or re-price low-margin plans.',
            impact: 'Improving gross margin expands profit-based valuations.'
          });
        }
        return actions.slice(0, 5);
      };

      const findMarketMultiple = () => {
        const type = sanitizedData.businessType || 'Generic SaaS';
        if (type.toLowerCase().includes('edu')) return { ...config.marketMultiples['Education Tech'], label: 'Education Tech' };
        if (type.toLowerCase().includes('fin')) return { ...config.marketMultiples['Fintech SaaS'], label: 'Fintech SaaS' };
        if (type.toLowerCase().includes('dev')) return { ...config.marketMultiples['Developer Tools'], label: 'Developer Tools' };
        return { ...config.marketMultiples['Generic SaaS'], label: 'Generic SaaS' };
      };

      const computeConfidenceBreakdown = () => {
        let dataCompleteness = 100;
        const criticalFields = [sanitizedData.arr, sanitizedData.customerChurn, sanitizedData.cac, sanitizedData.ltv, sanitizedData.runway, sanitizedData.netProfit];
        criticalFields.forEach(val => {
          if (!val || Number.isNaN(val)) dataCompleteness -= 10;
        });

        let methodAlignment = 70;
        if (sanitizedData.valuations.length > 1) {
          const values = sanitizedData.valuations.map(v => v.value);
          const spread = Math.max(...values) - Math.min(...values);
          const midpoint = sanitizedData.avgValuation || 1;
          const ratio = midpoint ? (spread / midpoint) * 100 : 0;
          methodAlignment = ratio < 30 ? 90 : ratio < 60 ? 75 : 60;
        }

        let revenueQuality = 70;
        if (sanitizedData.grossMargin > 70 && sanitizedData.customerChurn < 5) revenueQuality = 90;
        else if (sanitizedData.grossMargin > 60 && sanitizedData.customerChurn < 8) revenueQuality = 80;
        else revenueQuality = 65;

        const legalClarity = sanitizedData.legalIssues === 'none' && sanitizedData.ipOwnership === 'fully-owned' && sanitizedData.dataPrivacy === 'full' ? 85 : 65;
        const marketStability = 75;

        const overall = Math.round(
          config.confidenceWeights.data * dataCompleteness +
          config.confidenceWeights.methods * methodAlignment +
          config.confidenceWeights.revenue * revenueQuality +
          config.confidenceWeights.legal * legalClarity +
          config.confidenceWeights.market * marketStability
        );

        return { dataCompleteness, methodAlignment, revenueQuality, legalClarity, marketStability, overall };
      };

      const buildExitAssessment = () => {
        let sellableToday = 'Moderate';
        let fundableToday = 'Moderate';
        let strategicAppeal = 'Moderate';
        const notes = [];

        if (sanitizedData.arr < 24000 && sanitizedData.netProfit <= 0) {
          sellableToday = 'Low';
          fundableToday = 'Low';
          notes.push('Low revenue and negative profit reduce immediate saleability.');
        }
        if (sanitizedData.arr >= 24000 && sanitizedData.netProfit > 0) {
          sellableToday = 'Moderate';
          notes.push('Profitable with initial scale supports modest sale options.');
        }
        if (sanitizedData.arr >= 100000 && sanitizedData.growthYoy >= 20) {
          sellableToday = 'High';
          fundableToday = 'High';
          notes.push('Growth above 20% and six-figure ARR attract more bidders.');
        }
        if (sanitizedData.businessType && sanitizedData.retentionRate >= 80) {
          strategicAppeal = 'High';
          notes.push('High retention in a niche category increases strategic appeal.');
        }
        return { sellableToday, fundableToday, strategicAppeal, notes };
      };

      const buildInputWarnings = () => {
        const warnings = [];
        if (sanitizedData.cac === 0 && sanitizedData.arr > 0) {
          warnings.push('CAC is set to $0. Unless all customers are purely organic or referral, this is likely under-reported and may reduce buyer trust.');
        }
        if (sanitizedData.ownerSalary === 0 && sanitizedData.netProfit > 0) {
          warnings.push('Owner salary is set to $0. Buyers will adjust profit downward to reflect a market-rate founder salary.');
        }
        if (sanitizedData.runway < 3 && sanitizedData.burnRate > 0) {
          warnings.push('Runway under 3 months with positive burn suggests urgent funding needs.');
        }
        if (sanitizedData.ltv < sanitizedData.cac && sanitizedData.ltv > 0 && sanitizedData.cac > 0) {
          warnings.push('LTV is lower than CAC, indicating unprofitable acquisition economics.');
        }
        if (sanitizedData.ltv > 0 && sanitizedData.arr > 0 && sanitizedData.ltv < sanitizedData.arr * 0.0001) {
          warnings.push('LTV appears extremely low relative to revenue; revisit pricing, retention, or data quality.');
        }
        return warnings;
      };

      const stage = inferStage();
      const profitProfile = inferProfitProfile();
      const buyerProfiles = inferBuyerProfiles();
      const scenarios = buildScenarios();
      const upliftActions = buildUpliftActions();
      const marketRange = findMarketMultiple();
      const confidenceBreakdown = computeConfidenceBreakdown();
      const exitAssessment = buildExitAssessment();
      const inputWarnings = buildInputWarnings();
      const methodsUsed = sanitizedData.valuations.map(v => v.method);
      const displayedMethods = methodsUsed.length ? methodsUsed : sanitizedData.methods;
      const headlineMethod = methodsUsed[0] || displayedMethods[0] || 'Selected methods';
      const methodList = displayedMethods.length ? displayedMethods.join(', ') : 'None selected';

      const doc = new jsPDF({ compress: true });
      doc.setProperties({
        title: 'SaaS Valuation Report',
        subject: 'Investor-ready valuation summary',
        creator: 'The SaaS Valuation App™'
      });
      if (typeof doc.autoTable !== 'function') {
        console.error('jsPDF autoTable plugin failed to initialize');
        throw new Error('Failed to initialize table plugin. Please refresh and try again.');
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

      const sectionTitle = (text, y, options = {}) => {
        const topGap = options.topGap ?? 6;
        const bottomGap = options.bottomGap ?? 8;
        const nextY = y + topGap;
        doc.setFontSize(16);
        doc.setTextColor(...palette.ink);
        doc.text(text, margin, nextY);
        return nextY + bottomGap;
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
      yPos = statBand('Average valuation', formatCurrency(sanitizedData.avgValuation), margin + 4, yPos + 4, statWidth);
      statBand('Valuation range', `${formatCurrency(sanitizedData.rangeLow)} - ${formatCurrency(sanitizedData.rangeHigh)}`, margin + statWidth + 9, yPos - 24, statWidth, palette.ink);
      statBand('Confidence', formatPercent(sanitizedData.confidence, 0), margin + 2 * statWidth + 14, yPos - 24, statWidth, palette.amber);
      yPos += 10;
      doc.setFontSize(10);
      doc.text(`Business: ${sanitizedData.companyName || 'Not specified'} • Type: ${sanitizedData.businessType} • Methods: ${methodList}`, margin, yPos);
      yPos += 6;
      doc.text(`Prepared for: ${sanitizedData.email || 'Not provided'} • Report date: ${new Date().toLocaleDateString()}`, margin, yPos);
      yPos += 10;
      doc.setTextColor(...palette.slate);
      const midpoint = Math.round((sanitizedData.rangeLow + sanitizedData.rangeHigh) / 2);
      doc.text(`Fair market value midpoint: ${formatCurrency(midpoint)} with an ${formatPercent(sanitizedData.confidence, 0)} confidence score based on completeness and method alignment.`, margin, yPos, { maxWidth: pageWidth - 2 * margin });
      yPos += 8;
      doc.text(`Headline metrics: ARR ${formatCurrency(sanitizedData.arr)} • YoY growth ${formatPercent(sanitizedData.growthYoy)} • Customer churn ${formatPercent(sanitizedData.customerChurn)} • Runway ${sanitizedData.runway} months`, margin, yPos, { maxWidth: pageWidth - 2 * margin });
      yPos += 8;
      doc.text(`Why this valuation? This valuation is primarily driven by ARR of ${formatCurrency(sanitizedData.arr)}, growth of ${formatPercent(sanitizedData.growthYoy)}, churn of ${formatPercent(sanitizedData.customerChurn)}, and gross margin of ${formatPercent(sanitizedData.grossMargin)}. The applied multiple of ${sanitizedData.multiplier}× reflects ${stage} SaaS with ${profitProfile} economics.`, margin, yPos, { maxWidth: pageWidth - 2 * margin });
      yPos += 8;
      doc.text(`Headline figure derived from ${headlineMethod}; Revenue Multiple context is provided as market reference even when income-based methods dominate.`, margin, yPos, { maxWidth: pageWidth - 2 * margin });
      yPos += 10;
      doc.text('How to use this report:', margin, yPos);
      yPos += 6;
      const howToUse = [
        'Use the low end of the range for conservative offers or distressed sales.',
        'Use the midpoint for internal planning, investor conversations, and goal-setting.',
        'Use the high end where there is strong strategic fit, competitive tension, or unique assets (brand, IP, distribution).'
      ];
      howToUse.forEach(line => {
        doc.text(`• ${line}`, margin + 2, yPos, { maxWidth: pageWidth - 2 * margin });
        yPos += 5;
      });
      doc.setTextColor(...palette.ink);
      yPos += 6;

      doc.autoTable({
        head: [['Executive Summary']],
        body: [
          [`Valuation drivers: Growth ${formatPercent(sanitizedData.growthYoy)} YoY, churn ${formatPercent(sanitizedData.customerChurn)}, gross margin ${formatPercent(sanitizedData.grossMargin)}, applied multiple ${sanitizedData.multiplier}x.`],
          [`Interpretation: Range captures sensitivity across methods (${methodList}). Confidence dips if inputs are sparse or methods diverge.`],
          ['Next steps: Refresh inputs monthly, rerun scenarios with updated churn or growth, and attach supporting dashboards for investor diligence.']
        ],
        startY: yPos,
        theme: 'plain',
        styles: { textColor: palette.ink, lineColor: palette.soft },
        headStyles: { fillColor: palette.brand, textColor: [255, 255, 255] },
        columnStyles: { 0: { cellWidth: pageWidth - 2 * margin } }
      });
      yPos = doc.lastAutoTable.finalY + 6;

      // Strategic Context Page
      yPos = addPage('Strategic Context');
      yPos = sectionTitle('Best-Fit Buyer Profiles', yPos);
      yPos = sectionSubtitle('Profiles most likely to value your current stage and metrics.', yPos);
      doc.setFontSize(10);
      const profiles = buyerProfiles.length ? buyerProfiles : ['General financial buyers'];
      profiles.forEach(profile => {
        doc.text(`• ${profile}`, margin, yPos, { maxWidth: pageWidth - 2 * margin });
        yPos += 5;
      });
      doc.text('These buyer types are most likely to value your current metrics and stage. Tailor outreach and positioning to their priorities (profitability for financial buyers vs. user base and product fit for strategic acquirers).', margin, yPos, { maxWidth: pageWidth - 2 * margin });
      yPos += 10;

      yPos = sectionTitle('Valuation Sensitivity Scenarios', yPos);
      yPos = sectionSubtitle('Current, optimistic, and conservative cases using the same methods to show upside/downside.', yPos);
      doc.autoTable({
        head: [['Scenario', 'ARR', 'YoY Growth', 'Customer Churn', 'Estimated Valuation']],
        body: scenarios.map(s => [
          s.label,
          formatCurrency(s.ARR),
          formatPercent(s.yoyGrowth),
          formatPercent(s.churn),
          formatCurrency(s.valuation)
        ]),
        startY: yPos,
        theme: 'striped',
        styles: { fillColor: palette.soft, textColor: palette.ink, cellPadding: 3, overflow: 'linebreak' },
        headStyles: { fillColor: palette.brand, textColor: [255, 255, 255] }
      });
      yPos = doc.lastAutoTable.finalY + 6;
      doc.setTextColor(...palette.slate);
      doc.text('Scenarios use the same valuation logic to illustrate upside and downside paths. Adjust growth, churn, and ARR to see how the range shifts.', margin, yPos, { maxWidth: pageWidth - 2 * margin });
      doc.setTextColor(...palette.ink);
      yPos += 12;

      yPos = sectionTitle('90-Day Valuation Uplift Plan', yPos);
      yPos = sectionSubtitle('Targeted actions to tighten diligence responses and lift the multiple.', yPos);
      if (upliftActions.length > 1) {
        doc.autoTable({
          head: [['Area', 'Action', 'Impact']],
          body: upliftActions.map(item => [item.area, item.action, item.impact]),
          startY: yPos,
          theme: 'grid',
          headStyles: { fillColor: palette.ink, textColor: [255, 255, 255] },
          styles: { fillColor: [255, 255, 255], textColor: palette.ink, lineColor: palette.soft, cellPadding: 3, overflow: 'linebreak' },
          columnStyles: { 0: { cellWidth: 32 }, 1: { cellWidth: 70 }, 2: { cellWidth: pageWidth - 2 * margin - 102 } }
        });
        yPos = doc.lastAutoTable.finalY + 6;
      } else if (upliftActions.length === 1) {
        const solo = upliftActions[0];
        doc.setFontSize(10);
        doc.text(`• ${solo.area}: ${solo.action}`, margin, yPos, { maxWidth: pageWidth - 2 * margin });
        yPos += 6;
        doc.text(`Impact: ${solo.impact}`, margin + 6, yPos, { maxWidth: pageWidth - 2 * margin });
        yPos += 6;
      } else {
        doc.setFontSize(10);
        doc.text('No major uplift actions detected for the next 90 days. Maintain steady growth and refresh inputs monthly.', margin, yPos, { maxWidth: pageWidth - 2 * margin });
        yPos += 6;
      }
      doc.setTextColor(...palette.slate);
      doc.text('Focus on the top 3–5 actions with the biggest gap to improve buyer confidence before outreach.', margin, yPos, { maxWidth: pageWidth - 2 * margin });
      doc.setTextColor(...palette.ink);

      // Valuation Details Page
      yPos = addPage('Valuation Breakdown');
      yPos = sectionTitle('Valuation Details', yPos);
      yPos = sectionSubtitle('Blend of approaches to triangulate a defensible range.', yPos);
      const valuationRows = sanitizedData.valuations.map(v => {
        const value = formatCurrency(v.value);
        const insights = {
          'Revenue Multiplier': `ARR ${sanitizedData.multiplier}x shows revenue stability; churn at ${formatPercent(sanitizedData.customerChurn)} impacts multiple.`,
          'Income-Based': `Profit focus; margins ${formatPercent(sanitizedData.grossMargin)} and burn ${formatCurrency(sanitizedData.burnRate)} influence quality.`,
          'Earnings-Based': `Balances ARR and retention (${formatPercent(sanitizedData.retentionRate, 0)}); higher NPS (${sanitizedData.nps}) improves confidence.`,
          DCF: `Discounts future cash at ${formatPercent(sanitizedData.discountRate * 100, 2)}; runway ${sanitizedData.runway}m and debt ${formatCurrency(sanitizedData.debtLevel)} are key.`
        };
        return [v.method, value, insights[v.method] || 'Methodology detail unavailable'];
      });
      doc.autoTable({
        head: [['Method', 'Valuation', 'Notes']],
        body: valuationRows,
        startY: yPos,
        theme: 'grid',
        headStyles: { fillColor: palette.brand, textColor: [255, 255, 255] },
        styles: { fillColor: [255, 255, 255], textColor: palette.ink, lineColor: palette.soft, cellPadding: 3, overflow: 'linebreak' },
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
        ['Valuation Methods', methodList],
        ['Business Type', sanitizedData.businessType],
        ['Industry Multiplier', sanitizedData.baseMultiplier],
        ['Adjusted Multiplier', sanitizedData.multiplier],
        ['ARR', formatCurrency(sanitizedData.arr)],
        ['MRR', formatCurrency(sanitizedData.mrr)],
        ['Net Profit', formatCurrency(sanitizedData.netProfit)],
        ['YoY Growth', formatPercent(sanitizedData.growthYoy)],
        ['MoM Growth', formatPercent(sanitizedData.revenueGrowthMom)],
        ['Customer Churn', formatPercent(sanitizedData.customerChurn)],
        ['Revenue Churn', formatPercent(sanitizedData.revenueChurn)],
        ['Retention Rate', formatPercent(sanitizedData.retentionRate)],
        ['NPS', sanitizedData.nps],
        ['Gross Margin', formatPercent(sanitizedData.grossMargin)],
        ['CAC', formatCurrency(sanitizedData.cac)],
        ['LTV', formatCurrency(sanitizedData.ltv)],
        ['Burn Rate', formatCurrency(sanitizedData.burnRate)],
        ['Runway', `${sanitizedData.runway} months`],
        ['Owner Salary', formatCurrency(sanitizedData.ownerSalary)],
        ['Average Employee Salary', formatCurrency(sanitizedData.averageSalary)],
        ['Employee Benefits', formatCurrency(sanitizedData.employeeBenefits)],
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
        ['Contract Value', formatCurrency(sanitizedData.contractValue)],
        ['Vendor Lock-in', sanitizedData.vendorLockin],
        ['Legal Issues', sanitizedData.legalIssues],
        ['IP Ownership', sanitizedData.ipOwnership],
        ['Data Privacy', sanitizedData.dataPrivacy],
        ['Cyber Insurance', sanitizedData.cyberInsurance],
        ['Debt Level', formatCurrency(sanitizedData.debtLevel)],
        ['Discount Rate', formatPercent(sanitizedData.discountRate * 100, 2)],
        ['Rule of 40', sanitizedData.ruleOf40]
      ];
      doc.autoTable({
        head: [['Metric', 'Value']],
        body: inputs,
        startY: yPos,
        theme: 'striped',
        styles: { fillColor: palette.soft, textColor: palette.ink, cellPadding: 3, overflow: 'linebreak' },
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
      const ltvToCac = sanitizedData.cac ? sanitizedData.ltv / sanitizedData.cac : 0;
      // Each metric now includes an "importance" explanation to show why it matters.
      const metrics = [
        {
          label: 'ARR',
          value: formatCurrency(sanitizedData.arr),
          importance: 'Shows recurring revenue baseline.',
          insight: sanitizedData.arr > 1000000 ? 'Strong revenue base.' : 'Grow revenue to boost value.'
        },
        {
          label: 'MRR',
          value: formatCurrency(sanitizedData.mrr),
          importance: 'Highlights monthly revenue consistency.',
          insight: sanitizedData.mrr > 100000 ? 'Stable monthly income.' : 'Increase subscriptions.'
        },
        {
          label: 'LTV',
          value: formatCurrency(sanitizedData.ltv),
          importance: 'Indicates lifetime revenue per customer.',
          insight: sanitizedData.ltv < 10
            ? 'Low lifetime value; focus on pricing and retention.'
            : ltvToCac >= 3
              ? 'Strong lifetime value supports valuation.'
              : 'Healthy lifetime value with room to improve retention.'
        },
        {
          label: 'CAC',
          value: formatCurrency(sanitizedData.cac),
          importance: 'Reveals cost to acquire customers.',
          insight: ltvToCac >= 3 ? 'Efficient acquisition relative to LTV.' : 'Reduce CAC or lift LTV to improve payback.'
        },
        {
          label: 'Gross Margin',
          value: formatPercent(sanitizedData.grossMargin),
          importance: 'Reflects operational efficiency.',
          insight: sanitizedData.grossMargin > 70 ? 'Efficient operations.' : 'Optimize costs to defend margins.'
        },
        {
          label: 'Net Profit',
          value: formatCurrency(sanitizedData.netProfit),
          importance: 'Measures profitability.',
          insight: sanitizedData.netProfit > 0 ? 'Profitable business.' : 'Focus on profitability and cash discipline.'
        },
        {
          label: 'Burn Rate',
          value: formatCurrency(sanitizedData.burnRate),
          importance: 'Tracks cash consumption rate.',
          insight: sanitizedData.burnRate < sanitizedData.mrr ? 'Sustainable spending.' : 'Reduce expenses.'
        },
        {
          label: 'Runway',
          value: `${sanitizedData.runway} months`,
          importance: 'Estimates months before cash runs out.',
          insight: sanitizedData.runway > 12 ? 'Long-term stability.' : 'Secure funding or extend runway.'
        },
        {
          label: 'Owner Salary',
          value: formatCurrency(sanitizedData.ownerSalary),
          importance: 'Shows owner compensation excluded from profit.',
          insight: sanitizedData.ownerSalary > 0 ? 'Track SDE adjustments.' : 'Enter salary for clarity.'
        },
        {
          label: 'Average Employee Salary',
          value: formatCurrency(sanitizedData.averageSalary),
          importance: 'Highlights staff cost structure.',
          insight: sanitizedData.averageSalary > 0 ? 'Competitive pay scale.' : 'Benchmark salaries.'
        },
        {
          label: 'Employee Benefits',
          value: formatCurrency(sanitizedData.employeeBenefits),
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
          value: formatPercent(sanitizedData.growthYoy),
          importance: 'Shows annual revenue momentum.',
          insight: sanitizedData.growthYoy > 20 ? 'Strong growth.' : 'Accelerate revenue growth.'
        },
        {
          label: 'Customer Churn',
          value: formatPercent(sanitizedData.customerChurn),
          importance: 'Captures customer loss rate.',
          insight: sanitizedData.customerChurn < 5 ? 'Loyal customers.' : 'Improve retention to protect ARR.'
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
          value: formatCurrency(sanitizedData.debtLevel),
          importance: 'Assesses financial risk.',
          insight: sanitizedData.debtLevel < 100000 ? 'Low financial risk.' : 'Reduce debt.'
        }
      ];
      doc.autoTable({
        head: [['Label', 'Value', 'Importance', 'Insight']],
        body: metrics.map(m => [m.label, m.value, m.importance, m.insight]),
        startY: yPos,
        theme: 'striped',
        styles: { fillColor: palette.soft, textColor: palette.ink, cellPadding: 3, overflow: 'linebreak' },
        headStyles: { fillColor: palette.brand, textColor: [255, 255, 255] },
        columnStyles: { 0: { cellWidth: 32 }, 1: { cellWidth: 35 }, 2: { cellWidth: 40 }, 3: { cellWidth: pageWidth - 2 * margin - 107 } }
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
        ['Churn & Retention', `${formatPercent(sanitizedData.customerChurn)} churn; ${formatPercent(sanitizedData.retentionRate)} retention`, sanitizedData.customerChurn < 6 ? 'Healthy retention keeps revenue durable.' : 'Prioritize save flows and onboarding to slow churn.'],
        ['Runway', `${sanitizedData.runway} months`, sanitizedData.runway >= 12 ? 'Comfortable runway supports growth investments.' : 'Extend runway with spend discipline or new capital.'],
        ['Debt & Legal', `${formatCurrency(sanitizedData.debtLevel)} debt; legal: ${sanitizedData.legalIssues || 'None'}`, sanitizedData.debtLevel < 100000 ? 'Low leverage risk.' : 'Reduce debt or restructure for cleaner balance sheet.'],
        ['Customer Love', `NPS ${sanitizedData.nps}; Support rating ${sanitizedData.supportRating}`, sanitizedData.nps > 50 ? 'Promoters can drive referrals and upsell.' : 'Invest in CX and proactive support.'],
        ['Technology', `${sanitizedData.proprietaryTech}; ${sanitizedData.securityCompliance}`, sanitizedData.proprietaryTech.includes('Yes') ? 'Defensible IP strengthens moat.' : 'Document IP and security posture for diligence.']
      ];
      doc.autoTable({
        head: [['Area', 'Current State', 'Recommendation']],
        body: riskRows,
        startY: yPos,
        theme: 'striped',
        styles: { fillColor: palette.soft, textColor: palette.ink, cellPadding: 3, overflow: 'linebreak' },
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
      yPos = sectionSubtitle('Shows only the approaches used to compute this report.', yPos);
      const methodologyBase = [
        ['Revenue Multiplier', `ARR ${formatCurrency(sanitizedData.arr)} × ${sanitizedData.multiplier}x`, 'Anchored to industry multiples, adjusted for churn, growth, and market segment.'],
        ['Income-Based', `Profit ${formatCurrency(sanitizedData.netProfit)} × ${(sanitizedData.multiplier - 1).toFixed(1)}x`, 'Focuses on cash flow quality and margin durability for financial buyers.'],
        ['Earnings-Based', 'Hybrid growth & retention lens', 'Balances profitability and retention to normalize outlier inputs.'],
        ['DCF', `${formatPercent(sanitizedData.discountRate * 100, 2)} discount`, 'Projects cash flows and discounts for risk, runway, and leverage.']
      ];
      const methodology = displayedMethods.length ? methodologyBase.filter(row => displayedMethods.includes(row[0])) : methodologyBase;
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

      // Market and Confidence Page
      yPos = addPage('Market & Confidence');
      yPos = sectionTitle('Revenue Multiple Market Context (for reference)', yPos);
      const rangeSpan = marketRange.high - marketRange.low;
      const lowerBand = marketRange.low + rangeSpan / 3;
      const upperBand = marketRange.high - rangeSpan / 3;
      const bandPosition = sanitizedData.multiplier <= lowerBand ? 'lower' : sanitizedData.multiplier >= upperBand ? 'upper' : 'middle';
      doc.setFontSize(10);
      doc.text(`Typical market range for ${marketRange.label}:`, margin, yPos);
      yPos += 6;
      doc.text(`• Early-stage / bootstrapped: ${marketRange.low.toFixed(1)}× – ${(marketRange.low + (rangeSpan / 2)).toFixed(1)}× ARR`, margin, yPos);
      yPos += 5;
      doc.text(`• Growth / VC-backed: ${(marketRange.low + (rangeSpan / 2)).toFixed(1)}× – ${marketRange.high.toFixed(1)}× ARR`, margin, yPos);
      yPos += 6;
      doc.text(`Your applied multiple: ${sanitizedData.multiplier}× (within the ${bandPosition} part of this band).`, margin, yPos);
      yPos += 10;

      yPos = sectionTitle('Confidence Breakdown', yPos);
      doc.autoTable({
        head: [['Factor', 'Score (0-100)']],
        body: [
          ['Data completeness', confidenceBreakdown.dataCompleteness],
          ['Method alignment', confidenceBreakdown.methodAlignment],
          ['Revenue quality', confidenceBreakdown.revenueQuality],
          ['Legal/IP clarity', confidenceBreakdown.legalClarity],
          ['Market stability', confidenceBreakdown.marketStability]
        ],
        startY: yPos,
        theme: 'striped',
        styles: { fillColor: palette.soft, textColor: palette.ink, cellPadding: 3 },
        headStyles: { fillColor: palette.brand, textColor: [255, 255, 255] }
      });
      yPos = doc.lastAutoTable.finalY + 6;
      doc.text(`Overall confidence score: ${confidenceBreakdown.overall}/100`, margin, yPos);
      yPos += 6;
      doc.setTextColor(...palette.slate);
      doc.text('Scores are weighted across data completeness, method alignment, revenue quality, legal clarity, and market stability.', margin, yPos, { maxWidth: pageWidth - 2 * margin });
      doc.setTextColor(...palette.ink);
      yPos += 12;

      yPos = sectionTitle('Exit Readiness Snapshot', yPos);
      yPos = sectionSubtitle('This section summarizes your readiness for acquisition or fundraising.', yPos);
      doc.autoTable({
        head: [['Dimension', 'Assessment']],
        body: [
          ['Sellable today', exitAssessment.sellableToday],
          ['Attractive to financial buyers', exitAssessment.fundableToday],
          ['Strategic acquisition appeal', exitAssessment.strategicAppeal]
        ],
        startY: yPos,
        theme: 'grid',
        headStyles: { fillColor: palette.ink, textColor: [255, 255, 255] },
        styles: { fillColor: [255, 255, 255], textColor: palette.ink, lineColor: palette.soft }
      });
      yPos = doc.lastAutoTable.finalY + 6;
      exitAssessment.notes.slice(0, 3).forEach(note => {
        doc.text(`• ${note}`, margin, yPos, { maxWidth: pageWidth - 2 * margin });
        yPos += 5;
      });
      if (!exitAssessment.notes.length) {
        doc.text('You could explore a small acquisition today, but maximizing value likely requires more growth and runway extension.', margin, yPos, { maxWidth: pageWidth - 2 * margin });
        yPos += 6;
      }
      yPos += 4;

      if (inputWarnings.length) {
        yPos = sectionTitle('Input Quality & Red Flags', yPos);
        inputWarnings.forEach(w => {
          doc.text(`• ${w}`, margin, yPos, { maxWidth: pageWidth - 2 * margin });
          yPos += 5;
        });
      }

      // Graphs Pages
      const graphInsights = (title) => {
        if (title === 'Valuation by Method') {
          if (sanitizedData.valuations.length > 1) {
            const values = sanitizedData.valuations.map(v => v.value);
            const spreadPct = Math.round(((Math.max(...values) - Math.min(...values)) / (sanitizedData.avgValuation || 1)) * 100);
            return `Revenue multiplier and income-based valuations are within ${spreadPct}% of each other, indicating ${spreadPct < 30 ? 'good' : 'moderate'} method alignment.`;
          }
          return 'Single-method valuation; add another method for cross-checking confidence.';
        }
        if (title === 'Growth vs. Churn') {
          return `YoY growth of ${formatPercent(sanitizedData.growthYoy)} compared to churn of ${formatPercent(sanitizedData.customerChurn)} ${sanitizedData.growthYoy > sanitizedData.customerChurn ? 'supports the current multiple.' : 'signals retention needs before scaling spend.'}`;
        }
        if (title === 'Financial Metrics Impact') {
          return `LTV/CAC visibility and margin quality shape buyer confidence; LTV ${formatCurrency(sanitizedData.ltv)} vs. CAC ${formatCurrency(sanitizedData.cac)}.`;
        }
        if (title === 'Risk Factors') {
          return `Legal (${sanitizedData.legalIssues || 'n/a'}), IP (${sanitizedData.ipOwnership}), and debt ${formatCurrency(sanitizedData.debtLevel)} drive diligence effort.`;
        }
        return '';
      };

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
        const interpretation = graphInsights(graph.title);
        doc.text(`${graph.desc} ${interpretation || ''}`.trim(), margin, yPos, { maxWidth: pageWidth - 2 * margin });
        yPos += 8;
        doc.addImage(imgData, 'JPEG', margin, yPos, 120, 75);
        yPos += 85;
      });

      // About & Disclaimer Page
      yPos = addPage('About & Disclaimer');
      yPos = sectionTitle('About The SaaS Valuation App™', yPos);
      doc.setFontSize(10);
      const aboutText = 'The SaaS Valuation App™ delivers transparent valuations built on industry-standard methods and auditable calculations. Every figure in this report is tied to the inputs you provided and can be refreshed as metrics change. Reach us via the contact form at www.saasvaluation.app.';
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

      if (includeCoupon) {
        yPos = addPage('Revaluation Access');
        yPos = sectionTitle('Keep Your Revaluation Coupon', yPos);
        doc.setFontSize(11);
        const revalueMessage = 'To revalue your business at a later date please enter this unique coupon code:';
        doc.text(doc.splitTextToSize(revalueMessage, pageWidth - 2 * margin), margin, yPos);
        yPos += 12;
        doc.setFont(undefined, 'bold');
        doc.setFontSize(18);
        doc.setTextColor(...palette.brand);
        doc.text(REVALUATION_COUPON_CODE, margin, yPos);
        doc.setTextColor(...palette.ink);
        doc.setFont(undefined, 'normal');
        yPos += 14;
        doc.setFontSize(10);
        const revalueNote = 'Keep this code safe. It unlocks future valuation updates without repurchasing after you have already paid.';
        doc.text(doc.splitTextToSize(revalueNote, pageWidth - 2 * margin), margin, yPos);
      }
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(...palette.slate);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
        doc.text('Confidential — generated by The SaaS Valuation App™', margin, pageHeight - 10);
        doc.setTextColor(...palette.ink);
      }

      const blob = doc.output('blob');
      if (save) {
        await doc.save(filename, { returnPromise: true });
      }
      return { doc, blob };
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
    }
  
  export function setupPDF(data) {
  const button = document.getElementById('download-report');
  if (!button) return;

  button.onclick = async () => {
    try {
      await generateValuationPdf(data, { save: true });
    } catch (error) {
      const message = error?.message || 'An error occurred while generating the PDF. Please try again.';
      console.error('Error generating PDF:', error);
      alert(message);
    }
  };
}

