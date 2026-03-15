import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../config/AuthContext';
import { ChevronDown, ChevronUp, RefreshCw, CheckCircle, PackageOpen, FileText, ShieldOff, Clock, Accessibility, ShieldCheck, LogIn, LogOut, MapPin, User, Package, FileDigit } from 'lucide-react';
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
    const [success, setSuccess] = useState(false);
    const { user } = useAuth();
    const email = user?.email;

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
            setSuccess(true);
            setTimeout(() => onCompleted(mov.id), 450);
        } catch (e) {
            setError(e.response?.data?.error || 'Error al completar');
        } finally { setLoading(false); }
    };

    const totalItems = (mov.articulos?.length || 0) + (mov.documentos?.length || 0);
    const persona = mov.persona_interna_nombre || mov.idPersonaExterna || '—';

    return (
        <div className={`mov-card${open ? ' expanded' : ''}${success ? ' card-success' : ''}`}>
            <div className="mov-card-header" onClick={() => { if (!open) setHora(horaActual()); setOpen(o => !o); }}>
                <div className="mov-card-left">
                    <span className="mov-persona">{persona}</span>
                    <span className="mov-ruta">
                        {mov.origen_nombre}
                        <span className="arrow"> → </span>
                        {mov.destino_nombre}
                    </span>
                    <div className="mov-badges">
                        <span className={`badge badge-tipo ${mov.tipo_nombre?.toLowerCase().includes('ingreso') ? 'badge-ingreso' : mov.tipo_nombre?.toLowerCase().includes('egreso') ? 'badge-egreso' : ''}`}>
                            {mov.tipo_nombre?.toLowerCase().includes('ingreso') ? <LogIn size={11} style={{ marginRight: 3 }} /> : mov.tipo_nombre?.toLowerCase().includes('egreso') ? <LogOut size={11} style={{ marginRight: 3 }} /> : null}
                            {mov.tipo_nombre}
                        </span>
                        <span className="badge badge-motivo">{mov.motivo}</span>
                        {mov.idGrupo > 0 && <span className="badge badge-grupo">🔗 Paso {mov.ordenGrupo}/{mov.grupo_total} · {mov.grupo_completados} ✓</span>}
                        {mov.autorizante_nombre && (
                            <span className="badge badge-autorizante">
                                <ShieldCheck size={11} style={{ marginRight: 3 }} />
                                {mov.autorizante_nombre}
                            </span>
                        )}
                        {totalItems > 0 && <span className="badge badge-items">{totalItems} {totalItems === 1 ? 'ítem' : 'ítems'}</span>}
                    </div>
                </div>
                {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>

            {open && (
                <div className="mov-card-body">
                    {mov.articulos?.length > 0 && (
                        <div className="porteria-items-group">
                            <h4><Package size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Artículos</h4>
                            <div className="porteria-items-list">
                                {mov.articulos.map(a => (
                                    <div key={a.id} className="porteria-item-card">
                                        <div className="porteria-item-header">
                                            <span className="porteria-item-name">{a.descripcion}</span>
                                            <span className="porteria-item-qty">{a.cantidad} {a.presentacion || 'u.'}</span>
                                        </div>
                                        <div className="porteria-item-details">
                                            <span className="porteria-item-detail">
                                                <MapPin size={11} /> Destino: {mov.destino_nombre}
                                            </span>
                                            {a.destinatario && (
                                                <span className="porteria-item-detail">
                                                    <User size={11} /> Destinatario: {a.destinatario}
                                                </span>
                                            )}
                                            {a.sinRetorno === 1 ? (
                                                <span className="porteria-item-badge badge-sin-retorno">
                                                    Sin retorno
                                                </span>
                                            ) : (
                                                <span className="porteria-item-badge badge-con-retorno">
                                                    Con retorno
                                                </span>
                                            )}
                                        </div>
                                        {a.observacion && (
                                            <p className="porteria-item-obs">{a.observacion}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {mov.documentos?.length > 0 && (
                        <div className="porteria-items-group">
                            <h4><FileDigit size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Documentos</h4>
                            <div className="porteria-items-list">
                                {mov.documentos.map(d => (
                                    <div key={d.id} className="porteria-item-card">
                                        <div className="porteria-item-header">
                                            <span className="porteria-item-name">{d.tipo ? `${d.tipo.toUpperCase()} ${d.descripcion}` : d.descripcion}</span>
                                            <span className="porteria-item-qty">{d.cantidad} doc.</span>
                                        </div>
                                        <div className="porteria-item-details">
                                            <span className="porteria-item-detail">
                                                <MapPin size={11} /> Destino: {mov.destino_nombre}
                                            </span>
                                            {d.destinatario && (
                                                <span className="porteria-item-detail">
                                                    <User size={11} /> Destinatario: {d.destinatario}
                                                </span>
                                            )}
                                            {d.sinRetorno === 1 ? (
                                                <span className="porteria-item-badge badge-sin-retorno">
                                                    Sin retorno
                                                </span>
                                            ) : (
                                                <span className="porteria-item-badge badge-con-retorno">
                                                    Con retorno
                                                </span>
                                            )}
                                        </div>
                                        {d.observacion && (
                                            <p className="porteria-item-obs">{d.observacion}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
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
                            <label>Observación (opcional)</label>
                            <textarea placeholder="Escribí una observación si es necesario..." value={obs} onChange={e => setObs(e.target.value)} />
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', flexWrap: 'wrap' }}>
                            <button className="btn-completar" onClick={handleComplete} disabled={loading} style={{ flex: '1 1 auto', minWidth: '180px' }}>
                                <CheckCircle size={18} />{loading ? 'Completando...' : 'Completar paso'}
                            </button>
                            {mov.motivo?.toLowerCase() !== 'requerimiento laboral' && (
                                <div className="alert-fichaje">
                                    <Accessibility size={16} />
                                    <span className="text-desktop">Requiere fichaje</span>
                                    <span className="text-mobile">CON FICHAJE</span>
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
    const [success, setSuccess] = useState(false);
    const { user } = useAuth();
    const email = user?.email;

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
            setSuccess(true);
            setTimeout(() => onCompleted(mov.id), 450);
        } catch (e) {
            setError(e.response?.data?.error || 'Error al completar');
        } finally { setLoading(false); }
    };

    const persona = mov.persona_interna_nombre || mov.idPersonaExterna || '—';
    const totalItems = (mov.articulos?.length || 0) + (mov.documentos?.length || 0);

    return (
        <div className={`simple-card${open ? ' expanded' : ''}${success ? ' card-success' : ''}`}>
            <div className="simple-card-header" onClick={() => { if (!open) setHora(horaActual()); setOpen(o => !o); }}>
                <div className="simple-persona">{persona}</div>
                <div className="simple-ruta">
                    {mov.origen_nombre}
                    <span className="arrow">→</span>
                    {mov.destino_nombre}
                </div>
                <div className="simple-tipo">
                    <span className={`simple-badge-tipo ${mov.tipo_nombre?.toLowerCase().includes('ingreso') ? 'text-ingreso' : mov.tipo_nombre?.toLowerCase().includes('egreso') ? 'text-egreso' : ''}`}>
                        {mov.tipo_nombre?.toLowerCase().includes('ingreso') ? <LogIn size={15} style={{ verticalAlign: 'middle', marginRight: 4 }} /> : mov.tipo_nombre?.toLowerCase().includes('egreso') ? <LogOut size={15} style={{ verticalAlign: 'middle', marginRight: 4 }} /> : null}
                        <strong style={{ verticalAlign: 'middle' }}>{mov.tipo_nombre?.toUpperCase()}</strong>
                    </span>
                    <span style={{ verticalAlign: 'middle' }}>{' · '}<strong>{mov.motivo}</strong>{totalItems > 0 ? ` · ${totalItems} ítem(s)` : ''}</span>
                    {mov.autorizante_nombre && (
                        <> · <span title="Autorizado por"><ShieldCheck size={13} style={{ verticalAlign: 'middle', margin: '0 2px 0 4px' }} />{mov.autorizante_nombre}</span></>
                    )}
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
                        <div className="porteria-items-group">
                            <h4><Package size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Artículos</h4>
                            <div className="porteria-items-list">
                                {mov.articulos.map(a => (
                                    <div key={a.id} className="porteria-item-card">
                                        <div className="porteria-item-header">
                                            <span className="porteria-item-name">{a.descripcion}</span>
                                            <span className="porteria-item-qty">{a.cantidad} {a.presentacion || 'u.'}</span>
                                        </div>
                                        <div className="porteria-item-details">
                                            <span className="porteria-item-detail">
                                                <MapPin size={11} /> Destino: {mov.destino_nombre}
                                            </span>
                                            {a.destinatario && (
                                                <span className="porteria-item-detail">
                                                    <User size={11} /> Destinatario: {a.destinatario}
                                                </span>
                                            )}
                                            {a.sinRetorno === 1 ? (
                                                <span className="porteria-item-badge badge-sin-retorno">
                                                    Sin retorno
                                                </span>
                                            ) : (
                                                <span className="porteria-item-badge badge-con-retorno">
                                                    Con retorno
                                                </span>
                                            )}
                                        </div>
                                        {a.observacion && (
                                            <p className="porteria-item-obs">{a.observacion}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {mov.documentos?.length > 0 && (
                        <div className="porteria-items-group">
                            <h4><FileDigit size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Documentos</h4>
                            <div className="porteria-items-list">
                                {mov.documentos.map(d => (
                                    <div key={d.id} className="porteria-item-card">
                                        <div className="porteria-item-header">
                                            <span className="porteria-item-name">{d.tipo ? `${d.tipo.toUpperCase()} ${d.descripcion}` : d.descripcion}</span>
                                            <span className="porteria-item-qty">{d.cantidad} doc.</span>
                                        </div>
                                        <div className="porteria-item-details">
                                            <span className="porteria-item-detail">
                                                <MapPin size={11} /> Destino: {mov.destino_nombre}
                                            </span>
                                            {d.destinatario && (
                                                <span className="porteria-item-detail">
                                                    <User size={11} /> Destinatario: {d.destinatario}
                                                </span>
                                            )}
                                            {d.sinRetorno === 1 ? (
                                                <span className="porteria-item-badge badge-sin-retorno">
                                                    Sin retorno
                                                </span>
                                            ) : (
                                                <span className="porteria-item-badge badge-con-retorno">
                                                    Con retorno
                                                </span>
                                            )}
                                        </div>
                                        {d.observacion && (
                                            <p className="porteria-item-obs">{d.observacion}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                            <button className="btn-completar-simple" onClick={handleComplete} disabled={loading} style={{ flex: '1 1 auto', minWidth: '200px' }}>
                                <CheckCircle size={26} />{loading ? 'Completando...' : 'COMPLETAR'}
                            </button>
                            {mov.motivo?.toLowerCase() !== 'requerimiento laboral' && (
                                <div className="alert-fichaje simple">
                                    <Accessibility size={24} />
                                    <span className="text-desktop">REQUIERE FICHAJE</span>
                                    <span className="text-mobile">CON FICHAJE</span>
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
    const { user } = useAuth();
    const email = user?.email;

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

    useEffect(() => {
        const handleQRSuccess = () => {
            fetchData(true);
        };
        window.addEventListener('qr-scan-success', handleQRSuccess);
        return () => window.removeEventListener('qr-scan-success', handleQRSuccess);
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
