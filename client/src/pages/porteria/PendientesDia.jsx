import React, { useState, useEffect, useCallback } from 'react';
import { useMsal } from '@azure/msal-react';
import { ChevronDown, ChevronUp, RefreshCw, CheckCircle, PackageOpen, FileText, ShieldOff } from 'lucide-react';
import { getPendientes, completeMovimiento } from '../../services/porteriaService';
import './PendientesDia.css';

// ──────────────────────────────────────────────
// Utilidades
// ──────────────────────────────────────────────
function horaActual() {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

// ──────────────────────────────────────────────
// Sub-componente: card de un movimiento
// ──────────────────────────────────────────────
function MovCard({ mov, onCompleted }) {
    const [open, setOpen] = useState(false);
    const [hora, setHora] = useState(horaActual());
    const [obs, setObs] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { accounts } = useMsal();
    const email = accounts[0]?.username;

    const toggleOpen = () => {
        if (!open) setHora(horaActual()); // refrescar hora al abrir
        setOpen(o => !o);
    };

    const handleComplete = async () => {
        setLoading(true);
        setError('');
        try {
            await completeMovimiento(mov.id, {
                email,
                horaCompletado: hora,
                observacionPorteria: obs.trim() || null,
            });
            onCompleted(mov.id);
        } catch (e) {
            setError(e.response?.data?.error || 'Error al completar el movimiento');
        } finally {
            setLoading(false);
        }
    };

    const totalItems = (mov.articulos?.length || 0) + (mov.documentos?.length || 0);
    const persona = mov.persona_interna_nombre || mov.idPersonaExterna || '—';

    return (
        <div className="mov-card">
            <div className="mov-card-header" onClick={toggleOpen}>
                <div className="mov-card-left">
                    <span className="mov-persona">{persona}</span>
                    <span className="mov-ruta">
                        {mov.origen_nombre} → {mov.destino_nombre}
                    </span>
                    <div className="mov-badges">
                        <span className="badge badge-tipo">{mov.tipo_nombre}</span>
                        {mov.idGrupo > 0 && (
                            <span className="badge badge-grupo">
                                Paso {mov.ordenGrupo}/{mov.grupo_total} · {mov.grupo_completados} ✓
                            </span>
                        )}
                        {totalItems > 0 && (
                            <span className="badge badge-items">
                                {totalItems} {totalItems === 1 ? 'ítem' : 'ítems'}
                            </span>
                        )}
                    </div>
                </div>
                {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>

            {open && (
                <div className="mov-card-body">
                    {/* Artículos */}
                    {mov.articulos?.length > 0 && (
                        <div className="items-section">
                            <h4><PackageOpen size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />Artículos</h4>
                            {mov.articulos.map(a => (
                                <div key={a.id} className="item-row">
                                    <span className="item-qty">×{a.cantidad}</span>
                                    <span>{a.descripcion}</span>
                                    {a.sinRetorno ? <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sin retorno</span> : null}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Documentos */}
                    {mov.documentos?.length > 0 && (
                        <div className="items-section">
                            <h4><FileText size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />Documentos</h4>
                            {mov.documentos.map(d => (
                                <div key={d.id} className="item-row">
                                    <span className="item-qty">×{d.cantidad}</span>
                                    <span>{d.descripcion || d.tipo}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Formulario de completado */}
                    <div className="complete-form">
                        <div>
                            <label>Hora de paso</label>
                            <input
                                type="time"
                                value={hora}
                                onChange={e => setHora(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Observación del portero (opcional)</label>
                            <textarea
                                placeholder="Ingresá una observación si es necesario..."
                                value={obs}
                                onChange={e => setObs(e.target.value)}
                            />
                        </div>
                        {error && <p style={{ color: 'var(--dy-red)', fontSize: '0.85rem', margin: 0 }}>{error}</p>}
                        <button className="btn-completar" onClick={handleComplete} disabled={loading}>
                            <CheckCircle size={18} />
                            {loading ? 'Completando...' : 'Completar paso'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ──────────────────────────────────────────────
// Página principal
// ──────────────────────────────────────────────
function PendientesDia({ porteria }) {
    const { accounts } = useMsal();
    const email = accounts[0]?.username;

    const [movimientos, setMovimientos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await getPendientes(email);
            setMovimientos(res.data);
        } catch (e) {
            setError(e.response?.data?.error || 'Error al cargar los movimientos');
        } finally {
            setLoading(false);
        }
    }, [email]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleCompleted = (id) => {
        setMovimientos(prev => prev.filter(m => m.id !== id));
    };

    const today = new Date().toLocaleDateString('es-AR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div style={{ padding: '20px 16px', maxWidth: 700, margin: '0 auto' }}>
            <div className="porteria-header">
                <h1>Movimientos pendientes</h1>
                <span className="subtitle">{porteria?.nombre} · {today}</span>
                <button className="refresh-btn" onClick={fetchData} style={{ marginTop: 8 }}>
                    <RefreshCw size={14} /> Actualizar
                </button>
            </div>

            {loading && (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', paddingTop: 40 }}>
                    Cargando...
                </p>
            )}

            {!loading && error && (
                <div style={{ color: 'var(--dy-red)', textAlign: 'center', padding: 40 }}>
                    <ShieldOff size={40} style={{ opacity: 0.4, display: 'block', margin: '0 auto 12px' }} />
                    {error}
                </div>
            )}

            {!loading && !error && movimientos.length === 0 && (
                <div className="empty-state">
                    <CheckCircle size={56} />
                    <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>Sin movimientos pendientes</p>
                    <p style={{ fontSize: '0.85rem' }}>No hay autorizaciones pendientes para el día de hoy en este punto de control.</p>
                </div>
            )}

            {!loading && !error && movimientos.map(mov => (
                <MovCard key={mov.id} mov={mov} onCompleted={handleCompleted} />
            ))}
        </div>
    );
}

export default PendientesDia;
