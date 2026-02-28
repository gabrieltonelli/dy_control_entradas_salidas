import React, { useState } from 'react';
import { useMsal } from "@azure/msal-react";
import { Menu, Sun, Moon, LogOut, User } from 'lucide-react';

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
                    <span style={{ color: 'var(--dy-red)', fontWeight: 900, fontSize: '1.4rem' }}>DY</span>
                    <h2 style={{ fontSize: '1.1rem', margin: 0 }}>Control de Acceso</h2>
                </div>
            </div>

            <div className="header-right">
                <button className="mode-toggle" onClick={toggleTheme} title="Cambiar modo">
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <div 
                    className="avatar-container" 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    style={{ position: 'relative' }}
                >
                    <span className="user-name">{name}</span>
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
                            <button 
                                onClick={handleLogout}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    borderRadius: 0,
                                    justifyContent: 'flex-start',
                                    color: 'var(--error)',
                                    background: 'transparent'
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
