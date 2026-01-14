'use client';

import { useState, useEffect } from 'react';
import { Activity, Flame, Calendar, TrendingUp } from 'lucide-react';

export default function BurnRateCalculator() {
    // Inputs
    const [cashBalance, setCashBalance] = useState<number>(250000);
    const [monthlyBurn, setMonthlyBurn] = useState<number>(25000);
    const [revenueGrowth, setRevenueGrowth] = useState<number>(0); // Optional advanced input for future

    // Results
    const [runwayMonths, setRunwayMonths] = useState<number>(0);
    const [deathDate, setDeathDate] = useState<string>("");

    useEffect(() => {
        // Runway = Cash / Burn
        const runway = monthlyBurn > 0 ? cashBalance / monthlyBurn : 999;

        setRunwayMonths(Number(runway.toFixed(1)));

        // Calculate Date
        if (runway !== 999) {
            const date = new Date();
            date.setMonth(date.getMonth() + Math.floor(runway));
            date.setDate(date.getDate() + Math.round((runway % 1) * 30));
            setDeathDate(date.toLocaleDateString(undefined, { month: 'long', year: 'numeric', day: 'numeric' }));
        } else {
            setDeathDate("Infinite");
        }

    }, [cashBalance, monthlyBurn]);

    const isUrgent = runwayMonths < 6;
    const isHealthy = runwayMonths > 18;

    return (
        <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Inputs */}
            <div className="glass-card p-6 md:p-8 rounded-2xl bg-slate-900/60 border border-slate-800">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-amber-500" /> Inputs
                </h3>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Current Cash Balance ($)
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                            <input
                                type="number"
                                value={cashBalance}
                                onChange={(e) => setCashBalance(Number(e.target.value))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Net Monthly Burn ($)
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                            <input
                                type="number"
                                value={monthlyBurn}
                                onChange={(e) => setMonthlyBurn(Number(e.target.value))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-4 py-3 text-white focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors"
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                            (Expenses - Revenue). If you are profitable, enter 0.
                        </p>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
                <div className={`p-8 rounded-2xl border text-center relative overflow-hidden transition-colors duration-500
                    ${isUrgent ? 'bg-red-500/10 border-red-500/20' : isHealthy ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>

                    <div className="relative z-10">
                        <div className={`text-sm font-bold uppercase tracking-wider mb-2
                            ${isUrgent ? 'text-red-300' : isHealthy ? 'text-emerald-300' : 'text-amber-300'}`}>
                            Runway
                        </div>
                        <div className="text-6xl font-black text-white mb-2">
                            {runwayMonths === 999 ? "∞" : runwayMonths}
                            <span className="text-2xl text-slate-400 font-normal ml-2">months</span>
                        </div>
                        <p className="text-slate-300 text-sm opacity-80">
                            Until {deathDate}
                        </p>
                    </div>
                </div>

                {/* Insight Panel */}
                <div className="space-y-4">
                    <div className="glass-card p-5 rounded-xl border border-slate-800">
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`w-3 h-3 rounded-full ${isUrgent ? 'bg-red-500' : isHealthy ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            <h4 className="font-bold text-white">Status Analysis</h4>
                        </div>
                        <p className="text-slate-400 text-sm">
                            {isUrgent && "CRITICAL. You have less than 6 months of cash. You need to raise capital or cut costs immediately."}
                            {isHealthy && "HEALTHY. You have over 18 months of runway. Focus on growth and efficient scaling."}
                            {!isUrgent && !isHealthy && "CAUTION. You have 6-18 months. You should start planning your next fundraise or path to profitability within the next 3 months."}
                        </p>
                    </div>

                    <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                        <div>
                            <div className="text-sm text-slate-400 mb-1">Daily Burn Rate</div>
                            <div className="text-xl font-bold text-white">${Math.round(monthlyBurn / 30).toLocaleString()} <span className="text-sm font-normal text-slate-500">/ day</span></div>
                        </div>
                        <Activity className="w-8 h-8 text-slate-700" />
                    </div>
                </div>
            </div>
        </div>
    );
}
