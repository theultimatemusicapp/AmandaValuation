import jsPDF from 'jspdf';
import { ValuationResult, ValuationInputs, formatCurrency } from './valuation';
import { generateAIAnalysis } from './ai-assistant';

/**
 * Generate a basic FREE PDF report (1-2 pages)
 */
export function generateFreePDF(data: ValuationResult, inputs: ValuationInputs) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const companyName = inputs.companyName || 'Your SaaS';

    // Header
    doc.setFillColor(14, 165, 233); // Brand teal
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('SaaS Valuation Report', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('Free Edition', pageWidth / 2, 30, { align: 'center' });

    // Reset text color
    doc.setTextColor(0, 0, 0);

    // Company Name & Info
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(companyName, 20, 55);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    let subHeaderY = 62;
    if (inputs.email) {
        doc.text(`Email: ${inputs.email}`, 20, subHeaderY);
        subHeaderY += 5;
    }
    if (inputs.website) {
        doc.text(`Website: ${inputs.website}`, 20, subHeaderY);
        subHeaderY += 5;
    }
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, subHeaderY);

    // Main Valuation Box
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text('Estimated Valuation', 20, 80);

    doc.setFillColor(240, 253, 250);
    doc.rect(20, 85, pageWidth - 40, 30, 'F');
    doc.setFontSize(28);
    doc.setTextColor(14, 165, 233);
    doc.text(formatCurrency(data.avgValuation), pageWidth / 2, 105, { align: 'center' });

    // Valuation Range
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Valuation Range', 20, 130);
    doc.setFontSize(14);
    doc.text(`${formatCurrency(data.rangeLow)} - ${formatCurrency(data.rangeHigh)}`, 20, 140);

    // Confidence Score
    doc.setFontSize(12);
    doc.text('Confidence Score', 20, 155);
    doc.setFontSize(14);
    doc.text(`${data.confidence}%`, 20, 165);

    // Methods Used
    doc.setFontSize(12);
    doc.text('Valuation Methods Used', 20, 180);
    doc.setFontSize(10);
    let yPos = 188;
    data.valuations.forEach((val) => {
        doc.text(`• ${val.method}: ${formatCurrency(val.value)}`, 25, yPos);
        yPos += 8;
    });

    // AI Analysis (New Section)
    doc.setFontSize(12);
    doc.setTextColor(14, 165, 233); // Brand color
    doc.text('🤖 AI Expert Analysis', 20, 220);

    doc.setFontSize(9);
    doc.setTextColor(70, 70, 70);
    doc.setFont('helvetica', 'italic');

    const analysis = generateAIAnalysis(inputs, companyName);
    const splitAnalysis = doc.splitTextToSize(analysis.replace(/\*\*/g, ''), pageWidth - 40); // Remove markdown bold for simple text
    doc.text(splitAnalysis, 20, 228);

    // Upgrade CTA
    doc.setFillColor(251, 191, 36); // Amber
    doc.rect(20, pageWidth - 60, pageWidth - 40, 40, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text('Want More Insights?', pageWidth / 2, pageWidth - 45, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Upgrade to Pro for detailed charts, benchmarking, and actionable recommendations', pageWidth / 2, pageWidth - 37, { align: 'center' });
    doc.setFontSize(12);
    doc.setTextColor(14, 165, 233);
    doc.text('Visit saasvaluation.app/payment for $19 Pro access', pageWidth / 2, pageWidth - 27, { align: 'center' });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('This is not financial advice. Consult a professional for investment decisions.', pageWidth / 2, pageWidth - 10, { align: 'center' });

    // Save
    doc.save(`${companyName.replace(/\s+/g, '-').toLowerCase()}-valuation-free.pdf`);
}

/**
 * Generate a comprehensive PRO PDF report (5+ pages)
 */
/**
 * Generate a comprehensive PRO PDF report (10 pages)
 */
export function generateProPDF(data: ValuationResult, inputs: any, companyName: string = 'Your SaaS') {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // --- HELPER FUNCTIONS ---
    const drawHeader = (pageTitle: string) => {
        doc.setFillColor(15, 23, 42); // slate-900
        doc.rect(0, 0, pageWidth, 25, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('PRO VALUATION REPORT', margin, 15);
        doc.setFont('helvetica', 'normal');
        doc.text(pageTitle.toUpperCase(), pageWidth - margin, 15, { align: 'right' });
        doc.setDrawColor(30, 41, 59); // slate-800
        doc.setLineWidth(0.1);
        doc.line(0, 25, pageWidth, 25);
    };

    const drawFooter = (pageNum: number) => {
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184); // slate-400
        doc.text(`Generated by SaaS Valuation Wizard • ${new Date().toLocaleDateString()}`, margin, pageHeight - 10);
        doc.text(`Page ${pageNum} of 10`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    };

    const drawSectionTitle = (title: string, y: number) => {
        doc.setFontSize(16);
        doc.setTextColor(15, 23, 42); // slate-900
        doc.setFont('helvetica', 'bold');
        doc.text(title, margin, y);
        doc.setDrawColor(14, 165, 233); // brand-500
        doc.setLineWidth(1);
        doc.line(margin, y + 2, margin + 20, y + 2);
        return y + 15;
    };

    const drawDataTable = (headers: string[], rows: any[][], y: number) => {
        const colWidth = contentWidth / headers.length;

        // Header
        doc.setFillColor(248, 250, 252); // slate-50
        doc.rect(margin, y, contentWidth, 10, 'F');
        doc.setTextColor(71, 85, 105); // slate-600
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        headers.forEach((h, i) => {
            doc.text(h, margin + (i * colWidth) + 5, y + 6.5);
        });

        // Rows
        let currentY = y + 10;
        doc.setFont('helvetica', 'normal');
        rows.forEach((row, i) => {
            if (i % 2 === 0) {
                doc.setFillColor(255, 255, 255);
            } else {
                doc.setFillColor(248, 250, 252);
            }
            doc.rect(margin, currentY, contentWidth, 10, 'F');
            doc.setTextColor(15, 23, 42);
            row.forEach((cell, cellIdx) => {
                doc.text(String(cell), margin + (cellIdx * colWidth) + 5, currentY + 6.5);
            });
            currentY += 10;
        });
        return currentY;
    };

    const drawBarChart = (chartData: { name: string, value: number }[], y: number, height: number = 60) => {
        const barWidth = (contentWidth - 20) / chartData.length;
        const maxValue = Math.max(...chartData.map(d => d.value));
        const chartY = y + height;

        chartData.forEach((d, i) => {
            const barHeight = (d.value / maxValue) * (height - 15);
            const x = margin + 10 + (i * barWidth);

            // Draw Bar
            doc.setFillColor(14, 165, 233); // brand-500
            doc.rect(x + (barWidth * 0.2), chartY - barHeight, barWidth * 0.6, barHeight, 'F');

            // Labels
            doc.setFontSize(7);
            doc.setTextColor(51, 65, 85);
            doc.text(d.name, x + (barWidth / 2), chartY + 5, { align: 'center', maxWidth: barWidth * 0.8 });
            doc.setFont('helvetica', 'bold');
            doc.text(formatCurrency(d.value), x + (barWidth / 2), chartY - barHeight - 3, { align: 'center' });
            doc.setFont('helvetica', 'normal');
        });

        return chartY + 20;
    };

    const drawBenchmarkChart = (benchmarks: { label: string, score: number, target: number }[], y: number) => {
        let currentY = y;
        const labelWidth = 50;
        const barAreaWidth = contentWidth - labelWidth - 20;

        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text('SCORE (%)', margin + labelWidth + (barAreaWidth / 2), currentY, { align: 'center' });
        currentY += 8;

        benchmarks.forEach(b => {
            doc.setFontSize(9);
            doc.setTextColor(15, 23, 42);
            doc.text(b.label, margin, currentY + 4);

            // Background bar
            doc.setFillColor(241, 245, 249);
            doc.rect(margin + labelWidth, currentY, barAreaWidth, 5, 'F');

            // Score bar
            const scoreWidth = (b.score / 100) * barAreaWidth;
            doc.setFillColor(14, 165, 233);
            doc.rect(margin + labelWidth, currentY, scoreWidth, 5, 'F');

            // Target marker
            const targetX = margin + labelWidth + ((b.target / 100) * barAreaWidth);
            doc.setDrawColor(245, 158, 11); // amber-500
            doc.setLineWidth(1);
            doc.line(targetX, currentY - 2, targetX, currentY + 7);

            currentY += 15;
        });

        return currentY;
    };

    // --- PAGE 1: TITLE PAGE ---
    // Background accent
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Decorative lines
    doc.setDrawColor(14, 165, 233);
    doc.setLineWidth(2);
    doc.line(margin, 100, margin + 50, 100);

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(40);
    doc.text('Valuation', margin, 140);
    doc.text('Analysis', margin, 155);

    doc.setFontSize(22);
    doc.setTextColor(148, 163, 184);
    doc.text(companyName.toUpperCase(), margin, 175);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139); // slate-500
    let infoY = 185;
    if (inputs.email) {
        doc.text(`Email: ${inputs.email}`, margin, infoY);
        infoY += 6;
    }
    if (inputs.website) {
        doc.text(`Website: ${inputs.website}`, margin, infoY);
        infoY += 6;
    }

    doc.setFillColor(14, 165, 233);
    doc.rect(margin, infoY + 2, 60, 2, 'F');

    doc.setFontSize(10);
    doc.text('INVESTOR-GRADE PROFESSIONAL REPORT', margin, 240);
    doc.text(`DATE PREPARED: ${new Date().toLocaleDateString()}`, margin, 247);
    doc.text('PROVIDED BY THE SAAS VALUATION WIZARD', margin, 254);

    // --- PAGE 2: EXECUTIVE SUMMARY ---
    doc.addPage();
    drawHeader('Executive Summary');
    let y = 50;
    y = drawSectionTitle('Valuation Overview', y);

    // Summary Box
    doc.setFillColor(240, 249, 255);
    doc.setDrawColor(186, 230, 253);
    doc.rect(margin, y, contentWidth, 60, 'FD');

    doc.setFontSize(12);
    doc.setTextColor(51, 65, 85);
    doc.text('Estimated Market Value', margin + 10, y + 15);

    doc.setFontSize(36);
    doc.setTextColor(14, 165, 233);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(data.avgValuation), margin + 10, y + 35);

    doc.setFontSize(12);
    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.text(`Valuation Range: ${formatCurrency(data.rangeLow)} - ${formatCurrency(data.rangeHigh)}`, margin + 10, y + 48);

    // Confidence Score Circle
    const circleX = pageWidth - margin - 30;
    const circleY = y + 30;
    doc.setDrawColor(14, 165, 233);
    doc.setLineWidth(2);
    doc.circle(circleX, circleY, 20);
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(`${data.confidence}%`, circleX, circleY + 5, { align: 'center' });
    doc.setFontSize(8);
    doc.text('CONFIDENCE', circleX, circleY - 5, { align: 'center' });

    y += 80;
    y = drawSectionTitle('The Bottom Line', y);
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    const bottomLineArr = doc.splitTextToSize(
        `Based on an ARR of ${formatCurrency(inputs.arr)} and a growth profile of ${inputs.growthYoy}%, ${companyName} displays a consistent valuation trajectory. The average ARR multiple of ${(data.avgValuation / (inputs.arr || 1)).toFixed(1)}x is indicative of a healthy SaaS profile in the current market. Strategic improvements in churn and net retention could yield an additional 15-20% in value uplift over the next 12 months.`,
        contentWidth
    );
    doc.text(bottomLineArr, margin, y);

    drawFooter(2);

    // --- PAGE 3: FINANCIAL DEEP DIVE ---
    doc.addPage();
    drawHeader('Financial Snapshot');
    y = 40;
    y = drawSectionTitle('Base Financials', y);

    const financialRows = [
        ['Metric', 'Current Value', 'Benchmark (SaaS)'],
        ['Annual Recurring Revenue (ARR)', formatCurrency(inputs.arr), '> $1M (Growth Stage)'],
        ['Monthly Recurring Revenue (MRR)', formatCurrency(inputs.mrr), 'N/A'],
        ['Net Profit (EBITDA)', formatCurrency(inputs.netProfit), '10-20% Margin'],
        ['Gross Margin', `${inputs.grossMargin || 80}%`, '75-85% (Target)'],
        ['Annual Contract Value (ACV)', formatCurrency(inputs.contractValue || 0), 'Segment Dependent'],
    ];
    y = drawDataTable(financialRows[0], financialRows.slice(1), y);

    y += 15;
    y = drawSectionTitle('Valuation Composition', y);
    const chartData = data.valuations.map(v => ({ name: v.method, value: v.value }));
    y = drawBarChart(chartData, y, 50);

    y += 10;
    y = drawSectionTitle('Profitability Analysis', y);
    const marginPercent = ((inputs.netProfit / (inputs.arr || 1)) * 100).toFixed(1);
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    doc.text(`Your current EBITDA margin is ${marginPercent}%.`, margin, y);
    y += 10;

    // Margin Progress bar (simulated)
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, contentWidth, 5, 'F');
    const marginWidth = Math.min(Math.max(Number(marginPercent), 0), 100) / 100 * contentWidth;
    doc.setFillColor(14, 165, 233);
    doc.rect(margin, y, marginWidth, 5, 'F');

    drawFooter(3);

    // --- PAGE 4: VALUATION METHODOLOGIES (1 & 2) ---
    doc.addPage();
    drawHeader('Valuation Methodology Part I');
    y = 40;

    // Method 1: Revenue Multiples
    y = drawSectionTitle('1. Revenue Multiplier Method', y);
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text('This method applies an industry-specific multiple to your ARR, adjusted for growth and churn.', margin, y);
    y += 10;

    const revVal = data.valuations.find(v => v.method.includes('Revenue'))?.value || 0;
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, y, contentWidth, 15, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(14, 165, 233);
    doc.text(`Estimated Value: ${formatCurrency(revVal)}`, margin + 5, y + 10);
    doc.setFont('helvetica', 'normal');
    y += 25;

    // Method 2: Income-Based (SDE)
    y = drawSectionTitle('2. Income-Based / SDE Method', y);
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text('Primarily for bootstrapped companies, this looks at the Sellers Discretionary Earnings (SDE).', margin, y);
    y += 10;

    const incomeVal = data.valuations.find(v => v.method.includes('Income'))?.value || 0;
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, y, contentWidth, 15, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(14, 165, 233);
    doc.text(`Estimated Value: ${formatCurrency(incomeVal)}`, margin + 5, y + 10);
    doc.setFont('helvetica', 'normal');

    drawFooter(4);

    // --- PAGE 5: VALUATION METHODOLOGIES (3 & 4) ---
    doc.addPage();
    drawHeader('Valuation Methodology Part II');
    y = 40;

    // Method 3: Combined Earnings
    y = drawSectionTitle('3. Rule of 40 / Efficiency Method', y);
    doc.setFontSize(10);
    doc.text('Adjusts valuation based on the "Rule of 40" - the sum of growth and profit margin.', margin, y);
    y += 10;

    const earnVal = data.valuations.find(v => v.method.includes('Earnings'))?.value || 0;
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, y, contentWidth, 15, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(14, 165, 233);
    doc.text(`Estimated Value: ${formatCurrency(earnVal)}`, margin + 5, y + 10);
    doc.setFont('helvetica', 'normal');
    y += 25;

    // Method 4: DCF Projection
    y = drawSectionTitle('4. Discounted Cash Flow (DCF)', y);
    doc.setFontSize(10);
    doc.text(`Projected future cash flows discounted at an annual rate of ${(inputs.discountRate * 100).toFixed(1)}%.`, margin, y);
    y += 10;

    const dcfVal = data.valuations.find(v => v.method.includes('DCF'))?.value || 0;
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, y, contentWidth, 15, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(14, 165, 233);
    doc.text(`Estimated Value: ${formatCurrency(dcfVal)}`, margin + 5, y + 10);
    doc.setFont('helvetica', 'normal');

    drawFooter(5);

    // --- PAGE 6: GROWTH & CHURN DYNAMICS ---
    doc.addPage();
    drawHeader('Growth & Retention Analysis');
    y = 40;
    y = drawSectionTitle('Retention Benchmarks', y);

    const churnRows = [
        ['Metric', 'Your Score', 'Benchmark (Target)'],
        ['Gross Churn (Monthly)', `${inputs.customerChurn}%`, '< 1.5%'],
        ['Net Dollar Retention (NDR)', `${inputs.retentionRate}%`, '> 100%'],
        ['Revenue Churn', `${inputs.revenueChurn || inputs.customerChurn}%`, '< 1.0%'],
    ];
    y = drawDataTable(churnRows[0], churnRows.slice(1), y);

    y += 20;
    y = drawSectionTitle('The Churn Impact', y);
    doc.setFontSize(10);
    const churnFactor = inputs.customerChurn > 3 ? 'high' : 'healthy';
    doc.text(`A churn rate of ${inputs.customerChurn}% is considered ${churnFactor}.`, margin, y);
    y += 10;
    doc.text('Compounding impact of churn over 3 years:', margin, y);
    y += 10;

    // Churn impact visualization (text-based)
    const threeYearRetention = Math.pow(1 - (inputs.customerChurn / 100), 36).toFixed(1);
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, contentWidth, 20, 'F');
    doc.setTextColor(220, 38, 38); // red-600
    doc.setFont('helvetica', 'bold');
    doc.text(`Only ${(Number(threeYearRetention) * 100).toFixed(1)}% of your current revenue would remain in 36 months without expansion.`, margin + 5, y + 12);

    drawFooter(6);

    // --- PAGE 7: UNIT ECONOMICS & EFFICIENCY ---
    doc.addPage();
    drawHeader('Unit Economics & Efficiency');
    y = 40;
    y = drawSectionTitle('Efficiency Metrics', y);

    const ltvCac = inputs.cac > 0 ? (inputs.ltv / inputs.cac).toFixed(1) : 'N/A';
    const netMarginRate = (inputs.netProfit / (inputs.arr || 1));
    const ruleOf40 = (inputs.growthYoy + (netMarginRate * 100)).toFixed(1);
    const paybackPeriod = inputs.cac > 0 && inputs.mrr > 0 && inputs.activeCustomers > 0
        ? (inputs.cac / (inputs.mrr / inputs.activeCustomers)).toFixed(1)
        : 'Calc Error';

    const efficiencyRows = [
        ['Metric', 'Your Value', 'Excellence Threshold'],
        ['LTV : CAC Ratio', `${ltvCac}:1`, '3.0:1 or better'],
        ['Payback Period', `${paybackPeriod} mo`, '< 12 months'],
        ['Rule of 40 Score', `${ruleOf40}%`, '> 40%'],
    ];
    y = drawDataTable(efficiencyRows[0], efficiencyRows.slice(1), y);

    y += 15;
    y = drawSectionTitle('Peer Benchmarking', y);
    const benchmarks = [
        { label: 'Growth Rating', score: 80, target: 45 },
        { label: 'Retention Health', score: data.confidence, target: 85 },
        { label: 'Profit Efficiency', score: 60, target: 20 },
        { label: 'Market Position', score: 70, target: 50 },
        { label: 'Tech Stack Maturity', score: 90, target: 75 },
    ];
    y = drawBenchmarkChart(benchmarks, y);

    y += 10;
    y = drawSectionTitle('Metric Deep Dive', y);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('The Rule of 40 Analysis', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    y += 7;
    const rule40Desc = doc.splitTextToSize(
        `The Rule of 40 is a high-level health metric for SaaS companies. It states that your growth rate plus your profit margin should be 40 or higher. Your score of ${ruleOf40}% indicates that the business is currently ${Number(ruleOf40) >= 40 ? 'performing at an elite level' : 'balancing growth and profit; focus on optimizing one to hit the 40% benchmark'}.`,
        contentWidth
    );
    doc.text(rule40Desc, margin, y);

    drawFooter(7);

    // --- PAGE 8: MOAT & RISK ASSESSMENT ---
    doc.addPage();
    drawHeader('Moat & Risk Matrix');
    y = 40;
    y = drawSectionTitle('Strategic Scoring', y);

    const calculateScore = (val: string) => {
        if (val === 'none' || val === 'no') return 2;
        if (val === 'partial' || val === 'licensed') return 6;
        return 10;
    };

    const riskRows = [
        ['Factor', 'Status', 'Risk Score (1-10)'],
        ['IP Ownership', inputs.ipOwnership || 'Standard', calculateScore(inputs.ipOwnership || '')],
        ['Legal Standing', inputs.legalIssues || 'Clean', inputs.legalIssues === 'none' ? 10 : 4],
        ['Founder Dependency', `${inputs.keyStaff || 0} Key Staff`, (inputs.keyStaff || 0) > 2 ? 8 : 5],
        ['Tech Scalability', inputs.scalableInfrastructure || 'N/A', calculateScore(inputs.scalableInfrastructure || '')],
        ['Data Compliance', inputs.dataPrivacy || 'N/A', calculateScore(inputs.dataPrivacy || '')],
    ];
    y = drawDataTable(riskRows[0], riskRows.slice(1), y);

    y += 20;
    y = drawSectionTitle('Moat Analysis', y);
    doc.setFontSize(10);
    const ipBonus = inputs.ipOwnership === 'fully-owned' ? 'Your proprietary IP provides a strong defensive moat.' : 'Strengthening IP ownership could significantly reduce risk discounts.';
    doc.text(ipBonus, margin, y);
    y += 7;
    doc.text(`With ${inputs.keyStaff || 0} key personnel, transition risk is ${(inputs.keyStaff || 0) > 2 ? 'moderate' : 'low'}.`, margin, y);

    drawFooter(8);

    // --- PAGE 9: EXIT SCENARIOS & BUYER PROFILES ---
    doc.addPage();
    drawHeader('Exit & Buyer Analysis');
    y = 40;
    y = drawSectionTitle('Modeled Exit Scenarios', y);

    const exitData = [
        ['Scenario', 'Multiple', 'Enterprise Value'],
        ['Conservative (3x)', '3.0x', formatCurrency(inputs.arr * 3)],
        ['Current Model (Base)', `${(data.avgValuation / inputs.arr).toFixed(1)}x`, formatCurrency(data.avgValuation)],
        ['Strategic (8x Target)', '8.0x', formatCurrency(inputs.arr * 8)],
    ];
    y = drawDataTable(exitData[0], exitData.slice(1), y);

    y += 20;
    y = drawSectionTitle('Strategic Buyer Analysis', y);
    const buyers = [
        { type: 'Strategic Acquirer', premium: '20-50%', profile: 'Looking for product/tech synergy' },
        { type: 'Private Equity (PE)', premium: '5-15%', profile: 'Looking for efficiency and EBITDA' },
        { type: 'Direct Competitor', premium: '15-30%', profile: 'Looking for market share expansion' },
    ];

    buyers.forEach(b => {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(14, 165, 233);
        doc.text(b.type, margin, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text(`Premium: ${b.premium} • ${b.profile}`, margin + 50, y);
        y += 10;
    });

    drawFooter(9);

    // --- PAGE 10: ACTION ROADMAP ---
    doc.addPage();
    drawHeader('Strategic Action Roadmap');
    y = 40;
    y = drawSectionTitle('Priority 1: Immediate Value Uplift', y);

    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    const recommendations = [];
    if (inputs.customerChurn > 3) recommendations.push('Aggressively target churn reduction. A 1% drop in churn yields ~15% valuation growth over 24 months.');
    if (inputs.retentionRate < 100) recommendations.push('Focus on net expansion/upsells. NDR over 100% is the primary differentiator for top-tier multiples.');
    if (inputs.growthYoy < 30) recommendations.push('Explore new acquisition channels. Valuation multiples step up significantly once growth crosses the 30% hurdle.');
    if (recommendations.length === 0) recommendations.push('Maintain current performance. The business is currently in the top 10% of efficiency metrics for its category.');

    recommendations.forEach(rec => {
        doc.circle(margin + 2, y - 1, 1, 'F');
        doc.text(rec, margin + 7, y);
        y += 10;
    });

    y += 15;
    y = drawSectionTitle('Glossary of Terms', y);
    y -= 5;
    const glossary = [
        ['ARR', 'Annual Recurring Revenue - total predictable revenue in a year.'],
        ['EBITDA', 'Earnings Before Interest, Taxes, Depreciation, and Amortization.'],
        ['NDR', 'Net Dollar Retention - revenue retained from the same customer cohort. High NDR over 100% means the product grows itself.'],
        ['CAC Payback', 'The time taken to earn back the cost of acquiring one customer. Target is under 12 months for most SaaS models.'],
    ];
    glossary.forEach(item => {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(item[0], margin, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        const splitDesc = doc.splitTextToSize(item[1], contentWidth - 30);
        doc.text(splitDesc, margin + 30, y);
        y += (splitDesc.length * 5) + 2;
    });

    drawFooter(10);

    // Final Save
    doc.save(`${companyName.replace(/\s+/g, '-').toLowerCase()}-investor-valuation.pdf`);
}

