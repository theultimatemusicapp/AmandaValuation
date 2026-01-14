
/**
 * Seller Discretionary Earnings (SDE) Valuation Engine
 * 
 * This engine calculates valuation based on SDE, which is the standard for sub-$5M SaaS companies.
 * SDE = Net Profit + Owner Salary + Personal Expenses + One-off Expenses
 */

export interface ValuationInputs {
    revenue: number;
    netProfit: number; // Annual
    growthRate: number; // Percentage (e.g., 20 for 20%)
    churnRate: number; // Monthly churn percentage
    ownerPay: number; // Add-back
    personalExpenses: number; // Add-back
}

export interface ValuationResult {
    sde: number;
    baseValuation: number;
    multiple: number;
    range: {
        low: number;
        high: number;
    };
    explanation: string;
}

// Hardcoded "Live" Benchmark Data (Simulated)
const BENCHMARKS = {
    baseMultiple: 3.0, // Base multiple of SDE
    growthPremium: 0.1, // Add 0.1x for every 10% growth > 20%
    churnPenalty: 0.2, // Subtract 0.2x for every 1% churn > 5%
    sizePremium: 0.5, // Add 0.5x if SDE > $500k
};

export function calculateValuation(inputs: ValuationInputs): ValuationResult {
    // 1. Calculate SDE
    const sde = inputs.netProfit + inputs.ownerPay + inputs.personalExpenses;

    // 2. Determine Multiple
    let multiple = BENCHMARKS.baseMultiple;

    // Growth Adjustment
    if (inputs.growthRate > 20) {
        const extraGrowth = Math.floor((inputs.growthRate - 20) / 10);
        multiple += extraGrowth * BENCHMARKS.growthPremium;
    }

    // Churn Adjustment
    if (inputs.churnRate > 5) {
        const extraChurn = Math.floor(inputs.churnRate - 5);
        multiple -= extraChurn * BENCHMARKS.churnPenalty;
    }

    // Size Adjustment
    if (sde > 500000) {
        multiple += BENCHMARKS.sizePremium;
    }

    // Floor and Ceiling for safety
    multiple = Math.max(1.5, Math.min(multiple, 8.0));

    // 3. Calculate Valuation
    const baseValuation = sde * multiple;

    // 4. Generate Range (+/- 15%)
    const range = {
        low: baseValuation * 0.85,
        high: baseValuation * 1.15
    };

    return {
        sde,
        baseValuation,
        multiple: parseFloat(multiple.toFixed(2)),
        range,
        explanation: `Based on an SDE of $${sde.toLocaleString()} and a multiple of ${multiple.toFixed(2)}x.`
    };
}
