'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    LineChart, Line
} from 'recharts';
import {
    ArrowUpRight, Download, Share2, TrendingUp, AlertTriangle,
    CheckCircle2, Target, Users, DollarSign
} from 'lucide-react';
import { formatCurrency, ValuationResult, ValuationInputs } from '@/lib/valuation';

interface ProDashboardProps {
    data: ValuationResult;
    inputs?: ValuationInputs;
}

export default function ProDashboard({ data, inputs }: ProDashboardProps) {
    const [activeScenario, setActiveScenario] = useState('base');

    // Prepare Chart Data
    const valuationMethodsData = data.valuations.map(v => ({
        name: v.method,
        value: v.value,
        color: '#14b8a6' // brand-500
    }));

    const riskData = [
        { subject: 'Growth', A: 80, B: 100, fullMark: 100 },
        { subject: 'Retention', A: data.confidence, B: 100, fullMark: 100 },
        { subject: 'Profit', A: 60, B: 100, fullMark: 100 },
        { subject: 'Market', A: 70, B: 100, fullMark: 100 },
        { subject: 'Tech', A: 90, B: 100, fullMark: 100 },
        { subject: 'Risk', A: 85, B: 100, fullMark: 100 },
    ];

    return (
        <div className="bg-slate-950 min-h-screen p-6 md:p-12 font-sans text-slate-100">

            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-brand-500/20 text-brand-400 border border-brand-500/30">PRO REPORT</span>
                        <span className="text-slate-500 text-sm">Generated just now</span>
                    </div>
                    <h1 className="text-3xl font-bold font-display">Valuation Dashboard</h1>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 transition-colors text-sm font-medium">
                        <Share2 className="w-4 h-4" /> Share
                    </button>
                    <button
                        onClick={() => {
                            const { generateProPDF } = require('@/lib/pdf-generator');
                            generateProPDF(data, inputs || {}, inputs?.companyName || 'Your SaaS');
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 text-white transition-colors text-sm font-medium shadow-lg shadow-brand-500/20"
                    >
                        <Download className="w-4 h-4" /> Export PDF
                    </button>
                </div>
            </header>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <KPICard
                    title="Estimated Value"
                    value={formatCurrency(data.avgValuation)}
                    trend="+12% vs last month"
                    icon={DollarSign}
                />
                <KPICard
                    title="Confidence Score"
                    value={`${data.confidence}%`}
                    trend="High Data Quality"
                    icon={Target}
                    trendColor="text-brand-400"
                />
                <KPICard
                    title="Multiplier Applied"
                    value={`${data.multiplier.toFixed(1)}x`}
                    trend="SaaS B2B Average: 5.2x"
                    icon={TrendingUp}
                />
                <KPICard
                    title="Buyer Demand"
                    value="Strong"
                    trend="3 Active Buyer Profiles"
                    icon={Users}
                    trendColor="text-emerald-400"
                />
            </div>

            {/* Main Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                {/* Left: Valuation Methods */}
                <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-xl font-bold font-display mb-6">Valuation Composition</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={valuationMethodsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                                    formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''}
                                />
                                <Bar dataKey="value" fill="#14b8a6" radius={[4, 4, 0, 0]} barSize={60} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-slate-400 text-sm mt-4 text-center">
                        We triagulate your value using {data.valuations.length} distinct methodologies to ensure accuracy.
                    </p>
                </div>

                {/* Right: Benchmarking Radar */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-xl font-bold font-display mb-6">Peer Benchmarking</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={riskData}>
                                <PolarGrid stroke="#334155" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar name="You" dataKey="A" stroke="#14b8a6" strokeWidth={2} fill="#14b8a6" fillOpacity={0.3} />
                                <Radar name="Top Quartile" dataKey="B" stroke="#64748b" strokeWidth={1} fill="#64748b" fillOpacity={0.1} strokeDasharray="4 4" />
                                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-slate-400 text-sm mt-4 text-center">
                        You are outperforming peers in <strong>Technology</strong> but lagging in <strong>Profit</strong>.
                    </p>
                </div>
            </div>

            {/* Action Plan & Scenarios */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold font-display">Value Uplift Actions</h3>
                        <span className="text-xs text-brand-400 font-medium px-2 py-1 bg-brand-500/10 rounded-full border border-brand-500/20">Potential +$240k</span>
                    </div>
                    <div className="space-y-4">
                        <ActionItem
                            title="Reduce Churn to < 4%"
                            impact="High Impact"
                            desc="Your 5% churn is dragging the multiple. Implement an onboarding email sequence."
                        />
                        <ActionItem
                            title="Extend Runway"
                            impact="Medium Impact"
                            desc="12 months runway is borderline. Cutting burn by 10% solves this."
                        />
                        <ActionItem
                            title="Document IP Ownership"
                            impact="Low Impact"
                            desc="Formalize your code ownership to pass 'fully-owned' due diligence."
                            resolved={true}
                        />
                    </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px] rounded-full pointer-events-none" />
                    <h3 className="text-xl font-bold font-display mb-2">Exit Scenarios</h3>
                    <p className="text-slate-400 text-sm mb-6">Projected valuation based on different growth paths.</p>

                    <div className="space-y-6">
                        <ScenarioRow label="Conservative" value={data.avgValuation * 0.8} growth="10%" color="text-slate-400" />
                        <ScenarioRow label="Base Case" value={data.avgValuation} growth="20%" color="text-white" active />
                        <ScenarioRow label="Optimistic" value={data.avgValuation * 1.5} growth="40%" color="text-brand-400" />
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-700/50">
                        <h4 className="text-sm font-bold text-slate-300 mb-3">Ideally Suited Buyers</h4>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300 border border-slate-700">Micro-PE Funds</span>
                            <span className="px-3 py-1 bg-slate-800 rounded-full text-xs text-slate-300 border border-slate-700">Strategic Competitors</span>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
}

function KPICard({ title, value, trend, icon: Icon, trendColor = "text-slate-400" }: any) {
    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                    <Icon className="w-5 h-5" />
                </div>
                {/* Sparkline placeholder could go here */}
            </div>
            <div className="text-3xl font-bold text-white mb-1">{value}</div>
            <div className="text-sm text-slate-500 font-medium">{title}</div>
            <div className={`text-xs mt-3 flex items-center gap-1 ${trendColor}`}>
                <ArrowUpRight className="w-3 h-3" /> {trend}
            </div>
        </div>
    );
}

function ActionItem({ title, impact, desc, resolved }: any) {
    return (
        <div className={`p-4 rounded-xl border transition-all cursor-pointer group
      ${resolved ? 'bg-slate-900/30 border-slate-800 opacity-50' : 'bg-slate-800/40 border-slate-700 hover:border-brand-500/50 hover:bg-slate-800/60'}
    `}>
            <div className="flex justify-between items-start mb-1">
                <h4 className={`font-semibold text-sm ${resolved ? 'line-through text-slate-500' : 'text-slate-200 group-hover:text-brand-300'}`}>
                    {title}
                </h4>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider
          ${impact.includes('High') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-slate-700 text-slate-400'}
        `}>
                    {impact}
                </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{desc}</p>
        </div>
    );
}

function ScenarioRow({ label, value, growth, color, active }: any) {
    return (
        <div className={`flex items-center justify-between p-3 rounded-lg transition-all
       ${active ? 'bg-white/5 border border-white/10' : 'hover:bg-white/5 border border-transparent'}
    `}>
            <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${active ? 'bg-brand-500' : 'bg-slate-700'}`} />
                <span className="text-sm font-medium text-slate-300">{label}</span>
            </div>
            <div className="text-right">
                <div className={`font-bold ${color}`}>{formatCurrency(value)}</div>
                <div className="text-xs text-slate-500">at {growth} growth</div>
            </div>
        </div>
    );
}
