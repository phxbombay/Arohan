/**
 * Accessibility utilities and ARIA helpers
 * WCAG 2.1 AA compliance utilities
 */

/**
 * Keyboard navigation hook
 * Handles common keyboard interactions
 */
import { useEffect, useCallback } from 'react';

export function useKeyboardNavigation(handlers: {
    onEscape?: () => void;
    onEnter?: () => void;
    onArrowUp?: () => void;
    onArrowDown?: () => void;
    onArrowLeft?: () => void;
    onArrowRight?: () => void;
}) {
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            switch (event.key) {
                case 'Escape':
                    handlers.onEscape?.();
                    break;
                case 'Enter':
                    handlers.onEnter?.();
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    handlers.onArrowUp?.();
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    handlers.onArrowDown?.();
                    break;
                case 'ArrowLeft':
                    handlers.onArrowLeft?.();
                    break;
                case 'ArrowRight':
                    handlers.onArrowRight?.();
                    break;
            }
        },
        [handlers]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);
}

/**
 * Focus trap for modals and dialogs
 */
export function useFocusTrap(enabled: boolean) {
    useEffect(() => {
        if (!enabled) return;

        const focusableElements =
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

        const modal = document.querySelector('[role="dialog"]');
        if (!modal) return;

        const firstFocusable = modal.querySelectorAll(focusableElements)[0] as HTMLElement;
        const focusableContent = modal.querySelectorAll(focusableElements);
        const lastFocusable = focusableContent[focusableContent.length - 1] as HTMLElement;

        const handleTabKey = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        };

        document.addEventListener('keydown', handleTabKey);
        firstFocusable?.focus();

        return () => document.removeEventListener('keydown', handleTabKey);
    }, [enabled]);
}

/**
 * Announce messages to screen readers
 */
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    const announcer = document.getElementById('announcer') || createAnnouncer();
    announcer.setAttribute('aria-live', priority);
    announcer.textContent = message;

    // Clear after announcement
    setTimeout(() => {
        announcer.textContent = '';
    }, 1000);
}

function createAnnouncer() {
    const announcer = document.createElement('div');
    announcer.id = 'announcer';
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);
    return announcer;
}

/**
 * Skip to main content link component
 */
export function SkipLink() {
    return (
        <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-primary focus:text-white"
        >
            Skip to main content
        </a>
    );
}
