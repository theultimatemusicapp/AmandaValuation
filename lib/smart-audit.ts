
export interface AuditFinding {
    id: string;
    text: string; // The detected keyword or phrase
    category: 'legal' | 'financial' | 'operational' | 'market';
    severity: 'high' | 'medium' | 'low';
    explanation: string;
}

export interface AuditResult {
    score: number; // 0 to 100
    findings: AuditFinding[];
    summary: string;
}

interface Rule {
    patterns: RegExp[];
    category: AuditFinding['category'];
    severity: AuditFinding['severity'];
    explanation: string;
}

const RULES: Rule[] = [
    // Legal Risks
    {
        patterns: [/lawsuit/i, /litigation/i, /suing/i, /dispute/i, /settlement/i],
        category: 'legal',
        severity: 'high',
        explanation: 'Mention of legal disputes or litigation is a major red flag for investors.'
    },
    {
        patterns: [/ip infringement/i, /copyright claim/i, /cease and desist/i],
        category: 'legal',
        severity: 'high',
        explanation: 'Intellectual property disputes can shut down a SaaS company instantly.'
    },

    // Financial Risks
    {
        patterns: [/declining revenue/i, /revenue down/i, /sales drop/i],
        category: 'financial',
        severity: 'high',
        explanation: 'Declining revenue signals product-market fit issues or high churn.'
    },
    {
        patterns: [/cash flow negative/i, /burning cash/i, /short runway/i],
        category: 'financial',
        severity: 'medium',
        explanation: 'Cash flow issues may force a fire sale or desperate fundraise.'
    },
    {
        patterns: [/high churn/i, /retention issues/i, /users leaving/i],
        category: 'financial',
        severity: 'high',
        explanation: 'High churn destroys LTV. Investors view this as a bucket with a hole in it.'
    },

    // Operational / Team
    {
        patterns: [/founder dispute/i, /co-founder leaving/i, /key employee left/i],
        category: 'operational',
        severity: 'medium',
        explanation: 'Team instability, especially at the founder level, creates execution risk.'
    },
    {
        patterns: [/rewrite/i, /technical debt/i, /legacy code/i],
        category: 'operational',
        severity: 'medium',
        explanation: 'Significant technical debt means the buyer has to invest heavily in engineering post-close.'
    }
];

export function analyzeText(text: string): AuditResult {
    const findings: AuditFinding[] = [];
    let score = 100;

    // Normalize text
    const cleanText = text.toLowerCase();

    RULES.forEach((rule, index) => {
        rule.patterns.forEach(pattern => {
            if (pattern.test(cleanText)) {
                // Check if we already found this exact issue to avoid duplicates from multiple regex matches
                const alreadyFound = findings.some(f => f.explanation === rule.explanation);

                if (!alreadyFound) {
                    findings.push({
                        id: `finding-${index}`,
                        text: pattern.toString().replace(/\//g, '').replace(/i/g, ''), // Rough display of pattern
                        category: rule.category,
                        severity: rule.severity,
                        explanation: rule.explanation
                    });

                    // Deduct points
                    if (rule.severity === 'high') score -= 15;
                    if (rule.severity === 'medium') score -= 10;
                    if (rule.severity === 'low') score -= 5;
                }
            }
        });
    });

    // Floor score at 0
    score = Math.max(0, score);

    let summary = "Your document looks clean. No obvious red flags detected.";
    if (score < 50) summary = "CRITICAL ISSUES FOUND. This document contains multiple keywords that will scare off investors.";
    else if (score < 80) summary = "Several concerns detected. Be prepared to explain these points during due diligence.";

    return {
        score,
        findings,
        summary
    };
}
