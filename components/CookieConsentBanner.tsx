'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const CONSENT_KEY = 'sv-cookie-consent';

type ConsentState = 'accepted' | 'declined';

const consentSettings: Record<ConsentState, Record<string, 'granted' | 'denied'>> = {
    accepted: {
        ad_storage: 'granted',
        analytics_storage: 'granted',
        functionality_storage: 'granted',
        personalization_storage: 'granted',
        security_storage: 'granted',
    },
    declined: {
        ad_storage: 'denied',
        analytics_storage: 'denied',
        functionality_storage: 'denied',
        personalization_storage: 'denied',
        security_storage: 'granted',
    },
};

const applyConsent = (consent: ConsentState) => {
    if (typeof window === 'undefined') {
        return;
    }

    const gtag = (window as Window & { gtag?: (...args: any[]) => void }).gtag;
    if (typeof gtag === 'function') {
        gtag('consent', 'update', consentSettings[consent]);
    }
};

export default function CookieConsentBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const storedConsent = window.localStorage.getItem(CONSENT_KEY) as ConsentState | null;

        if (storedConsent === 'accepted' || storedConsent === 'declined') {
            applyConsent(storedConsent);
            setIsVisible(false);
            return;
        }

        setIsVisible(true);
    }, []);

    const handleConsent = (consent: ConsentState) => {
        window.localStorage.setItem(CONSENT_KEY, consent);
        applyConsent(consent);
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-800 bg-slate-950/95 backdrop-blur">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-slate-300 leading-relaxed">
                    <p className="font-semibold text-white">We use cookies for analytics and advertising.</p>
                    <p className="text-slate-400">
                        You can accept or decline non-essential cookies. Learn more in our{' '}
                        <Link href="/privacy" className="text-brand-400 hover:text-brand-300 underline underline-offset-4">
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={() => handleConsent('declined')}
                        className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-900"
                    >
                        Decline
                    </button>
                    <button
                        type="button"
                        onClick={() => handleConsent('accepted')}
                        className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-brand-400"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
}
