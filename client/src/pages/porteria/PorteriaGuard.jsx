import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../config/AuthContext';
import { checkPorteria } from '../../services/porteriaService';

/**
 * PorteriaGuard
 * Comprueba si el usuario logueado es personal de portería.
 * Si lo es, pasa { porteria } al children via render prop.
 * Si no lo es, redirige al home.
 */
const PorteriaGuard = ({ children }) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [porteria, setPorteria] = useState(null);

    const email = user?.email;

    useEffect(() => {
        if (!email) { navigate('/'); return; }

        checkPorteria(email)
            .then(res => {
                if (res.data.esPortero) {
                    setPorteria(res.data.porteria);
                } else {
                    navigate('/');
                }
            })
            .catch(() => navigate('/'))
            .finally(() => setLoading(false));
    }, [email, navigate]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <p style={{ color: 'var(--text-muted)' }}>Verificando acceso...</p>
            </div>
        );
    }

    return children(porteria);
};

export default PorteriaGuard;
