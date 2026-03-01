import React from 'react';
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "../config/msal";
import { Button } from "./Button";
import logo from '../assets/logo-don-yeyo-png-sin-fondo.png';
import microsoftLogo from '../assets/microsoft-logo.png';

export const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useIsAuthenticated();
    const { instance } = useMsal();

    const handleLogin = () => {
        instance.loginRedirect(loginRequest).catch(e => {
            console.error(e);
        });
    };

    if (!isAuthenticated) {
        return (
            <div className="glass" style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                textAlign: 'center',
                padding: '24px'
            }}>
                <img src={logo} alt="Don Yeyo" style={{ height: '140px', marginBottom: '16px', objectFit: 'contain' }} />
                <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--header-text)', margin: 0 }}>
                    Control de Ingresos y Egresos
                </h1>

                <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '16px 0 32px 0', fontSize: '1.1rem' }}>
                    Bienvenido. Inicie sesión con su cuenta corporativa para acceder al sistema.
                </p>

                <Button
                    variant="primary"
                    onClick={handleLogin}
                    style={{
                        padding: '16px 40px',
                        gap: '16px',
                        fontSize: '1.25rem',
                        boxShadow: '0 4px 12px rgba(13, 44, 92, 0.25)'
                    }}
                >
                    <img
                        src={microsoftLogo}
                        alt="Microsoft"
                        style={{ height: '26px', width: '26px', objectFit: 'contain' }}
                    />
                    Iniciar Sesión con Microsoft
                </Button>
            </div>
        );
    }

    return children;
};
