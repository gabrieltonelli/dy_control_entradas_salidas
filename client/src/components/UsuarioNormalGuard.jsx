import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../config/AuthContext';

const UsuarioNormalGuard = ({ children }) => {
    const { esPortero } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (esPortero === true) {
            navigate('/porteria', { replace: true });
        }
    }, [esPortero, navigate]);

    if (esPortero === null) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <p style={{ color: 'var(--text-muted)' }}>Cargando perfil...</p>
            </div>
        );
    }

    if (esPortero === false) {
        return children;
    }

    return null;
};

export default UsuarioNormalGuard;
