'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, Info, Download, Sparkles, Building2, Calculator, DollarSign, TrendingUp, Users, Code2, Scale, Lock } from 'lucide-react';
import { generateProPDF } from '@/lib/pdf-generator';
import { calculateSaaSValuation, ValuationInputs, formatCurrency } from '@/lib/valuation';
import ProDashboard from './ProDashboard';

const PRO_STEPS = [
    'Company Information',
    'Valuation Methods',
    'Financial Metrics',
    'Growth & Churn',
    'Customer & Market',
    'Product & Tech',
    'Team & Operations',
    'Legal & Risk',
];

const PRO_INSIGHTS = [
    {
        title: "Company Identity",
        description: "Official documentation ties the valuation to a specific legal entity. This is the first step in creating a sellable asset.",
        tip: "Ensure your website accurately reflects your current product positioning. Buyers check this first.",
        icon: Building2
    },
    {
        title: "Valuation Strategy",
        description: "Different buyers use different math. We run multiple models (SDE, Revenue Multiple, DCF) to triangulate a defendable range.",
        tip: "Strategic buyers (e.g., Salesforce) focus on Revenue Multiples. Financial buyers (PE firms) focus on EBITDA/SDE.",
        icon: Calculator
    },
    {
        title: "Financial Health",
        description: "The quality of your revenue is just as important as the quantity. High gross margins (>80%) command premium multiples.",
        tip: "Track your 'Rule of 40'. If Growth % + Profit Margin % > 40, you are in the elite tier of SaaS.",
        icon: DollarSign
    },
    {
        title: "Growth & Retention",
        description: "Churn is the silent killer of valuation. Net Dollar Retention > 100% proves your product becomes more valuable over time.",
        tip: "Logo churn under 1% monthly is excellent for SMB SaaS. For Enterprise, it should be near zero.",
        icon: TrendingUp
    },
    {
        title: "Market Position",
        description: "Who are you selling to? Enterprise contracts are 'stickier' and more valuable than prosumer subscriptions.",
        tip: "NPS scores above 50 suggest strong organic growth, reducing your dependency on paid ads (lowering CAC).",
        icon: Users
    },
    {
        title: "Product & Tech",
        description: "Investors buy IP, not just revenue. Proprietary tech and a scalable stack reduce the risk of a 'rewrite' post-acquisition.",
        tip: "Document your IP ownership clearly. Clean code and automated tests speed up technical due diligence.",
        icon: Code2
    },
    {
        title: "Team Structure",
        description: "Operational leverage means revenue grows faster than headcount. 'Key Man Risk' is a major discount factor.",
        tip: "If the business can't run for 4 weeks without you, it's not a business; it's a high-paid job.",
        icon: Users
    },
    {
        title: "Legal & Risk",
        description: "The 'unsexy' stuff that kills deals. Clean cap tables, IP assignment agreements, and compliance are mandatory.",
        tip: "Switching to a C-Corp is often required before a serious exit to institutional investors.",
        icon: Scale
    }
];

