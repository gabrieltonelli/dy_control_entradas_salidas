import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../config/AuthContext';

/**
 * PorteriaGuard
 * Comprueba si el usuario logueado es personal de portería.
 * Si lo es, pasa { porteria } al children via render prop.
 * Si no lo es, redirige al home.
 */
const PorteriaGuard = ({ children }) => {
    const { esPortero, porteria } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (esPortero === false) {
            navigate('/', { replace: true });
        }
    }, [esPortero, navigate]);

    if (esPortero === null) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <p style={{ color: 'var(--text-muted)' }}>Verificando acceso...</p>
            </div>
        );
    }

    if (esPortero) {
        return children(porteria);
    }

    return null;
};

export default PorteriaGuard;
