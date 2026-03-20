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
    const { esPortero, porteria, hasRole } = useAuth();
    const navigate = useNavigate();

    const canEnter = esPortero === true || hasRole(2) || hasRole(100);

    useEffect(() => {
        // Solo redirigir si ya sabemos que NO es portero Y no tiene roles superiores
        if (esPortero === false && !hasRole(2) && !hasRole(100)) {
            navigate('/', { replace: true });
        }
    }, [esPortero, hasRole, navigate]);

    if (esPortero === null) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <p style={{ color: 'var(--text-muted)' }}>Verificando acceso...</p>
            </div>
        );
    }

    if (canEnter) {
        // Si es admin/RRHH pero no es portero, pasamos porteria como null
        return children(esPortero ? porteria : { id: 0, nombre: 'Acceso Administración' });
    }

    return null;
};

export default PorteriaGuard;
