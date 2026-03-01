import React from 'react';

export const Card = ({ children, className = '', style = {}, ...props }) => {
    return (
        <div
            style={{
                padding: '24px',
                borderRadius: 'var(--radius)',
                backgroundColor: 'var(--surface)',
                marginBottom: '16px',
                ...style
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

export const Select = ({ label, options = [], includePlaceholder = false, ...props }) => {
    return (
        <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {label && <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>{label}</label>}
            <select
                style={{ width: '100%', outline: 'none' }}
                {...props}
            >
                {includePlaceholder && <option value="">-- Seleccione --</option>}
                {options.map((opt, i) => (
                    <option key={i} value={opt.value || opt.id || opt}>{opt.label || opt.nombre || opt}</option>
                ))}
            </select>
        </div>
    );
};

export const Autocomplete = ({ label, options = [], onSelect, value = '', ...props }) => {
    const [inputValue, setInputValue] = React.useState('');
    const [showOptions, setShowOptions] = React.useState(false);

    // Refs para evitar problemas de cierres (closures) obsoletos en el setTimeout del Blur
    const selectedRef = React.useRef(null);
    const inputRef = React.useRef(inputValue);

    React.useEffect(() => {
        inputRef.current = inputValue;
    }, [inputValue]);

    // Sincronizar con el valor externo (Legajo) para mostrar el Nombre correspondiente
    React.useEffect(() => {
        if (!value) {
            setInputValue('');
            selectedRef.current = null;
            return;
        }
        const opt = options.find(o => String(o.id) === String(value));
        if (opt) {
            setInputValue(opt.label);
            selectedRef.current = opt;
        }
    }, [value, options]);

    const filteredOptions = options.filter(opt =>
        (opt.label || '').toLowerCase().startsWith(inputValue.toLowerCase())
    ).slice(0, 10);

    const handleBlur = () => {
        // Delay para permitir que el onMouseDown de la lista ocurra antes
        setTimeout(() => {
            setShowOptions(false);
            const currentSelected = selectedRef.current;
            if (!currentSelected || currentSelected.label !== inputRef.current) {
                // Si el texto final no coincide con la opción que teníamos como seleccionada
                setInputValue('');
                selectedRef.current = null;
                onSelect({ id: '', label: '' });
            }
        }, 250);
    };

    const handleSelection = (opt) => {
        setInputValue(opt.label);
        selectedRef.current = opt;
        onSelect(opt);
        setShowOptions(false);
    };

    return (
        <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative', zIndex: showOptions ? 1001 : 1 }}>
            {label && <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>{label}</label>}
            <input
                style={{ width: '100%', outline: 'none' }}
                value={inputValue}
                onChange={(e) => {
                    const val = e.target.value;
                    setInputValue(val);
                    setShowOptions(true);
                    if (val === '') {
                        selectedRef.current = null;
                        onSelect({ id: '', label: '' });
                    }
                }}
                onFocus={() => setShowOptions(true)}
                onBlur={handleBlur}
                {...props}
                autoComplete="off"
            />
            {showOptions && inputValue.length > 0 && (
                <ul className="glass" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 1002,
                    marginTop: '4px',
                    borderRadius: 'var(--radius)',
                    maxHeight: '250px',
                    overflowY: 'auto',
                    border: '1px solid var(--border)',
                    boxShadow: 'var(--shadow-lg)',
                    padding: '8px 0',
                    backgroundColor: 'var(--surface)'
                }}>
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((opt, i) => (
                            <li
                                key={i}
                                onMouseDown={(e) => {
                                    // Previene que el blur del input ocurra antes de esta selección
                                    e.preventDefault();
                                    handleSelection(opt);
                                }}
                                style={{
                                    padding: '10px 16px',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    color: 'var(--text)',
                                    transition: 'background 0.2s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.05)'}
                                onMouseLeave={(e) => e.target.style.background = 'transparent'}
                            >
                                {opt.label}
                            </li>
                        ))
                    ) : (
                        <li style={{ padding: '10px 16px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            No se encontraron resultados
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export const Switch = ({ label, checked, onChange, activeLabel = 'Activado', inactiveLabel = 'Desactivado', ...props }) => {
    return (
        <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {label && <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>{label}</label>}
            <div
                onClick={() => onChange({ target: { name: props.name, checked: !checked, type: 'checkbox' } })}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    userSelect: 'none'
                }}
            >
                <div style={{
                    width: '48px',
                    height: '24px',
                    backgroundColor: checked ? 'var(--switch-track-active)' : 'rgba(203, 213, 225, 0.5)',
                    borderRadius: '12px',
                    position: 'relative',
                    transition: 'background-color 0.2s ease'
                }}>
                    <div style={{
                        width: '18px',
                        height: '18px',
                        backgroundColor: checked ? 'var(--switch-thumb)' : '#ffffff',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: '2px', // Centrado con el borde de 1px
                        left: checked ? '27px' : '3px',
                        transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                    }} />
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--header-text)' }}>
                    {checked ? activeLabel : inactiveLabel}
                </span>
            </div>
        </div>
    );
};
