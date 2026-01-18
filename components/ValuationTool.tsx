'use client';

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Activity, Info, DollarSign, Shield, Percent, TrendingUp, ShieldCheck, Calculator } from 'lucide-react';
import { generateFreePDF } from '@/lib/pdf-generator';
import { calculateSaaSValuation, ValuationInputs, ValuationResult, formatCurrency } from '@/lib/valuation';
import { trackCalculatorEvent } from '@/lib/analytics';

const STEPS = [
    { id: 'financials', title: 'Financials' },
    { id: 'growth', title: 'Growth' },
    { id: 'risk', title: 'Risk' },
    { id: 'results', title: 'Valuation' },
];

const STEP_INSIGHTS = [
    {
        title: "The Financial Engine",
        description: "Your revenue quality determines your multiple. Recurring revenue is the gold standard.",
        tip: "Focus on SDE (Seller's Discretionary Earnings). Add back your own salary to show the true cash flow potential.",
        icon: DollarSign
    },
    {
        title: "Growth & Retention",
        description: "Growth proves demand. Retention proves value. High retention is the #1 way to boost valuation.",
        tip: "A 'Net Dollar Retention' (NDR) over 100% means you grow even without new customers. This is the Holy Grail.",
        icon: TrendingUp
    },
    {
        title: "Risk Assessment",
        description: "Risk reduces value. Buyers discount heavily for legal issues, weak IP, or key-person dependency.",
        tip: "Owning your IP (Intellectual Property) is non-negotiable for 90% of strategic exits.",
        icon: ShieldCheck
    },
    {
        title: "Your Valuation",
        description: "Based on your inputs, we've calculated a fair market range using 4 different methodologies.",
        tip: "This is a starting point. Strategic buyers may pay 20-50% more for strategic fit.",
        icon: Calculator
    }
];

