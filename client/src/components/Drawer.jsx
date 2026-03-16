import React, { useEffect, useState } from 'react';
import { X, Settings, FilePlus, ClipboardList, ShieldCheck, History, BookOpen } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../config/AuthContext';

const Drawer = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { esPortero, porteria } = useAuth();

    const menuItems = !esPortero ? [
        { icon: <FilePlus size={20} />, label: 'Nueva Solicitud', path: '/nuevo' },
        { icon: <ClipboardList size={20} />, label: 'Mis Solicitudes', path: '/mis-solicitudes' },
        { icon: <BookOpen size={20} />, label: 'Novedades', path: '/reglamento' },
        { icon: <Settings size={20} />, label: 'Configuración', path: '/configuracion' },
    ] : [
        { icon: <BookOpen size={20} />, label: 'Novedades', path: '/reglamento' },
        { icon: <Settings size={20} />, label: 'Configuración', path: '/configuracion' },
    ];

    // Ítems exclusivos de portería (solo si es portero)
    const porteriaItems = esPortero && porteria
        ? [
            { icon: <ShieldCheck size={20} />, label: 'Pendientes del día', path: '/porteria' },
            { icon: <History size={20} />, label: 'Historial portería', path: '/porteria/historial' },
        ]
        : [];

    const allItems = [...menuItems, ...porteriaItems];

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
                    {allItems.map((item, index) => {
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

                {porteria && (
                    <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--card-border)' }}>
                        <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', padding: '0 6px' }}>
                            <ShieldCheck size={11} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                            {porteria.nombre}
                        </p>
                    </div>
                )}

                <div style={{ position: 'absolute', bottom: '40px', left: '24px' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--drawer-footer)', fontWeight: 700 }}>DON YEYO S.A.</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>v{__APP_VERSION__}</p>
                </div>
            </div>
        </>
    );
};

export default Drawer;
