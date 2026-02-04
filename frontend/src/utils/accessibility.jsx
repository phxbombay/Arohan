import { Box, Link as MuiLink } from '@mui/material';

/**
 * WCAG 2.1 Accessibility Components and Utilities
 */

/**
 * Skip to main content link (WCAG 2.4.1)
 * Add to top of App.tsx before header
 */
export function SkipToMainContent() {
    return (
        <MuiLink
            href="#main-content"
            sx={{
                position: 'absolute',
                left: '-9999px',
                zIndex: 9999,
                padding: 2,
                bgcolor: 'primary.main',
                color: 'white',
                textDecoration: 'none',
                '&:focus': {
                    left: 0,
                    top: 0
                }
            }}
        >
            Skip to main content
        </MuiLink>
    );
}

/**
 * Screen reader only text (visually hidden but accessible)
 */
export function ScreenReaderOnly({ children }) {
    return (
        <Box
            component="span"
            sx={{
                position: 'absolute',
                width: '1px',
                height: '1px',
                padding: 0,
                margin: '-1px',
                overflow: 'hidden',
                clip: 'rect(0, 0, 0, 0)',
                whiteSpace: 'nowrap',
                borderWidth: 0
            }}
        >
            {children}
        </Box>
    );
}

/**
 * Focus trap for modals/dialogs
 */
export const useFocusTrap = (ref) => {
    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            const focusableElements = ref.current?.querySelectorAll(
                'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
            );

            if (focusableElements && focusableElements.length > 0) {
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    };

    return handleKeyDown;
};

/**
 * ARIA live region announcer for dynamic content
 */
export function LiveRegion({ message, politeness = 'polite' }) {
    return (
        <div
            role="status"
            aria-live={politeness}
            aria-atomic="true"
            style={{
                position: 'absolute',
                left: '-10000px',
                width: '1px',
                height: '1px',
                overflow: 'hidden'
            }}
        >
            {message}
        </div>
    );
}

/**
 * Keyboard navigation helpers
 */
export const handleArrowKeys = (e, items, currentIndex, onSelect) => {
    switch (e.key) {
        case 'ArrowDown':
            e.preventDefault();
            const nextIndex = Math.min(currentIndex + 1, items.length - 1);
            onSelect(nextIndex);
            break;
        case 'ArrowUp':
            e.preventDefault();
            const prevIndex = Math.max(currentIndex - 1, 0);
            onSelect(prevIndex);
            break;
        case 'Home':
            e.preventDefault();
            onSelect(0);
            break;
        case 'End':
            e.preventDefault();
            onSelect(items.length - 1);
            break;
        case 'Enter':
        case ' ':
            e.preventDefault();
            // Trigger selection
            items[currentIndex]?.click();
            break;
        default:
            break;
    }
};

/**
 * Color contrast checker (WCAG AA requires 4.5:1 for normal text)
 */
export const checkContrastRatio = (foreground, background) => {
    // Simple hex to RGB conversion
    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    const getLuminance = (rgb) => {
        const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
            c = c / 255;
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const fg = hexToRgb(foreground);
    const bg = hexToRgb(background);

    if (!fg || !bg) return null;

    const l1 = getLuminance(fg);
    const l2 = getLuminance(bg);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

    return {
        ratio: ratio.toFixed(2),
        passesAA: ratio >= 4.5,
        passesAAA: ratio >= 7
    };
};

/**
 * Form validation with ARIA announcements
 */
export const announce = (message) => {
    const announcer = document.getElementById('a11y-announcer');
    if (announcer) {
        announcer.textContent = message;
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    }
};
