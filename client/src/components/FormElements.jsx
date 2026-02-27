import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
    return (
        <div
            style={{
                padding: '24px',
                borderRadius: 'var(--radius)',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow)',
                marginBottom: '16px'
            }}
            className={`glass ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export const Input = ({ label, ...props }) => {
    return (
        <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {label && <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>{label}</label>}
            <input
                style={{ width: '100%', outline: 'none' }}
                {...props}
            />
        </div>
    );
};

export const Select = ({ label, options = [], ...props }) => {
    return (
        <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {label && <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>{label}</label>}
            <select
                style={{ width: '100%', outline: 'none' }}
                {...props}
            >
                <option value="">-- Seleccione --</option>
                {options.map((opt, i) => (
                    <option key={i} value={opt.value || opt.id || opt}>{opt.label || opt.nombre || opt}</option>
                ))}
            </select>
        </div>
    );
};
