import React from 'react';

export const Button = ({ children, variant = 'primary', size = 'md', className = '', style = {}, ...props }) => {
    // Definimos las clases base y de variantes
    const baseClass = 'btn';
    const variantClass = `btn-${variant}`;
    const sizeClass = `btn-${size}`;

    return (
        <button
            className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}
            style={style}
            {...props}
        >
            {children}
        </button>
    );
};
