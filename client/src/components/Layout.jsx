import React, { useState, useEffect } from 'react';
import Header from './Header';
import Drawer from './Drawer';

const Layout = ({ children }) => {
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        document.body.className = theme === 'dark' ? 'dark-theme' : '';
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

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
        </div>
    );
};

export default Layout;
