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
        <div style={{ padding: '40px' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(to right, var(--primary), var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Control de Accesos
                    </h1>
                    <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>Gestión en tiempo real de ingresos y egresos.</p>
                </div>
                <Link to="/nuevo">
                    <Button variant="primary" className="glass">
                        <Plus size={20} /> Nueva Solicitud
                    </Button>
                </Link>
            </header>

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
