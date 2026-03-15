import React, { useState } from 'react';
import Header from './Header';
import Drawer from './Drawer';
import { useTheme } from '../config/ThemeContext';
import { useAuth } from '../config/AuthContext';
import QRScanner from './QRScanner';

const Layout = ({ children }) => {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { esPortero } = useAuth();

    return (
        <div className="layout">
            <Header
                onMenuClick={() => setDrawerOpen(true)}
                theme={theme}
                toggleTheme={toggleTheme}
            />
            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => setDrawerOpen(false)}
            />
            <main className="content">
                {children}
            </main>
            
            {esPortero && <QRScanner onScanSuccess={() => {
                // Si estamos en la página de portería, refrescar los datos
                if (window.location.pathname.includes('/porteria')) {
                    // Una forma simple de forzar el refresh es disparar un evento o recargar si es necesario, 
                    // pero PendientesDia ya tiene un intervalo. Forzamos un refresh via window event.
                    window.dispatchEvent(new CustomEvent('qr-scan-success'));
                }
            }} />}
        </div>
    );
};

export default Layout;
