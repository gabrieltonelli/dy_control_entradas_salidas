import React from 'react';
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "../config/msal";
import { Button } from "./Button";
import { LogIn } from "lucide-react";

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
            <div style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '24px'
            }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Don Yeyo Access</h1>
                <p style={{ color: 'var(--text-muted)', maxWidth: '400px', textAlign: 'center' }}>
                    Por favor inicie sesión con su cuenta corporativa para acceder al sistema.
                </p>
                <Button variant="primary" size="lg" onClick={handleLogin}>
                    <LogIn size={20} /> Iniciar Sesión con Microsoft
                </Button>
            </div>
        );
    }

    return children;
};
