'use client';

import React, { useState } from 'react';
import { analyzeText, AuditResult } from '@/lib/smart-audit';
import { Search, AlertTriangle, CheckCircle, FileText, ArrowRight } from 'lucide-react';

export default function SmartAuditTool() {
    const [text, setText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AuditResult | null>(null);

    const handleAnalyze = () => {
        if (!text.trim()) return;

        setIsAnalyzing(true);
        // Simulate "AI" processing time for UX
        setTimeout(() => {
            const analysis = analyzeText(text);
            setResult(analysis);
            setIsAnalyzing(false);
        }, 800);
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            {!result ? (
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-500/10 mb-6">
                            <Search className="w-8 h-8 text-cyan-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            Smart Document Audit
                        </h2>
                        <p className="text-slate-400 max-w-lg mx-auto">
                            Paste your Executive Summary, Pitch Deck text, or Monthly Update below. Our system will scan it for "Deal Killers."
                        </p>
                    </div>

                    <div className="relative">
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Paste text here... (e.g. 'We are facing a lawsuit regarding IP but revenue is growing...')"
                            className="w-full h-64 bg-slate-950 border border-slate-700 rounded-xl p-6 text-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none mb-6"
                        />
                        <div className="absolute bottom-10 right-6 text-xs text-slate-600">
                            {text.length} characters
                        </div>
                    </div>

                    <button
                        onClick={handleAnalyze}
                        disabled={!text.trim() || isAnalyzing}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${!text.trim() || isAnalyzing
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20'
                            }`}
                    >
                        {isAnalyzing ? (
                            <>Processing...</>
                        ) : (
                            <>Analyze Document <ArrowRight className="w-5 h-5" /></>
                        )}
                    </button>

                    <p className="text-center text-xs text-slate-600 mt-4 flex items-center justify-center gap-1">
                        <ShieldCheckIcon className="w-3 h-3" />
                        100% Private. Analysis happens locally in your browser.
                    </p>
                </div>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <button
                        onClick={() => setResult(null)}
                        className="mb-6 text-slate-400 hover:text-white text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                        ← Scan Another Document
                    </button>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Score Card */}
                        <div className="md:col-span-1 bg-slate-900 rounded-2xl border border-slate-800 p-8 text-center h-fit">
                            <div className="relative inline-flex items-center justify-center">
                                <svg className="w-32 h-32 transform -rotate-90">
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="60"
                                        fill="transparent"
                                        stroke="#1e293b"
                                        strokeWidth="8"
                                    />
                                    <circle
                                        cx="64"
                                        cy="64"
                                        r="60"
                                        fill="transparent"
                                        stroke={result.score > 80 ? '#10b981' : result.score > 50 ? '#f59e0b' : '#ef4444'}
                                        strokeWidth="8"
                                        strokeDasharray={377}
                                        strokeDashoffset={377 - (377 * result.score) / 100}
                                        className="transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                    <span className="text-3xl font-bold text-white">{result.score}</span>
                                    <span className="text-xs text-slate-500 uppercase tracking-wider">Score</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <h3 className="text-white font-bold mb-2">Audit Result</h3>
                                <p className="text-sm text-slate-400">
                                    {result.summary}
                                </p>
                            </div>
                        </div>

                        {/* Findings List */}
                        <div className="md:col-span-2 space-y-4">
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-cyan-400" />
                                Detected Issues ({result.findings.length})
                            </h3>

                            {result.findings.length === 0 ? (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center">
                                    <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                                    <h4 className="text-emerald-300 font-bold mb-2">All Clear!</h4>
                                    <p className="text-emerald-400/70 text-sm">
                                        We didn't find any common "deal breaker" keywords in this text.
                                    </p>
                                </div>
                            ) : (
                                result.findings.map((finding) => (
                                    <div key={finding.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex gap-4 hover:border-slate-700 transition-colors">
                                        <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${finding.severity === 'high' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                                            }`}>
                                            <AlertTriangle className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${finding.severity === 'high' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                                                    }`}>
                                                    {finding.severity} Severity
                                                </span>
                                                <span className="text-xs text-slate-500 capitalize">{finding.category} Risk</span>
                                            </div>
                                            <h4 className="text-white font-medium mb-1">
                                                detected "{finding.text}"
                                            </h4>
                                            <p className="text-sm text-slate-400">
                                                {finding.explanation}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ShieldCheckIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}
