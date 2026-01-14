'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, HelpCircle } from 'lucide-react';

export default function ChurnCalculator() {
    // State
    const [startCustomers, setStartCustomers] = useState<number>(100);
    const [customersLost, setCustomersLost] = useState<number>(5);
    const [monthlyRecurringRevenue, setMonthlyRecurringRevenue] = useState<number>(5000);
    const [revenueLost, setRevenueLost] = useState<number>(250);

    // Results
    const [logoChurn, setLogoChurn] = useState<number>(0);
    const [revenueChurn, setRevenueChurn] = useState<number>(0);
    const [ltvImpact, setLtvImpact] = useState<number>(0);

    useEffect(() => {
        // Logo Churn = (Lost / Start) * 100
        const logoC = startCustomers > 0 ? (customersLost / startCustomers) * 100 : 0;
        setLogoChurn(Number(logoC.toFixed(2)));

        // Revenue Churn = (Revenue Lost / Total MRR) * 100
        const revC = monthlyRecurringRevenue > 0 ? (revenueLost / monthlyRecurringRevenue) * 100 : 0;
        setRevenueChurn(Number(revC.toFixed(2)));

    }, [startCustomers, customersLost, monthlyRecurringRevenue, revenueLost]);

    // Derived metric for impact visualization (Avg Customer Revenue)
    const arpu = startCustomers > 0 ? monthlyRecurringRevenue / startCustomers : 0;

    // Impact calculation: Revenue lost over 12 months if churn persists
    const annualLossStart = revenueLost * 12;

    return (
        <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Controls */}
            <div className="glass-card p-6 md:p-8 rounded-2xl bg-slate-900/60 border border-slate-800">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <RefreshCw className="w-5 h-5 text-brand-400" /> Inputs
                </h3>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Customers at Start of Month
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={startCustomers}
                                onChange={(e) => setStartCustomers(Number(e.target.value))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Customers Lost this Month
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={customersLost}
                                onChange={(e) => setCustomersLost(Number(e.target.value))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-800/50">
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Total MRR at Start of Month ($)
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={monthlyRecurringRevenue}
                                onChange={(e) => setMonthlyRecurringRevenue(Number(e.target.value))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            MRR Lost from Churned Customers ($)
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={revenueLost}
                                onChange={(e) => setRevenueLost(Number(e.target.value))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
                {/* Main Cards */}
                <div className="grid grid-cols-2 gap-4">
                    <div className={`p-6 rounded-2xl border ${logoChurn > 5 ? 'bg-rose-500/10 border-rose-500/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-center`}>
                        <div className="text-sm font-medium text-slate-400 mb-1">Logo Churn Rate</div>
                        <div className={`text-3xl font-bold ${logoChurn > 5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {logoChurn}%
                        </div>
                        <div className="text-xs text-slate-500 mt-2">Target: &lt; 3%</div>
                    </div>

                    <div className={`p-6 rounded-2xl border ${revenueChurn > 2 ? 'bg-orange-500/10 border-orange-500/20' : 'bg-emerald-500/10 border-emerald-500/20'} text-center`}>
                        <div className="text-sm font-medium text-slate-400 mb-1">Revenue Churn Rate</div>
                        <div className={`text-3xl font-bold ${revenueChurn > 2 ? 'text-orange-400' : 'text-emerald-400'}`}>
                            {revenueChurn}%
                        </div>
                        <div className="text-xs text-slate-500 mt-2">Target: Net Negative</div>
                    </div>
                </div>

                {/* Insight Card */}
                <div className="glass-card p-6 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden">
                    <div className="relative z-10">
                        <h4 className="text-lg font-bold text-white mb-2">The Cost of Churn</h4>
                        <p className="text-slate-400 text-sm mb-4">
                            If this churn rate persists for 1 year, you will lose:
                        </p>

                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-3xl font-bold text-white">${annualLossStart.toLocaleString()}</span>
                            <span className="text-slate-500 text-sm">/ year in current revenue</span>
                        </div>

                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mt-4">
                            <div
                                className="h-full bg-gradient-to-r from-rose-500 to-orange-500 transition-all duration-500"
                                style={{ width: `${Math.min(logoChurn * 12, 100)}%` }}
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            (~{Math.min((logoChurn * 12), 100).toFixed(0)}% of your current customer base would be gone)
                        </p>

                    </div>
                </div>

                {/* Explanation */}
                <div className="p-5 rounded-xl bg-blue-500/5 border border-blue-500/10">
                    <div className="flex gap-3">
                        <HelpCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-slate-300 space-y-2">
                            <p>
                                <strong className="text-blue-300">Logo Churn</strong> measures the percentage of customers who cancel. It indicates product satisfaction.
                            </p>
                            <p>
                                <strong className="text-blue-300">Revenue Churn</strong> measures the percentage of revenue lost. It helps determine if you are losing your highest or lowest paying customers.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
