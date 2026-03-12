import { useAuth } from "../config/AuthContext";
import { useTheme } from "../config/ThemeContext";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { Button } from "./Button";
import { Sun, Moon } from 'lucide-react';
import logo from '../assets/logo-don-yeyo-png-sin-fondo.png';
import microsoftLogo from '../assets/microsoft-logo.png';
import googleLogo from '../assets/google-logo.svg';

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loginMicrosoft, loginGoogle } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const res = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });
                loginGoogle(res.data);
            } catch (error) {
                console.error('Error fetching Google user info:', error);
            }
        },
        onError: (error) => console.log('Login Failed:', error)
    });

    if (!isAuthenticated) {
        return (
            <div className="glass login-container" style={{
                height: '100vh',
                display: 'flex',
                gap: '8px',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative'
            }}>
                {/* Botón de cambio de tema en el login */}
                <button
                    onClick={toggleTheme}
                    className="mode-toggle"
                    style={{
                        position: 'absolute',
                        top: '24px',
                        right: '24px',
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        boxShadow: 'var(--shadow-sm)'
                    }}
                    title="Cambiar modo"
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
                <img src={logo} alt="Don Yeyo" style={{ height: '140px', marginBottom: '16px', objectFit: 'contain' }} />
                <h1 style={{ fontWeight: '800', color: 'var(--header-text)', margin: 0 }}>
                    Control de Ingresos y Egresos
                </h1>

                <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '16px 0 32px 0', fontSize: '1.1rem' }}>
                    Bienvenido. Inicie sesión con su cuenta corporativa o personal registrada en la empresa.
                </p>

                <div className="login-options">
                    <Button
                        className="btn-microsoft"
                        onClick={loginMicrosoft}
                    >
                        <img
                            src={microsoftLogo}
                            alt="Microsoft"
                            style={{ height: '26px', width: '26px', objectFit: 'contain' }}
                        />
                        Inicia sesión con Microsoft
                    </Button>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        width: '100%',
                        maxWidth: '320px',
                        margin: '8px 0',
                        color: 'var(--text-muted)',
                        fontSize: '0.9rem'
                    }}>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                        <span>O</span>
                        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                    </div>

                    <Button
                        className="btn-google"
                        onClick={() => handleGoogleLogin()}
                    >
                        <img
                            src={googleLogo}
                            alt="Google"
                            style={{ height: '26px', width: '26px', objectFit: 'contain' }}
                        />
                        Inicia sesión con Google
                    </Button>
                </div>
            </div>
        );
    }

    return children;
};
