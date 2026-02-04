/**
 * Shared Input Component
 * Reusable form input with validation support
 */

import React, { InputHTMLAttributes, forwardRef } from 'react';
import './Input.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, fullWidth = false, className = '', ...props }, ref) => {
        const inputClasses = [
            'input',
            error ? 'input-error' : '',
            fullWidth ? 'input-full-width' : '',
            className
        ].filter(Boolean).join(' ');

        return (
            <div className={`input-wrapper ${fullWidth ? 'input-wrapper-full-width' : ''}`}>
                {label && (
                    <label className="input-label" htmlFor={props.id}>
                        {label}
                        {props.required && <span className="input-required">*</span>}
                    </label>
                )}

                <input
                    ref={ref}
                    className={inputClasses}
                    {...props}
                />

                {error && <span className="input-error-text">{error}</span>}
                {!error && helperText && <span className="input-helper-text">{helperText}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';
