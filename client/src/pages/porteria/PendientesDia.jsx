import React, { useState, useEffect, useCallback } from 'react';
import { useMsal } from '@azure/msal-react';
import { ChevronDown, ChevronUp, RefreshCw, CheckCircle, PackageOpen, FileText, ShieldOff, Clock, Accessibility } from 'lucide-react';
import { getPendientes, completeMovimiento, getPorteros } from '../../services/porteriaService';
import './PendientesDia.css';

const LS_VISTA = 'porteria_vista_simplificada';
const LS_VIGILADOR = 'porteria_vigilador_seleccionado';

function horaActual() {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

// ─── Card vista normal ────────────────────────────────────────
function MovCard({ mov, onCompleted, vigilador, setVigilador, porteros }) {
    const [open, setOpen] = useState(false);
    const [hora, setHora] = useState(horaActual());
    const [obs, setObs] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { accounts } = useMsal();
    const email = accounts[0]?.username;

    const handleComplete = async () => {
        if (!vigilador) {
            setError('Debe seleccionar un vigilador');
            return;
        }
        setLoading(true); setError('');
        try {
            await completeMovimiento(mov.id, {
                email,
                horaCompletado: hora,
                observacionPorteria: obs.trim() || null,
                vigilador
            });
            onCompleted(mov.id);
        } catch (e) {
            setError(e.response?.data?.error || 'Error al completar');
        } finally { setLoading(false); }
    };

    const totalItems = (mov.articulos?.length || 0) + (mov.documentos?.length || 0);
    const persona = mov.persona_interna_nombre || mov.idPersonaExterna || '—';

    return (
        <div className={`mov-card${open ? ' expanded' : ''}`}>
            <div className="mov-card-header" onClick={() => { if (!open) setHora(horaActual()); setOpen(o => !o); }}>
                <div className="mov-card-left">
                    <span className="mov-persona">{persona}</span>
                    <span className="mov-ruta">
                        {mov.origen_nombre}
                        <span className="arrow"> → </span>
                        {mov.destino_nombre}
                    </span>
                    <div className="mov-badges">
                        <span className="badge badge-tipo">{mov.tipo_nombre}</span>
                        <span className="badge badge-motivo">{mov.motivo}</span>
                        {mov.idGrupo > 0 && <span className="badge badge-grupo">🔗 Paso {mov.ordenGrupo}/{mov.grupo_total} · {mov.grupo_completados} ✓</span>}
                        {totalItems > 0 && <span className="badge badge-items">{totalItems} {totalItems === 1 ? 'ítem' : 'ítems'}</span>}
                    </div>
                </div>
                {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>

            {open && (
                <div className="mov-card-body">
                    {mov.articulos?.length > 0 && (
                        <div className="items-section">
                            <h4><PackageOpen size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />Artículos</h4>
                            {mov.articulos.map(a => (
                                <div key={a.id} className="item-row">
                                    <span className="item-qty">×{a.cantidad}</span>
                                    <span>{a.descripcion}</span>
                                    {a.sinRetorno && <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sin retorno</span>}
                                </div>
                            ))}
                        </div>
                    )}
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
                    <div className="complete-form">
                        <div>
                            <label>Hora de paso</label>
                            <div className="hora-row">
                                <input type="time" value={hora} onChange={e => setHora(e.target.value)} onClick={e => e.target.showPicker?.()} />
                            </div>
                        </div>
                        <div>
                            <label>Vigilador / Portero</label>
                            <input
                                list="porteros-list"
                                className="vigilante-input"
                                value={vigilador}
                                onChange={e => setVigilador(e.target.value)}
                                placeholder="Seleccione o escriba nombre..."
                                maxLength={30}
                            />
                        </div>
                        {error && <p style={{ color: 'var(--dy-red)', fontSize: '0.85rem', margin: 0 }}>{error}</p>}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                            <button className="btn-completar" onClick={handleComplete} disabled={loading} style={{ flex: 1 }}>
                                <CheckCircle size={18} />{loading ? 'Completando...' : 'Completar paso'}
                            </button>
                            {mov.motivo?.toLowerCase() !== 'requerimiento laboral' && (
                                <div className="alert-fichaje">
                                    <Accessibility size={16} />
                                    <span>Requiere fichaje</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Card vista simplificada ──────────────────────────────────
function SimpleCard({ mov, onCompleted, vigilador, setVigilador, porteros }) {
    const [open, setOpen] = useState(false);
    const [hora, setHora] = useState(horaActual());
    const [obs, setObs] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { accounts } = useMsal();
    const email = accounts[0]?.username;

    const handleComplete = async () => {
        if (!vigilador) {
            setError('Seleccione un vigilador');
            return;
        }
        setLoading(true); setError('');
        try {
            await completeMovimiento(mov.id, {
                email,
                horaCompletado: hora,
                observacionPorteria: obs.trim() || null,
                vigilador
            });
            onCompleted(mov.id);
        } catch (e) {
            setError(e.response?.data?.error || 'Error al completar');
        } finally { setLoading(false); }
    };

    const persona = mov.persona_interna_nombre || mov.idPersonaExterna || '—';
    const totalItems = (mov.articulos?.length || 0) + (mov.documentos?.length || 0);

    return (
        <div className={`simple-card${open ? ' expanded' : ''}`}>
            <div className="simple-card-header" onClick={() => { if (!open) setHora(horaActual()); setOpen(o => !o); }}>
                <div className="simple-persona">{persona}</div>
                <div className="simple-ruta">
                    {mov.origen_nombre}
                    <span className="arrow">→</span>
                    {mov.destino_nombre}
                </div>
                <div className="simple-tipo">
                    {mov.tipo_nombre} · <strong>{mov.motivo}</strong>{totalItems > 0 ? ` · ${totalItems} ítem(s)` : ''}
                    {mov.idGrupo > 0 && (
                        <span className="badge badge-grupo" style={{ marginLeft: '8px', verticalAlign: 'middle' }}>
                            🔗 Paso {mov.ordenGrupo}/{mov.grupo_total}
                        </span>
                    )}
                </div>
                <div className="simple-expand-hint">
                    {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    {open ? 'Cerrar' : 'Tocar para completar'}
                </div>
            </div>

            {open && (
                <div className="simple-card-body">
                    {mov.articulos?.length > 0 && (
                        <div className="simple-items-section">
                            <h4><PackageOpen size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />Artículos</h4>
                            {mov.articulos.map(a => (
                                <div key={a.id} className="simple-item-row">
                                    <span className="simple-item-qty">×{a.cantidad}</span>
                                    <span>{a.descripcion}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {mov.documentos?.length > 0 && (
                        <div className="simple-items-section">
                            <h4><FileText size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />Documentos</h4>
                            {mov.documentos.map(d => (
                                <div key={d.id} className="simple-item-row">
                                    <span className="simple-item-qty">×{d.cantidad}</span>
                                    <span>{d.descripcion || d.tipo}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="simple-complete-form">
                        <div>
                            <label>Hora de paso</label>
                            <div className="simple-hora-row">
                                <input type="time" value={hora} onChange={e => setHora(e.target.value)} onClick={e => e.target.showPicker?.()} />
                            </div>
                        </div>
                        <div>
                            <label>Vigilador / Portero</label>
                            <input
                                list="porteros-list"
                                className="simple-vigilante-input"
                                value={vigilador}
                                onChange={e => setVigilador(e.target.value)}
                                placeholder="Escriba o seleccione..."
                                maxLength={30}
                            />
                        </div>
                        <div>
                            <label>Observación (opcional)</label>
                            <textarea placeholder="Escribí una observación si es necesario..." value={obs} onChange={e => setObs(e.target.value)} />
                        </div>
                        {error && <p style={{ color: 'var(--dy-red)', fontSize: '1rem', margin: 0, fontWeight: 700 }}>{error}</p>}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <button className="btn-completar-simple" onClick={handleComplete} disabled={loading} style={{ flex: 1 }}>
                                <CheckCircle size={26} />{loading ? 'Completando...' : 'COMPLETAR'}
                            </button>
                            {mov.motivo?.toLowerCase() !== 'requerimiento laboral' && (
                                <div className="alert-fichaje simple">
                                    <Accessibility size={24} />
                                    <span>REQUIERE FICHAJE</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Página principal ─────────────────────────────────────────
function PendientesDia({ porteria }) {
    const { accounts } = useMsal();
    const email = accounts[0]?.username;

    const [movimientos, setMovimientos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [porteros, setPorteros] = useState([]);
    const [vigilador, _setVigilador] = useState(localStorage.getItem(LS_VIGILADOR) || '');

    const setVigilador = (val) => {
        _setVigilador(val);
        localStorage.setItem(LS_VIGILADOR, val);
    };

    const [lastSync, setLastSync] = useState(new Date());
    const [countdown, setCountdown] = useState(parseInt(import.meta.env.VITE_SYNC_INTERVAL_SECONDS) || 60);

    // Vista simplificada persistida en localStorage
    const [vistaSimple, setVistaSimple] = useState(() =>
        localStorage.getItem(LS_VISTA) === 'true'
    );

    const toggleVista = () => {
        setVistaSimple(v => {
            const next = !v;
            localStorage.setItem(LS_VISTA, String(next));
            return next;
        });
    };

    const fetchData = useCallback(async (isBackground = false) => {
        if (!isBackground) setLoading(true);
        setError('');
        try {
            const res = await getPendientes(email);
            setMovimientos(res.data);
            const now = new Date();
            setLastSync(now);
            setCountdown(parseInt(import.meta.env.VITE_SYNC_INTERVAL_SECONDS) || 60);
        } catch (e) {
            if (!isBackground) setError(e.response?.data?.error || 'Error al cargar los movimientos');
        } finally {
            if (!isBackground) setLoading(false);
        }
    }, [email]);

    useEffect(() => {
        fetchData();
        // Sincronización automática se maneja en el efecto del countdown para mayor precisión
    }, [fetchData]);

    useEffect(() => {
        // Cargar porteros una sola vez al inicio
        getPorteros().then(res => {
            const data = Array.isArray(res.data) ? res.data : [];
            setPorteros(data);
            if (!localStorage.getItem(LS_VIGILADOR) && data.length > 0) {
                setVigilador(data[0].descripcion);
            }
        }).catch(err => {
            console.error('Error al cargar porteros:', err);
        });
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    fetchData(true);
                    return parseInt(import.meta.env.VITE_SYNC_INTERVAL_SECONDS) || 60;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, [fetchData]);

    const handleCompleted = (id) => setMovimientos(prev => prev.filter(m => m.id !== id));

    const today = new Date().toLocaleDateString('es-AR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    return (
        <div style={{ padding: '20px 16px', maxWidth: vistaSimple ? 600 : 700, margin: '0 auto' }}>
            <div className="porteria-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1>Movimientos pendientes</h1>
                        <span className="subtitle">{porteria?.nombre} · {today}</span>
                    </div>
                    <div className="sync-info">
                        <span className="sync-time">Sincronizado: {lastSync.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                        <div className="sync-countdown">
                            <div className="sync-progress" style={{ width: `${(countdown / (parseInt(import.meta.env.VITE_SYNC_INTERVAL_SECONDS) || 60)) * 10000 / 100}%` }}></div>
                            <span>Próxima en {countdown}s</span>
                        </div>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="refresh-btn" onClick={fetchData}>
                        <RefreshCw size={14} /> Actualizar
                    </button>
                    <button className={`vista-toggle${vistaSimple ? ' active' : ''}`} onClick={toggleVista}>
                        <Accessibility size={16} />
                        {vistaSimple ? 'Vista simplificada ✓' : 'Vista simplificada'}
                    </button>
                </div>
            </div>

            {loading && <p style={{ color: 'var(--text-muted)', textAlign: 'center', paddingTop: 40 }}>Cargando...</p>}

            {!loading && error && (
                <div style={{ color: 'var(--dy-red)', textAlign: 'center', padding: 40 }}>
                    <ShieldOff size={40} style={{ opacity: 0.4, display: 'block', margin: '0 auto 12px' }} />
                    {error}
                </div>
            )}

            {!loading && !error && movimientos.length === 0 && (
                <div className="empty-state">
                    <CheckCircle size={56} />
                    <p style={{ fontWeight: 700, fontSize: vistaSimple ? '1.3rem' : '1.1rem' }}>Sin movimientos pendientes</p>
                    <p style={{ fontSize: vistaSimple ? '1rem' : '0.85rem' }}>No hay autorizaciones pendientes para hoy en este punto de control.</p>
                </div>
            )}

            {!loading && !error && movimientos.map(mov =>
                vistaSimple ? (
                    <SimpleCard
                        key={mov.id}
                        mov={mov}
                        onCompleted={handleCompleted}
                        vigilador={vigilador}
                        setVigilador={setVigilador}
                        porteros={porteros}
                    />
                ) : (
                    <MovCard
                        key={mov.id}
                        mov={mov}
                        onCompleted={handleCompleted}
                        vigilador={vigilador}
                        setVigilador={setVigilador}
                        porteros={porteros}
                    />
                )
            )}

            <datalist id="porteros-list">
                {porteros.map(p => (
                    <option key={p.id} value={p.descripcion} />
                ))}
            </datalist>
        </div>
    );
}

export default PendientesDia;
