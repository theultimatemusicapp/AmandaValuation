
declare global {
    interface Window {
        gtag: (option: string, gaTrackingId: string, options: Record<string, any>) => void;
        dataLayer: Record<string, any>[];
    }
}

export const GA_TRACKING_ID = 'G-772JV93TYR';

type GTagEvent = {
    action: string;
    category: string;
    label: string;
    value?: number;
};

export const pageview = (url: string) => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('config', GA_TRACKING_ID, {
            page_path: url,
        });
    } else if (process.env.NODE_ENV === 'development') {
        console.warn('[Analytics] Pageview blocked or gtag not initialized:', url);
    }
};

export const event = ({ action, category, label, value }: GTagEvent) => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    } else if (process.env.NODE_ENV === 'development') {
        console.warn('[Analytics] Event blocked:', action, { category, label, value });
    }
};

export const trackCalculatorEvent = (action: string, payload: Record<string, unknown> = {}) => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('event', action, payload);
    }
};

// Specific Resources Events
export const trackResourceView = (slug: string) => {
    event({
        action: 'resource_view',
        category: 'Resources',
        label: slug,
    });
};

export const trackResourceCTA = (slug: string, location: string) => {
    event({
        action: 'resource_cta_click',
        category: 'Conversion',
        label: `${slug} - ${location}`,
    });
};
