import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, RefreshCw, X } from 'lucide-react';
import { Card } from '../components/FormElements';
import { Button } from '../components/Button';
import './StatusPage.css';

const StatusPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { success, message, resetData } = location.state || { success: true, message: 'Operación completada' };

    return (
        <div className="status-page-container card-anim">
            <div className="status-card-wrapper">
                <Card className={`status-card ${success ? 'success' : 'error'}`}>
                    <div className="status-icon-container">
                        {success ? (
                            <CheckCircle size={80} className="icon-success" />
                        ) : (
                            <XCircle size={80} className="icon-error" />
                        )}
                    </div>

                    <h1 className="status-title">
                        {success ? '¡Muchas Gracias!' : 'Oops, algo salió mal'}
                        <span className="dot">.</span>
                    </h1>

                    <p className="status-message">{message}</p>

                    <div className="status-info-box">
                        <p>Ya puede cerrar la aplicación de forma segura.</p>
                    </div>

                    <div className="status-actions">
                        <Button
                            variant="primary"
                            className="btn-new-request"
                            onClick={() => navigate('/nuevo')}
                        >
                            <RefreshCw size={20} style={{ marginRight: '8px' }} />
                            Generar otra solicitud
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default StatusPage;
