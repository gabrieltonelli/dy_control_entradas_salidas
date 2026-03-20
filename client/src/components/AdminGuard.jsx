import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../config/AuthContext';

const AdminGuard = ({ children, minRole = 2 }) => {
    const { hasRole, legajoInfo } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (legajoInfo && !hasRole(minRole)) {
            navigate('/', { replace: true });
        }
    }, [legajoInfo, hasRole, minRole, navigate]);

    if (!legajoInfo) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <p style={{ color: 'var(--text-muted)' }}>Cargando permisos...</p>
            </div>
        );
    }

    if (hasRole(minRole)) {
        return children;
    }

    return null;
};

export default AdminGuard;