export default function ValuationWizard() {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<ValuationInputs>({
        companyName: '',
        contactName: '',
        email: '',
        arr: 0,
        netProfit: 0,
        growthYoy: 0,
        customerChurn: 5,
        retentionRate: 90,
        nps: 40,
        legalIssues: 'none',
        ipOwnership: 'fully-owned',
        businessTypeMultiplier: 5,
        discountRate: 0.1,
        grossMargin: 70,
        ltv: 0,
        cac: 0,
    });

    const [emailFormOpen, setEmailFormOpen] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [submitError, setSubmitError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [honeypot, setHoneypot] = useState('');
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

    const result = useMemo<ValuationResult>(() => calculateSaaSValuation(formData), [formData]);
    const hasStartedRef = useRef(false);
    const hasViewedResultRef = useRef(false);
    const copyTimeoutRef = useRef<number | null>(null);
    const resultsStepIndex = STEPS.length - 1;

    const analyticsPayload = useMemo(() => ({
        currency: 'USD',
        revenue_type: 'ARR',
        has_optional_inputs: Boolean(formData.cac || formData.ltv),
    }), [formData.cac, formData.ltv]);

    const handleCalculatorInputChange = (field: keyof ValuationInputs, value: any) => {
        if (!hasStartedRef.current) {
            trackCalculatorEvent('calculator_start', analyticsPayload);
            hasStartedRef.current = true;
        }
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleContactChange = (field: 'companyName' | 'contactName' | 'email', value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const handleCopyResults = async () => {
        if (!result.avgValuation) {
            setCopyStatus('error');
            return;
        }

        const text = [
            `Estimated Valuation: ${formatCurrency(result.avgValuation)}`,
            `Range: ${formatCurrency(result.rangeLow)} - ${formatCurrency(result.rangeHigh)}`,
            `Revenue Multiple: ${result.revenueMultiple.toFixed(1)}x`,
            `Rule of 40: ${result.ruleOf40.toFixed(1)}%`,
        ].join('\n');

        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(text);
                setCopyStatus('copied');
            } else {
                setCopyStatus('error');
            }
        } catch (err) {
            setCopyStatus('error');
            if (process.env.NODE_ENV === 'development') {
                console.error('Failed to copy valuation results:', err);
            }
        }
    };

    const validateEmail = (email: string) => /[^@\s]+@[^@\s]+\.[^@\s]+/.test(email);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitError('');
        setEmailError('');

        if (honeypot) {
            return;
        }

        if (!validateEmail(formData.email)) {
            setEmailError('Please enter a valid email address.');
            return;
        }

        setSubmitStatus('submitting');

        try {
            const response = await fetch('https://formspree.io/f/mnnnoogg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    subject: `New Free Valuation - ${formData.companyName || 'Anonymous'}`,
                    companyName: formData.companyName,
                    contactName: formData.contactName,
                    email: formData.email,
                    valuationEstimate: result.avgValuation,
                    rangeLow: result.rangeLow,
                    rangeHigh: result.rangeHigh,
                    revenueMultiple: result.revenueMultiple,
                    ruleOf40: result.ruleOf40,
                    inputs: {
                        arr: formData.arr,
                        netProfit: formData.netProfit,
                        growthYoy: formData.growthYoy,
                        grossMargin: formData.grossMargin,
                        customerChurn: formData.customerChurn,
                        retentionRate: formData.retentionRate,
                        nps: formData.nps,
                        cac: formData.cac,
                        ltv: formData.ltv,
                    },
                }),
            });

            if (!response.ok) {
                setSubmitStatus('error');
                setSubmitError('Something went wrong while sending your valuation. Please try again.');
                trackCalculatorEvent('calculator_submit_error', analyticsPayload);
                if (process.env.NODE_ENV === 'development') {
                    console.error('Formspree submission failed:', await response.text());
                }
                return;
            }

            setSubmitStatus('success');
            trackCalculatorEvent('calculator_submit_success', analyticsPayload);
        } catch (err) {
            setSubmitStatus('error');
            setSubmitError('Something went wrong while sending your valuation. Please try again.');
            trackCalculatorEvent('calculator_submit_error', analyticsPayload);
            if (process.env.NODE_ENV === 'development') {
                console.error('Formspree submission failed:', err);
            }
        }
    };

    useEffect(() => {
        if (currentStep === resultsStepIndex && !hasViewedResultRef.current) {
            trackCalculatorEvent('calculator_result_view', analyticsPayload);
            hasViewedResultRef.current = true;
        }
    }, [currentStep, analyticsPayload, resultsStepIndex]);

    useEffect(() => {
        if (copyStatus === 'copied') {
            if (copyTimeoutRef.current) {
                window.clearTimeout(copyTimeoutRef.current);
            }
            copyTimeoutRef.current = window.setTimeout(() => setCopyStatus('idle'), 2000);
        }
    }, [copyStatus]);

    useEffect(() => () => {
        if (copyTimeoutRef.current) {
            window.clearTimeout(copyTimeoutRef.current);
        }
    }, []);

    const stepVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 }
    };

    return (
        <section id="valuation-tool" className="py-24 bg-slate-900 border-y border-slate-800 relative overflow-hidden print-reset">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-500/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Free Valuation Calculator</h2>
                    <p className="text-slate-400">Answer a few questions to get your instant valuation range.</p>
                </div>

                {/* Wizard Card with Split Layout */}
                <div className="bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden min-h-[600px] flex flex-col md:flex-row">

                    {/* Left: Form Area */}
                    <div className="flex-1 p-8 md:p-12 relative">
                        {/* Progress Indicator (Simple) */}
                        <div className="mb-8">
                            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Step {currentStep + 1} of {STEPS.length}</span>
                        </div>

                        <AnimatePresence mode="wait">

                            {/* STEP 0: FINANCIALS */}
                            {currentStep === 0 && (
                                <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                                    <h3 className="text-2xl font-bold font-display mb-6">Financial Metrics</h3>
                                    <div className="grid grid-cols-1 gap-6">
                                        <InputGroup
                                            label="Annual Recurring Revenue (ARR)"
                                            sub="The lifeblood of SaaS valuation. It represents your committed subscription revenue over a 12-month period, excluding one-time fees. High-quality ARR with low churn commands the highest multiples."
                                            value={formData.arr}
                                            onChange={(v) => handleCalculatorInputChange('arr', Number(v))}
                                            type="number"
                                            prefix="$"
                                        />
                                        <InputGroup
                                            label="Net Profit (Last 12 Months)"
                                            sub="Calculated as EBITDA or Seller's Discretionary Earnings (SDE). For bootstrapped SaaS, SDE is the gold standard for valuation, adding back the founder's salary to show true earning potential."
                                            value={formData.netProfit}
                                            onChange={(v) => handleCalculatorInputChange('netProfit', Number(v))}
                                            type="number"
                                            prefix="$"
                                        />
                                        <InputGroup
                                            label="YoY Growth Rate"
                                            sub="The percentage increase in revenue compared to the previous year. Strategic buyers often pay a significant 'growth premium' for companies scaling at >50% annually while maintaining efficiency."
                                            value={formData.growthYoy}
                                            onChange={(v) => handleCalculatorInputChange('growthYoy', Number(v))}
                                            type="number"
                                            suffix="%"
                                        />
                                        <InputGroup
                                            label="Gross Margin"
                                            sub="The percentage of revenue retained after Cost of Goods Sold (COGS). For SaaS, >80% is excellent. High margins justify higher multiples."
                                            value={formData.grossMargin}
                                            onChange={(v) => handleCalculatorInputChange('grossMargin', Number(v))}
                                            type="number"
                                            suffix="%"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 1: GROWTH & CHURN */}
                            {currentStep === 1 && (
                                <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                                    <h3 className="text-2xl font-bold font-display mb-6">Health Metrics</h3>
                                    <div className="grid grid-cols-1 gap-6">
                                        <InputGroup
                                            label="Monthly Churn Rate"
                                            sub="The 'leaky bucket' metric. It measures the percentage of customers or revenue lost each month. Excessive churn is the #1 value killer in SaaS; anything under 3% is considered healthy for SMB SaaS."
                                            value={formData.customerChurn}
                                            onChange={(v) => handleCalculatorInputChange('customerChurn', Number(v))}
                                            type="number"
                                            suffix="%"
                                        />
                                        <InputGroup
                                            label="Net Dollar Retention"
                                            sub="A measure of how much your revenue grows from existing customers after accounting for churn and expansion. NDR over 100% indicates a highly scalable 'negative churn' environment."
                                            value={formData.retentionRate}
                                            onChange={(v) => handleCalculatorInputChange('retentionRate', Number(v))}
                                            type="number"
                                            suffix="%"
                                        />
                                        <InputGroup
                                            label="NPS Score"
                                            sub="Net Promoter Score reflects customer loyalty. High NPS (50+) typically correlates with lower churn and higher referral-based growth, creating a 'soft moat' that investors value."
                                            value={formData.nps}
                                            onChange={(v) => handleCalculatorInputChange('nps', Number(v))}
                                            type="number"
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputGroup
                                                label="CAC"
                                                sub="Customer Acquisition Cost."
                                                value={formData.cac}
                                                onChange={(v) => handleCalculatorInputChange('cac', Number(v))}
                                                type="number"
                                                prefix="$"
                                            />
                                            <InputGroup
                                                label="LTV"
                                                sub="Lifetime Value."
                                                value={formData.ltv}
                                                onChange={(v) => handleCalculatorInputChange('ltv', Number(v))}
                                                type="number"
                                                prefix="$"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 2: RISK */}
                            {currentStep === 2 && (
                                <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                                    <h3 className="text-2xl font-bold font-display mb-6">Risk Profile</h3>
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <label className="block text-sm font-medium text-slate-300">Legal Issues</label>
                                                <div className="group relative">
                                                    <Info className="w-3.5 h-3.5 text-slate-500 cursor-help" />
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 border border-slate-700 rounded-lg text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                                                        Pending litigation or compliance issues significantly increase the 'Risk Discount' applied during due diligence.
                                                    </div>
                                                </div>
                                            </div>
                                            <select
                                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                                                value={formData.legalIssues}
                                                onChange={(e) => handleCalculatorInputChange('legalIssues', e.target.value)}
                                            >
                                                <option value="none">None - Clean Record</option>
                                                <option value="minor">Minor - Resolved Disputes</option>
                                                <option value="major">Major - Active Litigation</option>
                                            </select>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <label className="block text-sm font-medium text-slate-300">IP Ownership</label>
                                                <div className="group relative">
                                                    <Info className="w-3.5 h-3.5 text-slate-500 cursor-help" />
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 border border-slate-700 rounded-lg text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                                                        Proprietary intellectual property creates a moat. Buyers pay more for fully-owned tech compared to white-labeled or licensed stacks.
                                                    </div>
                                                </div>
                                            </div>
                                            <select
                                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                                                value={formData.ipOwnership}
                                                onChange={(e) => handleCalculatorInputChange('ipOwnership', e.target.value)}
                                            >
                                                <option value="fully-owned">Fully Owned (Patented/Copyrighted)</option>
                                                <option value="semiprivate">Parial / Licensed</option>
                                                <option value="none">None / Open Source</option>
                                            </select>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <label className="block text-sm font-medium text-slate-300">Primary Business Model</label>
                                                <div className="group relative">
                                                    <Info className="w-3.5 h-3.5 text-slate-500 cursor-help" />
                                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 border border-slate-700 rounded-lg text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                                                        Enterprise SaaS often commands higher multiples due to contract longevity and 'stickiness' compared to B2C or Marketplaces.
                                                    </div>
                                                </div>
                                            </div>
                                            <select
                                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                                                value={formData.businessTypeMultiplier}
                                                onChange={(e) => handleCalculatorInputChange('businessTypeMultiplier', Number(e.target.value))}
                                            >
                                                <option value={5}>SaaS (B2B) - Standard</option>
                                                <option value={7}>SaaS (Enterprise) - High Value</option>
                                                <option value={4}>SaaS (B2C) - High Volume</option>
                                                <option value={3.5}>Marketplace</option>
                                            </select>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3: RESULTS CARD (SIMPLE) */}
                            {currentStep === 3 && result && (
                                <motion.div key="step4" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
                                    {/* Result Card */}
                                    <div className="text-center mb-8">
                                        <h3 className="text-2xl font-bold font-display mb-2">Your Estimated Valuation</h3>
                                        <p className="text-slate-400 text-sm">Based on {result.valuations.length} valuation method{result.valuations.length > 1 ? 's' : ''}</p>
                                    </div>

                                    {/* Main Valuation Display */}
                                    <div className="bg-gradient-to-br from-brand-500/10 to-brand-600/10 border border-brand-500/30 rounded-2xl p-8 mb-6">
                                        <div className="text-center">
                                            <p className="text-sm text-brand-300 mb-2 uppercase tracking-wide">Estimated Value</p>
                                            <p className="text-5xl md:text-6xl font-bold text-white mb-4">{formatCurrency(result.avgValuation)}</p>
                                            <div className="flex items-center justify-center gap-4 text-slate-300 mb-4">
                                                <div className="text-center">
                                                    <p className="text-xs text-slate-500">Range Low</p>
                                                    <p className="text-lg font-semibold">{formatCurrency(result.rangeLow)}</p>
                                                </div>
                                                <div className="text-slate-600">—</div>
                                                <div className="text-center">
                                                    <p className="text-xs text-slate-500">Range High</p>
                                                    <p className="text-lg font-semibold">{formatCurrency(result.rangeHigh)}</p>
                                                </div>
                                            </div>
                                            <div className="inline-flex items-center gap-2 bg-slate-900/50 px-4 py-2 rounded-full">
                                                <Activity className="w-4 h-4 text-brand-400" />
                                                <span className="text-sm text-slate-300">Confidence: <span className="font-bold text-white">{result.confidence}%</span></span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Enhanced Metric Snapshot */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
                                            <TrendingUp className="w-5 h-5 text-brand-400 mt-1" />
                                            <div>
                                                <p className="text-xs uppercase tracking-wide text-slate-500">Applied Revenue Multiple</p>
                                                <p className="text-xl font-semibold text-white">{result.revenueMultiple.toFixed(1)}x</p>
                                                <p className="text-xs text-slate-400">Factoring growth, churn, retention, and IP strength—about half way to our Pro depth.</p>
                                            </div>
                                        </div>
                                        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
                                            <Percent className="w-5 h-5 text-brand-400 mt-1" />
                                            <div>
                                                <p className="text-xs uppercase tracking-wide text-slate-500">Rule of 40 Score</p>
                                                <p className="text-xl font-semibold text-white">{result.ruleOf40.toFixed(1)}%</p>
                                                <p className="text-xs text-slate-400">Growth + margin efficiency. 40%+ typically commands premium SaaS multiples.</p>
                                            </div>
                                        </div>
                                        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
                                            <DollarSign className="w-5 h-5 text-brand-400 mt-1" />
                                            <div>
                                                <p className="text-xs uppercase tracking-wide text-slate-500">Net Profit Margin</p>
                                                <p className="text-xl font-semibold text-white">{result.netProfitMargin.toFixed(1)}%</p>
                                                <p className="text-xs text-slate-400">Signals how much cash flow you keep after costs—key for strategic buyers.</p>
                                            </div>
                                        </div>
                                        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
                                            <Shield className="w-5 h-5 text-brand-400 mt-1" />
                                            <div>
                                                <p className="text-xs uppercase tracking-wide text-slate-500">Retention & Risk</p>
                                                <p className="text-sm font-semibold text-white">{result.retentionSignal}</p>
                                                <p className="text-xs text-slate-400">{result.churnRisk}. {result.npsSignal}.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Methods Used */}
                                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-6">
                                        <h4 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wide">Valuation Methods Used</h4>
                                        <div className="space-y-2">
                                            {result.valuations.map((val: any, idx: number) => (
                                                <div key={idx} className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-400">{val.method}</span>
                                                    <span className="font-semibold text-white">{formatCurrency(val.value)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Secondary Actions */}
                                    <div className="space-y-3 mb-6 print-hide">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <button
                                                onClick={handleCopyResults}
                                                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all border border-slate-700 hover:border-slate-600"
                                            >
                                                Copy results
                                            </button>
                                            <button
                                                onClick={() => window.print()}
                                                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all border border-slate-700 hover:border-slate-600"
                                            >
                                                Print / Save as PDF
                                            </button>
                                        </div>
                                        {copyStatus === 'copied' && (
                                            <p className="text-sm text-brand-300">Copied to clipboard.</p>
                                        )}
                                        {copyStatus === 'error' && (
                                            <p className="text-sm text-amber-300">Copy not available on this browser.</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 print-hide">
                                        <button
                                            onClick={() => {
                                                generateFreePDF(result, formData);
                                            }}
                                            className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all border border-slate-700 hover:border-slate-600"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" /></svg>
                                            Download Free PDF
                                        </button>
                                        <a
                                            href="/pro"
                                            className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                            Start Pro Calculator — $19
                                        </a>
                                    </div>

                                    {/* Email CTA */}
                                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 mb-6 print-hide">
                                        <div className="flex flex-col gap-4">
                                            <button
                                                onClick={() => {
                                                    setEmailFormOpen(true);
                                                    trackCalculatorEvent('calculator_email_open', analyticsPayload);
                                                }}
                                                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-brand-500 hover:bg-brand-400 text-white rounded-xl font-semibold transition-all"
                                            >
                                                Email me this valuation
                                            </button>

                                            {emailFormOpen && submitStatus !== 'success' && (
                                                <form onSubmit={handleSubmit} className="space-y-4">
                                                    <div>
                                                        <h4 className="text-lg font-semibold text-white">Send this valuation to your inbox</h4>
                                                        <p className="text-sm text-slate-300 mt-1">We ask for your email only so we can send you the results + a summary. No account required.</p>
                                                        <p className="text-xs text-slate-500 mt-2">No spam. Unsubscribe anytime.</p>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-slate-300 mb-2">Company (optional)</label>
                                                            <input
                                                                type="text"
                                                                value={formData.companyName}
                                                                onChange={(e) => handleContactChange('companyName', e.target.value)}
                                                                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 outline-none"
                                                                placeholder="Acme Inc."
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-slate-300 mb-2">Name (optional)</label>
                                                            <input
                                                                type="text"
                                                                value={formData.contactName}
                                                                onChange={(e) => handleContactChange('contactName', e.target.value)}
                                                                className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 outline-none"
                                                                placeholder="Jane Founder"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-slate-300 mb-2">Email address</label>
                                                        <input
                                                            type="email"
                                                            value={formData.email}
                                                            onChange={(e) => handleContactChange('email', e.target.value)}
                                                            className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 outline-none"
                                                            placeholder="you@company.com"
                                                            required
                                                        />
                                                        {emailError && (
                                                            <p className="text-sm text-rose-300 mt-2">{emailError}</p>
                                                        )}
                                                    </div>

                                                    <input
                                                        type="text"
                                                        name="website"
                                                        value={honeypot}
                                                        onChange={(e) => setHoneypot(e.target.value)}
                                                        autoComplete="off"
                                                        tabIndex={-1}
                                                        style={{ display: 'none' }}
                                                    />

                                                    {submitError && (
                                                        <p className="text-sm text-rose-300">{submitError}</p>
                                                    )}

                                                    <button
                                                        type="submit"
                                                        disabled={submitStatus === 'submitting'}
                                                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-950 hover:bg-brand-50 rounded-xl font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                                                    >
                                                        {submitStatus === 'submitting' ? 'Sending...' : 'Send my valuation'}
                                                    </button>
                                                </form>
                                            )}

                                            {submitStatus === 'success' && (
                                                <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-emerald-100">
                                                    <p className="font-semibold">Sent! Check your inbox in 1–2 minutes (Spam/Promotions).</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Pro Features Teaser */}
                                    <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-6 print-hide">
                                        <div className="flex items-start gap-3 mb-3">
                                            <svg className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                            <div>
                                                <h4 className="text-white font-bold mb-1">Want the Full Picture?</h4>
                                                <p className="text-sm text-slate-300 mb-3">Upgrade to Pro for:</p>
                                                <ul className="text-sm text-slate-400 space-y-1.5">
                                                    <li>✓ Interactive charts & benchmarking</li>
                                                    <li>✓ Actionable recommendations to boost value</li>
                                                    <li>✓ Exit scenario modeling</li>
                                                    <li>✓ Comprehensive 10-page PDF report</li>
                                                    <li>✓ 50+ data points for investor-grade accuracy</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 text-center print-hide">
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="text-slate-500 hover:text-slate-300 text-sm underline"
                                        >
                                            Start New Valuation
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>

                        {/* Navigation Buttons (Moved Inside Left Col) */}
                        {currentStep < resultsStepIndex && (
                            <div className="flex justify-between mt-12 pt-8 border-t border-slate-800/50">
                                <button
                                    onClick={handleBack}
                                    disabled={currentStep === 0}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors
                          ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:text-white hover:bg-slate-800'}
        `}
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="flex items-center gap-2 px-8 py-3 bg-white text-slate-950 hover:bg-brand-50 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                                >
                                    {currentStep === resultsStepIndex - 1 ? 'See Results' : 'Next Step'} <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right: Insight Panel & Progress */}
                    <div className="w-full md:w-[340px] lg:w-[400px] bg-slate-900/50 border-t md:border-t-0 md:border-l border-slate-800 flex flex-col relative overflow-hidden transition-colors duration-500 print-hide">

                        {/* Progress Steps (Vertical List) */}
                        <div className="p-8 pb-4 border-b border-slate-800/50 relative z-20">
                            <div className="space-y-3">
                                {STEPS.map((step, idx) => {
                                    const isActive = idx === currentStep;
                                    const isCompleted = idx < currentStep;
                                    return (
                                        <div key={step.id} className={`flex items-center gap-3 transition-colors ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border ${isActive ? 'bg-brand-500 border-brand-500 text-white' :
                                                isCompleted ? 'bg-brand-500/20 border-brand-500 text-brand-400' : 'bg-transparent border-slate-600 text-slate-400'
                                                }`}>
                                                {isCompleted ? '✓' : idx + 1}
                                            </div>
                                            <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-slate-400'}`}>{step.title}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Dynamic Insight Content */}
                        <div className="p-8 flex-1 flex flex-col justify-center relative z-10">
                            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-slate-700">
                                {(() => {
                                    const Icon = STEP_INSIGHTS[currentStep].icon;
                                    return <Icon className="w-8 h-8 text-brand-400" />;
                                })()}
                            </div>

                            <h4 className="text-xl font-bold text-white mb-3 font-display">
                                {STEP_INSIGHTS[currentStep].title}
                            </h4>

                            <p className="text-slate-400 text-sm leading-relaxed mb-8">
                                {STEP_INSIGHTS[currentStep].description}
                            </p>

                            <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-5 relative">
                                <div className="absolute -top-3 left-4 bg-slate-900 border border-brand-500/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-brand-400 tracking-wider">
                                    Pro Tip
                                </div>
                                <p className="text-sm text-brand-100 italic">
                                    "{STEP_INSIGHTS[currentStep].tip}"
                                </p>
                            </div>
                        </div>

                        {/* Abstract background elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                    </div>
                </div>

            </div>
        </section>
    );
}

function InputGroup({ label, sub, value, onChange, type = "text", prefix, suffix, placeholder }: { label: string; sub?: string; value: any; onChange: (v: string) => void; type?: string; prefix?: string; suffix?: string; placeholder?: string }) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm font-medium text-slate-300">{label}</label>
                {sub && (
                    <div className="group relative">
                        <Info className="w-3.5 h-3.5 text-slate-500 cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 border border-slate-700 rounded-lg text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                            {sub}
                        </div>
                    </div>
                )}
            </div>
            <div className="relative group">
                {prefix && (
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-slate-500 font-medium group-focus-within:text-brand-500">{prefix}</span>
                    </div>
                )}
                <input
                    type={type}
                    value={value === 0 ? '' : value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`block w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-3
             focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all placeholder-slate-600
             ${prefix ? 'pl-8' : 'pl-4'} ${suffix ? 'pr-8' : 'pr-4'}
          `}
                    placeholder={placeholder || "0"}
                />
                {suffix && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <span className="text-slate-500 font-medium">{suffix}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
