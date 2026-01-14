'use client';

import React, { useState } from 'react';
import { RISK_FACTORS, calculateRiskScore, RiskResult } from '@/lib/risk-engine';
import { ArrowRight, ArrowLeft, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function RiskAssessmentWizard() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [result, setResult] = useState<RiskResult | null>(null);

    const questions = RISK_FACTORS;
    const totalSteps = questions.length;

    const handleAnswer = (score: number) => {
        const factorId = questions[currentStep].id;
        const newAnswers = { ...answers, [factorId]: score };
        setAnswers(newAnswers);

        if (currentStep < totalSteps - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            // Calculate Result
            const finalResult = calculateRiskScore(newAnswers);
            setResult(finalResult);
        }
    };

    const reset = () => {
        setAnswers({});
        setCurrentStep(0);
        setResult(null);
    };

    if (result) {
        return (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 text-center animate-in fade-in zoom-in duration-500">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800 mb-6">
                    {result.totalScore > 70 ? (
                        <ShieldCheck className="w-10 h-10 text-emerald-400" />
                    ) : (
                        <AlertTriangle className="w-10 h-10 text-amber-400" />
                    )}
                </div>

                <h2 className="text-3xl font-bold text-white mb-2">
                    Risk Score: <span className={result.totalScore > 70 ? 'text-emerald-400' : 'text-amber-400'}>{result.totalScore}/100</span>
                </h2>

                <p className="text-xl text-slate-300 font-medium mb-8">
                    Risk Level: <span className="text-white">{result.riskLevel}</span>
                </p>

                <p className="text-slate-400 max-w-lg mx-auto mb-8 leading-relaxed">
                    {result.summary}
                </p>

                <div className="bg-slate-950 rounded-xl p-6 border border-slate-800 mb-8 max-w-sm mx-auto">
                    <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold mb-2">Valuation Impact</p>
                    <p className="text-2xl font-bold text-white">
                        {result.valuationDiscount === 0 ? 'No Discount' : `-${result.valuationDiscount * 100}% Discount`}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                        Investors may reduce their offer by this amount to account for risk.
                    </p>
                </div>

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={reset}
                        className="px-6 py-3 text-slate-400 hover:text-white font-medium transition-colors"
                    >
                        Start Over
                    </button>
                    <Link
                        href="/"
                        className="px-8 py-3 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-900/20"
                    >
                        Get Full Valuation
                    </Link>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentStep];
    const progress = ((currentStep) / totalSteps) * 100;

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    <span>Question {currentStep + 1} of {totalSteps}</span>
                    <span>{Math.round(progress)}% Complete</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-brand-600 to-brand-400 transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400 mb-4 capitalize`}>
                        {currentQuestion.category} Risk
                    </span>

                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
                        {currentQuestion.question}
                    </h2>

                    <div className="space-y-3">
                        {currentQuestion.options.map((option) => (
                            <button
                                key={option.label}
                                onClick={() => handleAnswer(option.score)}
                                className="w-full p-4 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-900/10 text-left transition-all group group-hover:scale-[1.01]"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-slate-200 group-hover:text-white transition-colors">
                                        {option.label}
                                    </span>
                                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-brand-400 transition-colors opacity-0 group-hover:opacity-100" />
                                </div>
                                {option.description && (
                                    <p className="text-xs text-slate-500 mt-1">{option.description}</p>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Back Button */}
                {currentStep > 0 && (
                    <button
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="mt-8 flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Previous Question
                    </button>
                )}
            </div>
        </div>
    );
}
