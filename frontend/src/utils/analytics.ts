// Google Analytics 4 Initialization
// Event tracking for user behavior analytics

export const GA_TRACKING_ID = 'G-XXXXXXXXXX'; // Replace with actual GA4 ID

declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
    }
}

// Initialize GA4
export const initGA = (): void => {
    if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
        function gtag(...args: any[]) {
            window.dataLayer.push(args);
        }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', GA_TRACKING_ID, {
            page_path: window.location.pathname,
            anonymize_ip: true, // GDPR compliance
            cookie_flags: 'SameSite=None;Secure'
        });

        // Cookie consent default (denied until user accepts)
        gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage: 'denied'
        });
    }
};

// Page view tracking
export const trackPageView = (url: string): void => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('config', GA_TRACKING_ID, {
            page_path: url
        });
    }
};

interface EventParams {
    category: string;
    action: string;
    label?: string;
    value?: number | null;
}

// Event tracking
export const trackEvent = ({ category, action, label, value }: EventParams): void => {
    if (typeof window.gtag !== 'undefined') {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
        });
    }
};

// Conversion tracking
export const trackConversion = (conversionType: string, value: number | null = null): void => {
    trackEvent({
        category: 'Conversion',
        action: conversionType,
        label: window.location.pathname,
        value: value
    });
};

// User engagement tracking
export const trackEngagement = (action: string, label?: string): void => {
    trackEvent({
        category: 'Engagement',
        action: action,
        label: label
    });
};
