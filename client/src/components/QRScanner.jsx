import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrCode, X, Check, Camera, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../config/AuthContext';
import './QRScanner.css';

const QRScanner = ({ onScanSuccess }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [lastScanId, setLastScanId] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, scanning, success, error
    const [message, setMessage] = useState('');
    const [requiresClockIn, setRequiresClockIn] = useState(false);
    const { user } = useAuth();
    
    useEffect(() => {
        let scanner = null;
        if (isOpen && status === 'scanning') {
            scanner = new Html5QrcodeScanner("reader", {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            });
            
            scanner.render(async (decodedText) => {
                if (decodedText === lastScanId) return; // Evitar scans duplicados rápidos
                
                setLastScanId(decodedText);
                scanner.clear();
                handleQRScan(decodedText);
            }, (error) => {
                // Errores de escaneo silenciosos
            });
        }
        
        return () => {
            if (scanner) {
                scanner.clear().catch(e => console.error("Error clearing scanner", e));
            }
        };
    }, [isOpen, status]);

    const handleQRScan = async (qrData) => {
        setStatus('loading');
        try {
            const API_URL = import.meta.env.VITE_API_URL;
            // Obtener vigilador de localStorage para coherencia con la UI
            const vigilador = localStorage.getItem('porteria_vigilador_seleccionado');
            
            const response = await axios.post(`${API_URL}/porteria/scan-qr`, {
                qrData,
                email: user.email,
                vigilador
            });
            
            setStatus('success');
            setMessage(response.data.message);
            setRequiresClockIn(!!response.data.requiereFichaje);
            
            if (onScanSuccess) onScanSuccess(response.data.id);
            
            // Auto close after some time if NO clock-in required, otherwise wait for user to acknowledge
            if (!response.data.requiereFichaje) {
                setTimeout(() => {
                    setIsOpen(false);
                    resetState();
                }, 2000);
            }
            
        } catch (error) {
            setStatus('error');
            setMessage(error.response?.data?.error || 'Error al procesar el código QR');
            setLastScanId(null);
        }
    };

    const resetState = () => {
        setStatus('idle');
        setMessage('');
        setLastScanId(null);
        setRequiresClockIn(false);
    };

    const toggleOpen = () => {
        if (!isOpen) {
            setIsOpen(true);
            setStatus('scanning');
        } else {
            setIsOpen(false);
            resetState();
        }
    };

    return (
        <>
            {/* Round Floating Action Button */}
            <button 
                className={`qr-fab ${isOpen ? 'active' : ''}`}
                onClick={toggleOpen}
                title="Escanear QR"
            >
                <QrCode size={28} />
            </button>

            {/* Modal Scanner */}
            {isOpen && (
                <div className="qr-scanner-overlay">
                    <div className="qr-scanner-modal glass">
                        <div className="qr-scanner-header">
                            <h3>Escanear Autorización</h3>
                            <button className="qr-close-btn" onClick={toggleOpen}>
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="qr-scanner-content">
                            {status === 'scanning' && (
                                <div id="reader"></div>
                            )}
                            
                            {status === 'loading' && (
                                <div className="qr-status-msg">
                                    <div className="qr-loading-spinner"></div>
                                    <p>Procesando autorización...</p>
                                </div>
                            )}
                            
                            {status === 'success' && (
                                <div className="qr-status-msg success">
                                    <div className="qr-icon-circle success">
                                        <Check size={40} />
                                    </div>
                                    <p>{message}</p>
                                    
                                    {requiresClockIn && (
                                        <div className="qr-fichaje-alert">
                                            <AlertCircle size={20} />
                                            <div>
                                                <strong>¡MOVIMIENTO CON FICHAJE!</strong>
                                                <p>Por favor, solicite al personal que realice el fichaje correspondiente.</p>
                                            </div>
                                        </div>
                                    )}

                                    {requiresClockIn && (
                                        <button className="btn btn-primary qr-finish-btn" onClick={toggleOpen}>
                                            Entendido / Cerrar
                                        </button>
                                    )}
                                </div>
                            )}
                            
                            {status === 'error' && (
                                <div className="qr-status-msg error">
                                    <div className="qr-icon-circle error">
                                        <AlertCircle size={40} />
                                    </div>
                                    <p>{message}</p>
                                    <button 
                                        className="btn btn-primary qr-retry-btn"
                                        onClick={() => setStatus('scanning')}
                                    >
                                        <Camera size={18} /> Reintentar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default QRScanner;
