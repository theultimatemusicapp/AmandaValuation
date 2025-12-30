import { ValuationInputs } from "./valuation";

/**
 * "AI" Consultant Engine
 * Generates dynamic, context-aware feedback based on valuation inputs.
 * This simulates an AI response using deterministic expert logic.
 */
export function generateAIAnalysis(inputs: ValuationInputs, companyName: string): string {
    const analysis: string[] = [];

    // Intro
    const introOptions = [
        `I've analyzed the metrics for ${companyName}, and the data tells a specific story about your market position.`,
        `Based on the ${inputs.yearsOperating || 2} years of operating history provided, ${companyName} shows distinct patterns consistent with ${getStage(inputs.arr)} SaaS companies.`,
        `Running your numbers against our database of SaaS exits, ${companyName} stands out in a few key areas while showing clear optimization opportunities in others.`
    ];
    analysis.push(introOptions[Math.floor(Math.random() * introOptions.length)]);

    // Growth Analysis
    if (inputs.growthYoy > 50) {
        analysis.push(`🚀 **Hyper-Growth Trajectory**: Your ${inputs.growthYoy}% YoY growth is the single biggest driver of your valuation right now. Investors will pay a premium for this velocity. The key challenge is to maintain this pace without blowing up your CAC (currently $${inputs.cac || 'N/A'}).`);
    } else if (inputs.growthYoy > 20) {
        analysis.push(`📈 **Healthy Scaling**: Growing at ${inputs.growthYoy}% puts you in the "Steady State" bucket. To unlock a higher multiple (5x+), you typically need to either accelerate growth above 30% or significantly improve profitability margins.`);
    } else {
        analysis.push(`⚠️ **Growth Warning**: At ${inputs.growthYoy}% growth, your valuation is heavily anchored to your multiple of profit (EBITDA) rather than revenue. To exit successfully, you must maximize net profit margins immediately.`);
    }

    // Churn / Retention
    if (inputs.customerChurn < 2) {
        analysis.push(`💎 **World-Class Retention**: Your ${inputs.customerChurn}% monthly churn is exceptional. This "sticky" revenue is extremely attractive to Private Equity buyers because it implies a very high Lifetime Value (LTV).`);
    } else if (inputs.customerChurn > 5) {
        analysis.push(`🩸 **Churn Alert**: A ${inputs.customerChurn}% monthly churn rate effectively means you are replacing your entire customer base every ~18 months. This is a "leaky bucket." Fixing this capability is the #1 way to double your valuation in the next 12 months.`);
    }

    // Profitability / Rule of 40
    const margin = (inputs.netProfit / inputs.arr) * 100;
    const ruleOf40 = inputs.growthYoy + margin;

    if (ruleOf40 > 40) {
        analysis.push(`🌟 **Rule of 40 Elite**: You have a combined score of ${ruleOf40.toFixed(1)}, passing the famous "Rule of 40" benchmark. This signals to investors that you are efficiently balancing growth and profitability. You are in the top tier of investable assets.`);
    } else {
        analysis.push(`📉 **Efficiency Gap**: Your Rule of 40 score is ${ruleOf40.toFixed(1)} (Benchmark is 40). You are currently prioritizing ${inputs.growthYoy > margin ? 'growth' : 'profitability'}, but not efficiently enough to impress top-tier acquirers yet.`);
    }

    // Closing
    analysis.push(`**Strategic Recommendation**: ${getRecommendation(inputs.customerChurn, inputs.growthYoy, margin)}`);

    return analysis.join("\n\n");
}

function getStage(arr: number): string {
    if (arr < 1000000) return "Early-Stage";
    if (arr < 10000000) return "Growth-Stage";
    return "Scale-Up";
}

function getRecommendation(churn: number, growth: number, margin: number): string {
    if (churn > 5) return "Pause acquisition efforts and focus 100% on product stickiness and customer success. Reduce churn below 3% before scaling.";
    if (growth < 20 && margin < 10) return "You are in the 'Danger Zone' of low growth and low profit. You must pick a lane: either aggressively cut costs to become a cash-cow, or reinvest heavily to spark growth.";
    if (growth > 50) return "Double down on what works. Raise capital if needed to capture market share while your unit economics hold up.";
    return "Optimize your pricing model. Increasing prices by 10% usually drops straight to the bottom line and improves your valuation multiple instantly.";
}
