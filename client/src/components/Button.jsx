import React from 'react';

export const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
    const variants = {
        primary: 'background-color: var(--primary); color: white;',
        secondary: 'background-color: var(--surface); color: var(--text); border: 1px solid var(--border);',
        ghost: 'background: transparent; color: var(--text);',
        danger: 'background-color: var(--error); color: white;'
    };

    const sizes = {
        sm: 'padding: 6px 12px; font-size: 0.875rem;',
        md: 'padding: 10px 20px; font-size: 1rem;',
        lg: 'padding: 14px 28px; font-size: 1.125rem;'
    };

    return (
        <button
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                ...getStyles(variants[variant]),
                ...getStyles(sizes[size])
            }}
            className={`btn-${variant} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

// Simple helper to convert string CSS to object for React style (since we are not using Tailwind)
function getStyles(str) {
    if (!str) return {};
    const styles = {};
    str.split(';').forEach(s => {
        const [key, val] = s.split(':');
        if (key && val) {
            const camelKey = key.trim().replace(/-./g, x => x[1].toUpperCase());
            styles[camelKey] = val.trim();
        }
    });
    return styles;
}
