import React from 'react';
import { X, Home, Clock, Settings, FilePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Drawer = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const menuItems = [
        { icon: <FilePlus size={20} />, label: 'Nueva Solicitud', path: '/nuevo' },
        { icon: <Settings size={20} />, label: 'Configuración', path: '/configuracion' },
    ];

    const handleClick = (path) => {
        if (path !== '#') navigate(path);
        onClose();
    };

    return (
        <>
            <div
                className={`drawer-overlay ${isOpen ? 'open' : ''}`}
                onClick={onClose}
            />
            <div className={`drawer ${isOpen ? 'open' : ''} glass`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--drawer-title)' }}>Menú</h2>
                    <button className="mode-toggle" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => handleClick(item.path)}
                            style={{
                                width: '100%',
                                padding: '14px 20px',
                                borderRadius: '15px',
                                justifyContent: 'flex-start',
                                background: 'transparent',
                                color: 'var(--text)',
                                fontWeight: 500,
                                opacity: item.path === '#' ? 0.5 : 1,
                                border: 'none',
                                textAlign: 'left'
                            }}
                        >
                            <span style={{ color: 'var(--dy-red)', marginRight: '10px', verticalAlign: 'middle' }}>{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div style={{ position: 'absolute', bottom: '40px', left: '24px' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--drawer-footer)', fontWeight: 700 }}>DON YEYO S.A.</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>v1.0.0</p>
                </div>
            </div>
        </>
    );
};

export default Drawer;
