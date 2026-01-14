'use client';

import { useState, useEffect } from 'react';
import { DollarSign, Clock, HelpCircle, AlertCircle } from 'lucide-react';

export default function LTVCalculator() {
    // Inputs
    const [arpa, setArpa] = useState<number>(100);
    const [churnRate, setChurnRate] = useState<number>(5);
    const [grossMargin, setGrossMargin] = useState<number>(80);

    // Results
    const [ltv, setLtv] = useState<number>(0);
    const [lifespan, setLifespan] = useState<number>(0);

    useEffect(() => {
        // Customer Lifetime (Months) = 1 / Churn Rate
        // Convert churn from percentage (5) to decimal (0.05)
        const churnDecimal = churnRate / 100;
        const calcLifespan = churnDecimal > 0 ? 1 / churnDecimal : 0;
        setLifespan(Number(calcLifespan.toFixed(1)));

        // LTV = (ARPA * Gross Margin %) / Churn Rate
        // Or: (ARPA * Gross Margin %) * Lifespan
        const marginDecimal = grossMargin / 100;
        const calcLtv = churnDecimal > 0 ? (arpa * marginDecimal) / churnDecimal : 0;
        setLtv(Number(calcLtv.toFixed(0)));

    }, [arpa, churnRate, grossMargin]);

    return (
        <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Inputs */}
            <div className="glass-card p-6 md:p-8 rounded-2xl bg-slate-900/60 border border-slate-800">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-400" /> Inputs
                </h3>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Average Revenue Per Account (ARPA) / Monthly
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                            <input
                                type="number"
                                value={arpa}
                                onChange={(e) => setArpa(Number(e.target.value))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Monthly Churn Rate (%)
                        </label>
                        <div className="relative">
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                            <input
                                type="number"
                                step="0.1"
                                value={churnRate}
                                onChange={(e) => setChurnRate(Number(e.target.value))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Gross Margin (%)
                        </label>
                        <div className="relative">
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                            <input
                                type="number"
                                value={grossMargin}
                                onChange={(e) => setGrossMargin(Number(e.target.value))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            Typically 70-90% for SaaS (Revenue minus COGS/Hosting/Support).
                        </p>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
                <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="text-sm font-bold uppercase tracking-wider text-emerald-300 mb-2">Customer Lifetime Value (LTV)</div>
                        <div className="text-5xl md:text-6xl font-black text-white mb-4 shadow-emerald-500/50 drop-shadow-sm">
                            ${ltv.toLocaleString()}
                        </div>
                        <p className="text-emerald-200/60 text-sm">
                            Based on a {lifespan} month average lifespan
                        </p>
                    </div>
                    {/* Decorative background blur */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-emerald-500/20 blur-[50px] rounded-full" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="text-sm text-slate-400 mb-1 flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Avg Lifespan
                        </div>
                        <div className="text-2xl font-bold text-white">{lifespan} Months</div>
                    </div>
                    <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="text-sm text-slate-400 mb-1 flex items-center gap-2">
                            <DollarSign className="w-4 h-4" /> Lifetime Gross Profit
                        </div>
                        <div className="text-2xl font-bold text-white">${ltv.toLocaleString()}</div>
                    </div>
                </div>

                {/* Insight Panel */}
                <div className="p-5 rounded-xl bg-blue-500/5 border border-blue-500/10">
                    <div className="flex gap-3 items-start">
                        <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-slate-300">
                            <h4 className="font-bold text-blue-300 mb-1">LTV:CAC Ratio Rule</h4>
                            <p className="mb-2">
                                A healthy SaaS business should tend towards an LTV:CAC ratio of <strong>3:1 or higher</strong>.
                            </p>
                            <p>
                                Meaning: If your LTV is <span className="text-white font-bold">${ltv.toLocaleString()}</span>, you should spend no more than <span className="text-white font-bold">${Math.round(ltv / 3).toLocaleString()}</span> to acquire a customer.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
