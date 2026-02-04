import { trackEvent } from './analytics';

/**
 * Track button click events with GA4
 * Usage: onClick={trackButtonClick('Order Device', 'Products Page', '₹4,999')}
 */
export const trackButtonClick = (action: string, category: string, label: string = '') => {
    return () => {
        trackEvent({
            category: category,
            action: `Button Click - ${action}`,
            label: label
        });
    };
};

/**
 * Track link click events
 */
export const trackLinkClick = (linkText: string, destination: string, category: string = 'Navigation') => {
    return () => {
        trackEvent({
            category: category,
            action: 'Link Click',
            label: `${linkText} -> ${destination}`
        });
    };
};

/**
 * Track form submissions
 */
export const trackFormSubmission = (formName: string, success: boolean = true) => {
    trackEvent({
        category: 'Forms',
        action: success ? 'Form Submitted' : 'Form Error',
        label: formName
    });
};

/**
 * Track page views (called automatically by GA4, but useful for SPAs)
 */
export const trackPageView = (pageName: string, path: string) => {
    if (window.gtag) {
        window.gtag('event', 'page_view', {
            page_title: pageName,
            page_path: path
        });
    }
};

/**
 * Track CTA interactions (Call-to-Action buttons)
 */
export const trackCTA = (ctaName: string, location: string, value: string = '') => {
    trackEvent({
        category: 'CTA',
        action: ctaName,
        label: `${location} ${value}`.trim()
    });
};

/**
 * Track downloads
 */
export const trackDownload = (fileName: string, fileType: string, source: string) => {
    trackEvent({
        category: 'Downloads',
        action: `Download ${fileType}`,
        label: `${fileName} from ${source}`
    });
};

/**
 * Track video plays (for future video content)
 */
export const trackVideoPlay = (videoTitle: string, duration: number = 0) => {
    trackEvent({
        category: 'Video',
        action: 'Play',
        label: `${videoTitle} (${duration}s)`
    });
};

/**
 * Track search queries
 */
export const trackSearch = (query: string, resultsCount: number = 0) => {
    trackEvent({
        category: 'Search',
        action: 'Search Query',
        label: `"${query}" (${resultsCount} results)`
    });
};

/**
 * Track external link clicks
 */
export const trackExternalLink = (url: string, linkText: string) => {
    return () => {
        trackEvent({
            category: 'External Links',
            action: 'Click',
            label: `${linkText}: ${url}`
        });
    };
};
