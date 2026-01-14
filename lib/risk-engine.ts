
export interface RiskFactor {
    id: string;
    category: 'market' | 'product' | 'team' | 'financial';
    question: string;
    options: {
        label: string;
        score: number; // 0 (high risk) to 10 (low risk)
        description?: string;
    }[];
    weight: number; // Importance of this factor (0.1 to 1.0)
}

export const RISK_FACTORS: RiskFactor[] = [
    // Market Risk
    {
        id: 'market_growth',
        category: 'market',
        question: 'How fast is your target market growing?',
        weight: 1.0,
        options: [
            { label: 'Declining', score: 0 },
            { label: 'Stable / Flat', score: 4 },
            { label: 'Growing < 10%', score: 7 },
            { label: 'Hyper-growth (> 20%)', score: 10 },
        ]
    },
    {
        id: 'competition',
        category: 'market',
        question: 'What is the competitive landscape?',
        weight: 0.8,
        options: [
            { label: 'Dominated by giants', score: 2 },
            { label: 'Crowded with similar startups', score: 5 },
            { label: 'Fragmented / Few competitors', score: 8 },
            { label: 'Blue Ocean / No direct competitors', score: 10 },
        ]
    },

    // Product Risk
    {
        id: 'ip_ownership',
        category: 'product',
        question: 'Do you own 100% of your Intellectual Property (IP)?',
        weight: 1.2, // Critical
        options: [
            { label: 'No / Uncertain', score: 0, description: 'Code ownership disputes are deal-killers.' },
            { label: 'Partial (Licensed)', score: 5 },
            { label: 'Yes, fully owned', score: 10 },
        ]
    },
    {
        id: 'tech_debt',
        category: 'product',
        question: 'How would you describe your Technical Debt?',
        weight: 0.6,
        options: [
            { label: 'Significant (Needs rewrite)', score: 2 },
            { label: 'Manageable', score: 6 },
            { label: 'Clean / Modern Stack', score: 10 },
        ]
    },

    // Team Risk
    {
        id: 'founder_dependency',
        category: 'team',
        question: 'What happens if the main founder leaves tomorrow?',
        weight: 1.0,
        options: [
            { label: 'Business stops', score: 0 },
            { label: 'Significant revenue impact', score: 4 },
            { label: 'Minor disruption', score: 8 },
            { label: 'Team runs autonomously', score: 10 },
        ]
    },

    // Financial Risk
    {
        id: 'customer_concentration',
        category: 'financial',
        question: 'What % of revenue comes from your largest customer?',
        weight: 1.2, // Critical
        options: [
            { label: '> 50% (Single Point of Failure)', score: 0 },
            { label: '20% - 50%', score: 4 },
            { label: '10% - 20%', score: 7 },
            { label: '< 10% (Diversified)', score: 10 },
        ]
    }
];

export interface RiskResult {
    totalScore: number; // 0 to 100
    riskLevel: 'Critical' | 'High' | 'Moderate' | 'Low' | 'Minimal';
    valuationDiscount: number; // Percentage discount to apply (e.g. 0.5 for 50% discount)
    summary: string;
}

export function calculateRiskScore(answers: Record<string, number>): RiskResult {
    let totalWeightedScore = 0;
    let totalMaxPossible = 0;

    RISK_FACTORS.forEach(factor => {
        const score = answers[factor.id] || 0;
        totalWeightedScore += score * factor.weight;
        totalMaxPossible += 10 * factor.weight;
    });

    const normalizedScore = (totalWeightedScore / totalMaxPossible) * 100;

    // Determine Risk Level & Valuation Discount
    // Higher Score = Lower Risk = Higher Valuation
    let riskLevel: RiskResult['riskLevel'];
    let valuationDiscount: number;
    let summary: string;

    if (normalizedScore >= 90) {
        riskLevel = 'Minimal';
        valuationDiscount = 0; // Premium
        summary = "Your business is highly resilient. Investors will pay a premium.";
    } else if (normalizedScore >= 75) {
        riskLevel = 'Low';
        valuationDiscount = 0.10; // 10% discount
        summary = "Strong fundamentals with minor optimization needed.";
    } else if (normalizedScore >= 60) {
        riskLevel = 'Moderate';
        valuationDiscount = 0.25;
        summary = "Average risk profile. Standard for many growing startups.";
    } else if (normalizedScore >= 40) {
        riskLevel = 'High';
        valuationDiscount = 0.50; // 50% discount
        summary = "Significant risks detected. Valuation will be heavily discounted.";
    } else {
        riskLevel = 'Critical';
        valuationDiscount = 0.80; // Unsellable?
        summary = "Major structural issues found. Focus on fixing these before raising.";
    }

    return {
        totalScore: Math.round(normalizedScore),
        riskLevel,
        valuationDiscount,
        summary
    };
}