export default function ProValuationWizard() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [result, setResult] = useState<any>(null);
    const [formData, setFormData] = useState<ValuationInputs>({
        methods: [],
        companyName: '',
        email: '',
        website: '',
        arr: 0, mrr: 0, ltv: 0, cac: 0, grossMargin: 70, netProfit: 0,
        burnRate: 0, runway: 12, ownerSalary: 0, averageSalary: 0,
        employeeBenefits: 0, yearsOperating: 1, businessType: 'CRM',
        baseMultiplier: 6, customMultiplier: 0, discountRate: 0.12,
        growthYoy: 0, revenueGrowthMom: 0, customerChurn: 5, revenueChurn: 4,
        activeCustomers: 0, mau: 0, retentionRate: 85, nps: 50,
        customerSegment: 'mid-market', buyerType: 'investors',
        productMarketFit: 'strong', proprietaryTech: 'none', codeQuality: 'internal-review',
        scalableInfrastructure: 'yes', featureReleaseFrequency: 'monthly', securityCompliance: 'gdpr',
        fte: 5, keyStaff: 2, turnoverRate: 5, engSalesRatio: 2,
        supportTickets: 100, supportRating: 8, headcountGrowth: 10,
        legalEntity: 'c-corp', ipOwnership: 'fully-owned', contractLength: 12,
        contractValue: 12000, vendorLockin: 'moderate', legalIssues: 'none',
        dataPrivacy: 'full', cyberInsurance: 'yes', debtLevel: 0,
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const isPaid = params.get('paid') === 'true';

        // Initial detection: if paid, override with saved result
        if (isPaid) {
            const savedFullData = localStorage.getItem('pro_valuation_data');
            if (savedFullData) {
                try {
                    const { data, result: savedResult } = JSON.parse(savedFullData);
                    setFormData(data);
                    setResult(savedResult);
                    setCurrentStep(PRO_STEPS.length);

                    // Fire GA4 purchase event for revenue tracking
                    if (typeof window !== 'undefined' && (window as any).gtag) {
                        (window as any).gtag('event', 'purchase', {
                            transaction_id: `pro_${Date.now()}`,
                            value: 19.00,
                            currency: 'USD',
                            items: [{
                                item_id: 'pro_valuation',
                                item_name: 'Pro Valuation Report',
                                item_category: 'SaaS Tools',
                                price: 19.00,
                                quantity: 1
                            }]
                        });
                    }

                    return; // Stop here if we are showing results
                } catch (err) {
                    console.error('Failed to parse saved valuation data:', err);
                }
            }
        }

        // Normal persistence: resume from where the user left off
        const savedStep = localStorage.getItem('pro_valuation_current_step');
        const savedDraft = localStorage.getItem('pro_valuation_draft');

        if (savedStep) setCurrentStep(Number(savedStep));
        if (savedDraft) {
            try {
                setFormData(prev => ({ ...prev, ...JSON.parse(savedDraft) }));
            } catch (err) {
                console.error('Failed to parse saved draft:', err);
            }
        }
    }, []);

    // Save state on every change
    useEffect(() => {
        if (currentStep < PRO_STEPS.length) {
            localStorage.setItem('pro_valuation_current_step', currentStep.toString());
            localStorage.setItem('pro_valuation_draft', JSON.stringify(formData));
        }
    }, [currentStep, formData]);

    const updateField = (field: keyof ValuationInputs, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNext = async () => {
        if (currentStep === PRO_STEPS.length - 1) {
            setIsSubmitting(true);
            const valuationResult = calculateSaaSValuation(formData);
            setResult(valuationResult);

            // Final save for retrieval after payment
            localStorage.setItem('pro_valuation_data', JSON.stringify({
                data: formData,
                result: valuationResult,
                timestamp: new Date().toISOString()
            }));

            // Clear draft state so it doesn't resume the form later
            localStorage.removeItem('pro_valuation_current_step');
            localStorage.removeItem('pro_valuation_draft');

            // Submit to Formspree
            try {
                await fetch('https://formspree.io/f/mnnnoogg', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        subject: `New PRO Valuation - ${formData.companyName}`,
                        ...formData,
                        valuationEstimate: valuationResult.avgValuation
                    })
                });
            } catch (err) {
                console.error('Formspree submission failed:', err);
            }

            // Redirect to payment
            router.push('/payment');
            return;
        }
        setCurrentStep(prev => prev + 1);
    };

    const stepVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
    };

    const progress = ((currentStep) / PRO_STEPS.length) * 100;



    const downloadSampleReport = () => {
        // Generate a sample report with dummy data
        const sampleInputs = {
            companyName: 'Acme SaaS Corp (Sample)',
            arr: 1200000,
            mrr: 100000,
            growthYoy: 45,
            customerChurn: 2.1,
            netProfit: 300000,
            retentionRate: 108,
            nps: 72,
            grossMargin: 84,
            cac: 920,
            ltv: 5400,
            activeCustomers: 850,
            contractValue: 1400,
            keyStaff: 4,
            ipOwnership: 'fully-owned',
            legalIssues: 'none',
            scalableInfrastructure: 'fully-scalable',
            dataPrivacy: 'compliant',
            businessType: 'B2B SaaS',
            discountRate: 0.12
        };
        const sampleResult = calculateSaaSValuation(sampleInputs as any);
        generateProPDF(sampleResult, sampleInputs, sampleInputs.companyName);
    };

    if (result && currentStep === PRO_STEPS.length) {
        return <ProDashboard data={result} inputs={formData} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">

                <div className="text-center mb-8">
                    <span className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold mb-3 border border-amber-500/20">
                        PRO VALUATION
                    </span>
                    <h1 className="text-3xl font-bold text-white mb-2 font-display">
                        Comprehensive Business Valuation
                    </h1>
                    <p className="text-slate-400 mb-6">50+ data points for investor-grade accuracy</p>
                    <button
                        onClick={downloadSampleReport}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 text-brand-400 rounded-lg text-sm font-semibold transition-all border border-brand-500/20 hover:border-brand-500/50 mb-4"
                    >
                        <Download className="w-4 h-4" />
                        Download Sample Pro Report (PDF)
                    </button>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden min-h-[600px] flex flex-col md:flex-row backdrop-blur-sm">

                    {/* Left: Form Area */}
                    <div className="flex-1 p-8 md:p-12 relative flex flex-col">


                        <AnimatePresence mode="wait">

                            {/* STEP 0: COMPANY INFO */}
                            {currentStep === 0 && (
                                <motion.div key="step0" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                                    <h2 className="text-xl font-bold text-white mb-4">{PRO_STEPS[0]}</h2>
                                    <div className="space-y-4 mb-6">
                                        <InputField label="Business Name" value={formData.companyName} onChange={(v) => updateField('companyName', v)} placeholder="Enter business name" type="text" helpText="The legal name of your business or brand." />
                                        <InputField label="Email Address" value={formData.email} onChange={(v) => updateField('email', v)} placeholder="you@company.com" type="email" helpText="Used to send your final report and for follow-up communications." />
                                        <InputField label="Website URL" value={formData.website || ''} onChange={(v) => updateField('website', v)} placeholder="https://yourbusiness.com" type="text" helpText="Your company's primary landing page." />
                                    </div>
                                    <button onClick={handleNext} className="w-full py-3 bg-brand-500 hover:bg-brand-400 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                                        Next <ArrowRight className="w-5 h-5" />
                                    </button>
                                </motion.div>
                            )}

                            {/* STEP 1: METHODS */}
                            {currentStep === 1 && (
                                <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                                    <h2 className="text-xl font-bold text-white mb-4">{PRO_STEPS[1]}</h2>
                                    <div className="space-y-4 mb-6">
                                        <div className="grid gap-3">
                                            {[
                                                { label: 'Revenue Multiplier', value: 'multiplier' },
                                                { label: 'Income-Based', value: 'income' },
                                                { label: 'Earnings-Based', value: 'earnings' },
                                                { label: 'DCF', value: 'dcf' }
                                            ].map(({ label, value }) => (
                                                <label key={value} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 cursor-pointer border border-slate-700">
                                                    <input type="checkbox" className="w-5 h-5" checked={(formData.methods || []).includes(value)} onChange={(e) => updateField('methods', e.target.checked ? [...(formData.methods || []), value] : (formData.methods || []).filter(m => m !== value))} />
                                                    <span className="text-white font-medium">{label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => setCurrentStep(currentStep - 1)} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center gap-2">
                                            <ArrowLeft className="w-5 h-5" /> Back
                                        </button>
                                        <button onClick={handleNext} className="flex-1 py-3 bg-brand-500 hover:bg-brand-400 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                                            Next <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 2: FINANCIALS (14 inputs) */}
                            {currentStep === 2 && (
                                <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                                    <h2 className="text-xl font-bold text-white mb-4">{PRO_STEPS[2]}</h2>
                                    <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto pr-2">
                                        <InputField label="Annual Recurring Revenue (ARR)" value={formData.arr} onChange={(v) => updateField('arr', Number(v))} placeholder="500000" helpText="The core driver of your valuation. Represents total recurring subscription revenue over the last 12 months. Strategic buyers strictly distinguish this from one-time service fees." />
                                        <InputField label="Monthly Recurring Revenue (MRR)" value={formData.mrr} onChange={(v) => updateField('mrr', Number(v))} placeholder="41667" helpText="The current monthly footprint of your business. Investors use MRR to project future performance and calculate runway." />
                                        <InputField label="Customer Lifetime Value (LTV)" value={formData.ltv} onChange={(v) => updateField('ltv', Number(v))} placeholder="2000" helpText="The average revenue you expect to earn from a single customer over their entire relationship with you. High LTV allows for higher acquisition spending." />
                                        <InputField label="Customer Acquisition Cost (CAC)" value={formData.cac} onChange={(v) => updateField('cac', Number(v))} placeholder="500" helpText="The total cost (sales + marketing) to acquire a single customer. A healthy SaaS should maintain an LTV:CAC ratio of at least 3:1." />
                                        <InputField label="Gross Margin (%)" value={formData.grossMargin} onChange={(v) => updateField('grossMargin', Number(v))} placeholder="75" helpText="Revenue minus the cost of delivering the service (hosting, support). Premium SaaS companies typically operate at 80% or higher." />
                                        <InputField label="Net Profit / EBITDA" value={formData.netProfit} onChange={(v) => updateField('netProfit', Number(v))} placeholder="100000" helpText="Earnings Before Interest, Taxes, Depreciation, and Amortization. This measures operative profitability before financial structure and tax impacts." />
                                        <InputField label="Monthly Burn Rate" value={formData.burnRate} onChange={(v) => updateField('burnRate', Number(v))} placeholder="25000" helpText="The net amount of cash your company spends each month to keep operating. Critical for early-stage companies to manage runway." />
                                        <InputField label="Runway (Months)" value={formData.runway} onChange={(v) => updateField('runway', Number(v))} placeholder="12" helpText="How many months the company can survive at current burn rates before needing additional funding or reaching break-even." />
                                        <InputField label="Owner's Salary ($/year)" value={formData.ownerSalary} onChange={(v) => updateField('ownerSalary', Number(v))} placeholder="120000" helpText="In SDE-based valuations (Seller's Discretionary Earnings), the owner's salary is added back to show the total cash flow available to a new owner." />
                                        <InputField label="Average Employee Salary" value={formData.averageSalary} onChange={(v) => updateField('averageSalary', Number(v))} placeholder="80000" helpText="Used to benchmark your efficiency against industry standards and assess the risk of rising labor costs." />
                                        <InputField label="Employee Benefits ($/year)" value={formData.employeeBenefits} onChange={(v) => updateField('employeeBenefits', Number(v))} placeholder="10000" helpText="Fully-burdened labor costs are essential for clear-eyed EBITDA calculations. Underestimating benefits can lead to significant valuation drops during due diligence." />
                                        <InputField label="Years in Operation" value={formData.yearsOperating} onChange={(v) => updateField('yearsOperating', Number(v))} placeholder="3" helpText="Older companies often command slightly higher reliability premiums, while younger companies are judged more heavily on their recent growth trajectory." />
                                        <SelectField label="Business Type" value={formData.businessType} onChange={(v) => updateField('businessType', v)} options={['CRM', 'Project Management', 'Marketing Automation', 'Analytics/BI', 'Customer Support', 'Billing/FinTech', 'DevOps', 'Health Tech']} helpText="Business type determines the specific multiple 'cohort' your business is compared against. FinTech often commands higher multiples than general CRM." />
                                        <InputField label="Discount Rate (%)" value={(formData.discountRate || 0) * 100} onChange={(v) => updateField('discountRate', Number(v) / 100)} placeholder="12" helpText="The rate used to discount future cash flows in a DCF model. A higher rate reflects higher perceived risk (and a lower present valuation)." />
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => setCurrentStep(currentStep - 1)} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center gap-2">
                                            <ArrowLeft className="w-5 h-5" /> Back
                                        </button>
                                        <button onClick={handleNext} className="flex-1 py-3 bg-brand-500 hover:bg-brand-400 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                                            Next <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3: GROWTH & CHURN */}
                            {currentStep === 3 && (
                                <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                                    <h2 className="text-xl font-bold text-white mb-4">{PRO_STEPS[3]}</h2>
                                    <div className="space-y-4 mb-6">
                                        <InputField label="Revenue Growth YoY (%)" value={formData.growthYoy} onChange={(v) => updateField('growthYoy', Number(v))} placeholder="25" helpText="Year-over-year revenue growth. Strategic buyers pay premiums for growth that outpaces the market average." />
                                        <InputField label="Revenue Growth MoM (%)" value={formData.revenueGrowthMom} onChange={(v) => updateField('revenueGrowthMom', Number(v))} placeholder="3" helpText="Month-over-month growth provides a high-resolution look at recent trajectory and marketing efficiency." />
                                        <InputField label="Customer Churn Rate (%)" value={formData.customerChurn} onChange={(v) => updateField('customerChurn', Number(v))} placeholder="5" helpText="Monthly percentage of customers lost. High logo churn indicates poor product-market fit or aggressive competition." />
                                        <InputField label="Revenue Churn Rate (%)" value={formData.revenueChurn} onChange={(v) => updateField('revenueChurn', Number(v))} placeholder="4" helpText="Monthly percentage of revenue lost. Critical to separate this from logo churn to see if you are losing your highest-value accounts." />
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => setCurrentStep(currentStep - 1)} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center gap-2">
                                            <ArrowLeft className="w-5 h-5" /> Back
                                        </button>
                                        <button onClick={handleNext} className="flex-1 py-3 bg-brand-500 hover:bg-brand-400 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                                            Next <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 4: CUSTOMER & MARKET */}
                            {currentStep === 4 && (
                                <motion.div key="step4" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                                    <h2 className="text-xl font-bold text-white mb-4">{PRO_STEPS[4]}</h2>
                                    <div className="space-y-4 mb-6">
                                        <InputField label="Active Customers" value={formData.activeCustomers} onChange={(v) => updateField('activeCustomers', Number(v))} placeholder="1500" helpText="The total count of paying entities. Helps determine ARPU (Average Revenue Per User) and market penetration." />
                                        <InputField label="Monthly Active Users (MAU)" value={formData.mau} onChange={(v) => updateField('mau', Number(v))} placeholder="2000" helpText="A proxy for product engagement. A large gap between paying customers and MAU suggests potential 'churn risk' or under-utilized licenses." />
                                        <InputField label="Retention Rate (%)" value={formData.retentionRate} onChange={(v) => updateField('retentionRate', Number(v))} placeholder="85" helpText="Annual retention of customers. High retention suggests a 'sticky' product with high switching costs for the customer." />
                                        <InputField label="Net Promoter Score (NPS)" value={formData.nps} onChange={(v) => updateField('nps', Number(v))} placeholder="60" helpText="Customer satisfaction benchmark. Scores above 50 are excellent and correlate with strong organic word-of-mouth growth." />
                                        <SelectField label="Customer Segment" value={formData.customerSegment} onChange={(v) => updateField('customerSegment', v)} options={['small-business', 'mid-market', 'enterprise', 'consumer']} helpText="Enterprise segments often command higher valuation multiples due to long-term contracts and budget stability." />
                                        <SelectField label="Buyer Type" value={formData.buyerType} onChange={(v) => updateField('buyerType', v)} options={['investors', 'competitors', 'strategic-partners', 'unknown']} helpText="Strategic buyers (competitors or partners) often pay higher premiums than financial buyers (PE or individual investors) due to synergy value." />
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => setCurrentStep(currentStep - 1)} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center gap-2">
                                            <ArrowLeft className="w-5 h-5" /> Back
                                        </button>
                                        <button onClick={handleNext} className="flex-1 py-3 bg-brand-500 hover:bg-brand-400 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                                            Next <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 5: PRODUCT & TECH */}
                            {currentStep === 5 && (
                                <motion.div key="step5" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                                    <h2 className="text-xl font-bold text-white mb-4">{PRO_STEPS[5]}</h2>
                                    <div className="space-y-4 mb-6">
                                        <SelectField label="Product-Market Fit" value={formData.productMarketFit} onChange={(v) => updateField('productMarketFit', v)} options={['none', 'early', 'strong', 'fully-confirmed']} helpText="Validation of your product. 'Fully confirmed' means you have a repeatable sales motion and clear customer ROI." />
                                        <SelectField label="Proprietary Technology / IP" value={formData.proprietaryTech} onChange={(v) => updateField('proprietaryTech', v)} options={['none', 'patents', 'copyrights', 'both']} helpText="Identifies the 'moat' around your product. Patents and unique IP significantly reduce the risk of replica competitors." />
                                        <SelectField label="Code Quality" value={formData.codeQuality} onChange={(v) => updateField('codeQuality', v)} options={['no-review', 'internal-review', 'external-review']} helpText="The maturity of your codebase. Buyers will conduct a code audit (due diligence); having prior external reviews speeds this up and adds value." />
                                        <SelectField label="Scalable Infrastructure" value={formData.scalableInfrastructure} onChange={(v) => updateField('scalableInfrastructure', v)} options={['no', 'partial', 'yes']} helpText="Can the tech stack handle 10x growth without a rewrite? Buyers pay for systems that are ready for immediate scale." />
                                        <SelectField label="Feature Release Frequency" value={formData.featureReleaseFrequency} onChange={(v) => updateField('featureReleaseFrequency', v)} options={['rarely', 'monthly', 'weekly', 'daily']} helpText="Velocity of the product team. Frequent releases indicates an active, healthy R&D pipeline." />
                                        <SelectField label="Security Compliance" value={formData.securityCompliance} onChange={(v) => updateField('securityCompliance', v)} options={['none', 'gdpr', 'iso27001', 'other']} helpText="Compliance is a hurdle. SOC2 or GDPR compliance removes risk for strategic acquirers in regulated industries." />
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => setCurrentStep(currentStep - 1)} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center gap-2">
                                            <ArrowLeft className="w-5 h-5" /> Back
                                        </button>
                                        <button onClick={handleNext} className="flex-1 py-3 bg-brand-500 hover:bg-brand-400 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                                            Next <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 6: TEAM & OPERATIONS */}
                            {currentStep === 6 && (
                                <motion.div key="step6" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                                    <h2 className="text-xl font-bold text-white mb-4">{PRO_STEPS[6]}</h2>
                                    <div className="space-y-4 mb-6">
                                        <InputField label="Full-Time Employees" value={formData.fte} onChange={(v) => updateField('fte', Number(v))} placeholder="25" helpText="Total staff size. Investors look at efficiency metrics like Revenue per Employee to judge operational leverage." />
                                        <InputField label="Founders / Key Staff" value={formData.keyStaff} onChange={(v) => updateField('keyStaff', Number(v))} placeholder="3" helpText="Assesses 'Key Man Risk'. If the business relies too heavily on one or two founders, buyers apply a significant risk discount." />
                                        <InputField label="Staff Turnover Rate (%)" value={formData.turnoverRate} onChange={(v) => updateField('turnoverRate', Number(v))} placeholder="5" helpText="High turnover suggests cultural issues or unscalable management, which increases risk for an acquirer during the transition period." />
                                        <InputField label="Engineering to Sales Ratio" value={formData.engSalesRatio} onChange={(v) => updateField('engSalesRatio', Number(v))} placeholder="2.5" helpText="Benchmarks your focus area. A high engineering ratio suggests a product-led company; high sales ratio suggests a sales-led motion." />
                                        <InputField label="Support Tickets per Month" value={formData.supportTickets} onChange={(v) => updateField('supportTickets', Number(v))} placeholder="100" helpText="Measures product usability and operational overhead. High support load per ARR unit decreases valuation." />
                                        <InputField label="Customer Support Rating (1-10)" value={formData.supportRating} onChange={(v) => updateField('supportRating', Number(v))} placeholder="8" helpText="Buyer's view this as an indicator of post-sale customer success and long-term retention likelihood." />
                                        <InputField label="Headcount Growth Rate (%)" value={formData.headcountGrowth} onChange={(v) => updateField('headcountGrowth', Number(v))} placeholder="20" helpText="Recent hiring velocity helps estimate future burn and management maturity." />
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => setCurrentStep(currentStep - 1)} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center gap-2">
                                            <ArrowLeft className="w-5 h-5" /> Back
                                        </button>
                                        <button onClick={handleNext} className="flex-1 py-3 bg-brand-500 hover:bg-brand-400 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                                            Next <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 7: LEGAL & RISK */}
                            {currentStep === 7 && (
                                <motion.div key="step7" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                                    <h2 className="text-xl font-bold text-white mb-4">{PRO_STEPS[7]}</h2>
                                    <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto pr-2">
                                        <SelectField label="Legal Entity Type" value={formData.legalEntity} onChange={(v) => updateField('legalEntity', v)} options={['llc', 'c-corp', 's-corp', 'other']} helpText="The legal structure determines ease of acquisition. C-Corps are typically the standard for larger strategic exits and VC funding." />
                                        <SelectField label="IP Ownership Status" value={formData.ipOwnership} onChange={(v) => updateField('ipOwnership', v)} options={['fully-owned', 'licensed', 'partial', 'none']} helpText="Clear chain of title for IP is mandatory for a successful exit. Gaps here are the most common reason deals fail during due diligence." />
                                        <InputField label="Average Contract Length (Months)" value={formData.contractLength} onChange={(v) => updateField('contractLength', Number(v))} placeholder="12" helpText="Longer contracts (1+ years) create revenue predictability, which investors value much higher than monthly 'at-will' subscriptions." />
                                        <InputField label="Annual Contract Value (ACV)" value={formData.contractValue} onChange={(v) => updateField('contractValue', Number(v))} placeholder="12000" helpText="Average yearly revenue per account. Higher ACV allows for higher-touch, more reliable sales models." />
                                        <SelectField label="Vendor Lock-In" value={formData.vendorLockin} onChange={(v) => updateField('vendorLockin', v)} options={['none', 'moderate', 'high']} helpText="Dependency on specific third-party APIs can be a risk. Buyers look for platform independence to ensure long-term stability." />
                                        <SelectField label="Pending Legal Issues" value={formData.legalIssues} onChange={(v) => updateField('legalIssues', v)} options={['none', 'minor', 'major']} helpText="Active litigation is a massive red flag that can stop an acquisition cold. Even minor issues increase the 'risk discount' applied." />
                                        <SelectField label="Data Privacy Compliance" value={formData.dataPrivacy} onChange={(v) => updateField('dataPrivacy', v)} options={['full', 'partial', 'none']} helpText="Adherence to GDPR, CCPA, and regional laws. Non-compliance represents a significant liability risk for an acquirer." />
                                        <SelectField label="Cybersecurity Insurance" value={formData.cyberInsurance} onChange={(v) => updateField('cyberInsurance', v)} options={['yes', 'no']} helpText="Existence of insurance suggests a mature operational framework and provides a layer of protection during the transition." />
                                        <InputField label="Debt Level ($)" value={formData.debtLevel} onChange={(v) => updateField('debtLevel', Number(v))} placeholder="0" helpText="Outstanding debt is typically deducted from the Enterprise Value to reach the Equity Value (the actual check the owner receives)." />
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => setCurrentStep(currentStep - 1)} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center gap-2">
                                            <ArrowLeft className="w-5 h-5" /> Back
                                        </button>
                                        <button
                                            onClick={handleNext}
                                            disabled={isSubmitting}
                                            className={`flex-1 py-3 bg-gradient-to-r from-brand-500 to-amber-500 hover:from-brand-400 hover:to-amber-400 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        >
                                            {isSubmitting ? 'Processing...' : 'View Pro Dashboard'} <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>

                    {/* Right: Insight Panel & Progress */}
                    <div className="w-full md:w-[340px] lg:w-[400px] bg-slate-900/50 border-t md:border-t-0 md:border-l border-slate-800 flex flex-col relative overflow-hidden transition-colors duration-500">

                        {/* Progress Steps (Compact List) */}
                        <div className="p-8 pb-0 relative z-20">
                            <div className="flex flex-wrap gap-2 mb-6">
                                {PRO_STEPS.map((step, idx) => (
                                    <div key={step} className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentStep ? 'w-8 bg-amber-500' : idx < currentStep ? 'w-8 bg-brand-500' : 'w-2 bg-slate-800'}`} />
                                ))}
                            </div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Current Focus</div>
                            <div className="text-white font-display font-bold text-lg">{PRO_STEPS[currentStep]}</div>
                        </div>

                        {/* Dynamic Insight Content */}
                        <div className="p-8 flex-1 flex flex-col justify-center relative z-10">
                            <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center mb-6 shadow-xl border border-slate-700/50">
                                {(() => {
                                    const Icon = PRO_INSIGHTS[currentStep]?.icon || Sparkles;
                                    return <Icon className="w-8 h-8 text-amber-400" />;
                                })()}
                            </div>

                            <div className="inline-block px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider mb-3">
                                Expert Insight
                            </div>

                            <h4 className="text-xl font-bold text-white mb-3 font-display">
                                {PRO_INSIGHTS[currentStep]?.title || 'Processing...'}
                            </h4>

                            <p className="text-slate-400 text-sm leading-relaxed mb-8">
                                {PRO_INSIGHTS[currentStep]?.description || 'We are calculating your valuation report.'}
                            </p>

                            <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-5 relative">
                                <div className="absolute -top-3 left-4 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-amber-500" /> Pro Tip
                                </div>
                                <p className="text-sm text-slate-300 italic">
                                    "{PRO_INSIGHTS[currentStep]?.tip || 'Sit tight!'}"
                                </p>
                            </div>
                        </div>

                        {/* Abstract background elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-500/5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function InputField({ label, value, onChange, placeholder, helpText, type = "number" }: { label: string; value: any; onChange: (v: string) => void; placeholder: string; helpText?: string; type?: string }) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm font-medium text-slate-300">{label}</label>
                {helpText && (
                    <div className="group relative">
                        <Info className="w-3.5 h-3.5 text-slate-500 cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 border border-slate-700 rounded-lg text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                            {helpText}
                        </div>
                    </div>
                )}
            </div>
            <input
                type={type}
                value={value === 0 ? '' : value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500"
            />
        </div>
    );
}

function SelectField({ label, value, onChange, options, helpText }: { label: string; value: any; onChange: (v: string) => void; options: string[]; helpText?: string }) {
    return (
        <div>
            <div className="flex items-center gap-2 mb-2">
                <label className="block text-sm font-medium text-slate-300">{label}</label>
                {helpText && (
                    <div className="group relative">
                        <Info className="w-3.5 h-3.5 text-slate-500 cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 border border-slate-700 rounded-lg text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                            {helpText}
                        </div>
                    </div>
                )}
            </div>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-brand-500 appearance-none"
            >
                {options.map((opt: string) => (
                    <option key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                ))}
            </select>
        </div>
    );
}
