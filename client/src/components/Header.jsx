import React, { useState } from 'react';
import { useMsal } from "@azure/msal-react";
import { Menu, Sun, Moon, LogOut, User } from 'lucide-react';
import logo from '../assets/logo-don-yeyo-png-sin-fondo.png';

const Header = ({ onMenuClick, theme, toggleTheme }) => {
    const { instance, accounts } = useMsal();
    const [showUserMenu, setShowUserMenu] = useState(false);

    const user = accounts[0] || {};
    const name = user.name || user.username || "Usuario";
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

    const handleLogout = () => {
        instance.logoutRedirect().catch(e => console.error(e));
    };

    return (
        <header className="header glass">
            <div className="header-left">
                <button className="mode-toggle" onClick={onMenuClick}>
                    <Menu size={24} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={logo} alt="Don Yeyo" style={{ height: '36px', objectFit: 'contain' }} />
                    <h2 className="desktop-only" style={{ fontSize: '1.1rem', margin: 0, fontWeight: 800 }}>
                        Control de Ingresos y Egresos
                    </h2>
                    <h2 className="mobile-only" style={{ fontSize: '1.1rem', margin: 0, fontWeight: 800 }}>
                        CIE
                    </h2>
                </div>
            </div>

            <div className="header-right">
                <button className="mode-toggle desktop-only" onClick={toggleTheme} title="Cambiar modo">
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <div
                    className="avatar-container"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    style={{ position: 'relative' }}
                >
                    <span className="user-name desktop-only">{name}</span>
                    <div className="avatar">
                        {initials || <User size={20} />}
                    </div>

                    {showUserMenu && (
                        <div className="glass" style={{
                            position: 'absolute',
                            top: '100%',
                            right: 0,
                            marginTop: '8px',
                            minWidth: '180px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            zIndex: 150
                        }}>
                            {/* Re-agregar el botón de modo en el menú de usuario para mobile */}
                            <button
                                className="mobile-only"
                                onClick={toggleTheme}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: 0,
                                    justifyContent: 'flex-start',
                                    background: 'transparent',
                                    fontSize: '0.9rem'
                                }}
                            >
                                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                                {theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
                            </button>

                            <button
                                onClick={handleLogout}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: 0,
                                    justifyContent: 'flex-start',
                                    color: 'var(--error)',
                                    background: 'transparent',
                                    fontSize: '0.9rem',
                                    border: 'none'
                                }}
                            >
                                <LogOut size={18} />
                                Cerrar Sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
