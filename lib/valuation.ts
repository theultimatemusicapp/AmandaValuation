export type ValuationInputs = {
    // Company Info
    companyName: string;
    email: string;
    website?: string;

    // Pro Valuation Method Selection
    methods?: string[];

    // Financials
    arr: number;
    mrr?: number;
    ltv?: number;
    cac?: number;
    grossMargin?: number;
    netProfit: number;
    burnRate?: number;
    runway?: number;
    ownerSalary?: number;
    averageSalary?: number;
    employeeBenefits?: number;
    yearsOperating?: number;
    businessType?: string;
    baseMultiplier?: number;
    customMultiplier?: number;

    // Growth Metrics
    growthYoy: number;
    revenueGrowthMom?: number;
    revenueChurn?: number;

    // Metrics
    customerChurn: number;
    retentionRate: number;
    nps: number;
    activeCustomers?: number;
    mau?: number;
    customerSegment?: string;
    buyerType?: string;

    // Product/Tech
    productMarketFit?: string;
    proprietaryTech?: string;
    codeQuality?: string;
    scalableInfrastructure?: string;
    featureReleaseFrequency?: string;
    securityCompliance?: string;

    // Team/Operations
    fte?: number;
    keyStaff?: number;
    turnoverRate?: number;
    engSalesRatio?: number;
    supportTickets?: number;
    supportRating?: number;
    headcountGrowth?: number;

    // Legal/Risk
    legalEntity?: string;
    legalIssues: 'none' | 'minor' | 'major';
    ipOwnership: 'fully-owned' | 'semiprivate' | 'none' | 'partial' | 'third-party';
    contractLength?: number;
    contractValue?: number;
    vendorLockin?: string;
    dataPrivacy?: string;
    cyberInsurance?: string;
    debtLevel?: number;

    // Config
    businessTypeMultiplier?: number; // default 5
    discountRate?: number; // default 0.1 (10%)
};

export type ValuationResult = {
    valuations: { method: string; value: number }[];
    avgValuation: number;
    rangeLow: number;
    rangeHigh: number;
    confidence: number;
    multiplier: number;
    warnings: string[];
};

export const calculateSaaSValuation = (inputs: ValuationInputs): ValuationResult => {
    const {
        arr,
        netProfit,
        growthYoy,
        customerChurn,
        retentionRate,
        nps,
        legalIssues,
        ipOwnership,
        businessTypeMultiplier = 5,
        discountRate = 0.1,
    } = inputs;

    const warnings: string[] = [];
    const valuations: { method: string; value: number }[] = [];

    // 1. Calculate Multiplier
    let multiplier = businessTypeMultiplier;

    // Rule of 40 Calculation
    const netProfitMargin = arr > 0 ? (netProfit / arr) * 100 : 0;
    const ruleOf40 = growthYoy + netProfitMargin;

    // Adjustments
    if (growthYoy > 20) multiplier += 2;
    if (customerChurn < 5) multiplier += 1;
    if (retentionRate > 80) multiplier += 1;
    if (nps > 50) multiplier += 0.5;
    if (legalIssues !== 'none') multiplier -= 1;
    if (ipOwnership === 'fully-owned') multiplier += 0.5;

    if (ruleOf40 >= 40) multiplier += 1;
    else multiplier -= 1;

    multiplier = Math.max(multiplier, 1);

    // 2. Calculate Methods

    // A. Revenue Multiplier
    if (arr > 0) {
        valuations.push({
            method: 'Revenue Multiplier',
            value: arr * multiplier
        });
    } else {
        warnings.push('ARR must be greater than 0 for Revenue Multiplier method.');
    }

    // B. Income-Based
    if (netProfit > 0) {
        const profitMultiplier = Math.max(multiplier - 1, 1);
        valuations.push({
            method: 'Income-Based',
            value: netProfit * profitMultiplier
        });
    } else {
        warnings.push('Net profit should be positive for Income-Based method.');
    }

    // C. Earnings-Based
    if (arr > 0 && netProfit > 0) {
        valuations.push({
            method: 'Earnings-Based',
            value: (arr * 0.6 + netProfit * 0.4) * multiplier
        });
    }

    // D. DCF (Discounted Cash Flow) simplified
    if (netProfit > 0 && discountRate > 0) {
        const cashFlow = netProfit * 1.2;
        valuations.push({
            method: 'DCF',
            value: cashFlow / discountRate
        });
    }

    // 3. Aggregate Results
    const avgValuation = valuations.length
        ? valuations.reduce((sum, v) => sum + v.value, 0) / valuations.length
        : 0;

    const rangeLow = avgValuation * 0.9;
    const rangeHigh = avgValuation * 1.1;

    // Confidence Score Logic
    // Base 60 + 10 per method + bonuses
    let confidence = 60 + (valuations.length * 10);
    if (growthYoy > 20) confidence += 10;
    if (customerChurn < 5) confidence += 10;
    confidence = Math.min(95, confidence);

    return {
        valuations,
        avgValuation,
        rangeLow,
        rangeHigh,
        confidence,
        multiplier,
        warnings
    };
};

export const formatCurrency = (value: number) => {
    if (value < 10) return `$${value.toFixed(2)}`;
    return `$${Math.round(value).toLocaleString()}`;
};
