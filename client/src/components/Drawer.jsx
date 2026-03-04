import React from 'react';
import { X, Settings, FilePlus, ClipboardList } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Drawer = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { icon: <FilePlus size={20} />, label: 'Nueva Solicitud', path: '/nuevo' },
        { icon: <ClipboardList size={20} />, label: 'Mis Solicitudes', path: '/mis-solicitudes' },
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
                    {menuItems.map((item, index) => {
                        const isActive = location.pathname === item.path ||
                            (item.path === '/nuevo' && location.pathname === '/');
                        return (
                            <button
                                key={index}
                                onClick={() => handleClick(item.path)}
                                style={{
                                    width: '100%',
                                    padding: '14px 20px',
                                    borderRadius: '15px',
                                    justifyContent: 'flex-start',
                                    background: isActive ? 'rgba(228, 5, 33, 0.08)' : 'transparent',
                                    color: isActive ? 'var(--dy-red)' : 'var(--text)',
                                    fontWeight: isActive ? 700 : 500,
                                    opacity: item.path === '#' ? 0.5 : 1,
                                    border: isActive ? '1px solid rgba(228, 5, 33, 0.25)' : 'none',
                                    textAlign: 'left'
                                }}
                            >
                                <span style={{ color: 'var(--dy-red)', marginRight: '10px', verticalAlign: 'middle' }}>{item.icon}</span>
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div style={{ position: 'absolute', bottom: '40px', left: '24px' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--drawer-footer)', fontWeight: 700 }}>DON YEYO S.A.</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>v1.1.0</p>
                </div>
            </div>
        </>
    );
};

export default Drawer;
