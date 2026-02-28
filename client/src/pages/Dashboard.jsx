import React, { useState, useEffect } from 'react';
import { MovementsService } from '../services/api';
import { Card } from '../components/FormElements';
import { Button } from '../components/Button';
import { Plus, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [movements, setMovements] = useState([]);

    useEffect(() => {
        const fetchMovements = async () => {
            try {
                const res = await MovementsService.getAll();
                setMovements(res.data);
            } catch (error) {
                console.error('Error fetching movements:', error);
            }
        };
        fetchMovements();
    }, []);

    return (
        <div className="card-anim">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '2.4rem', fontWeight: '900', color: 'var(--dy-blue)' }}>
                        Dashboard<span style={{ color: 'var(--dy-red)' }}>.</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '1.1rem' }}>Seguimiento de movimientos y autorizaciones.</p>
                </div>
                <Link to="/nuevo">
                    <button className="primary" style={{ height: '50px', padding: '0 30px', fontSize: '1rem', boxShadow: 'var(--shadow)' }}>
                        <Plus size={20} /> Nueva Solicitud
                    </button>
                </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {movements.map(mov => (
                    <Card key={mov.id} className="movement-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                backgroundColor: mov.idEstado === 1 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                color: mov.idEstado === 1 ? 'var(--warning)' : 'var(--success)'
                            }}>
                                {mov.estado_nombre}
                            </span>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                {new Date(mov.fechaHoraRegistro).toLocaleDateString()}
                            </span>
                        </div>
                        <h3 style={{ fontSize: '1.125rem', marginBottom: '16px' }}>{mov.tipo_nombre}</h3>

                        <div style={{ fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Autorizante:</span>
                                <span>{mov.autorizante_nombre}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Origen:</span>
                                <span>{mov.origen_nombre}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Destino:</span>
                                <span>{mov.destino_nombre}</span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
