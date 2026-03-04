import React, { useState, useEffect, useCallback } from 'react';
import { useMsal } from '@azure/msal-react';
import { MovementsService } from '../services/api';
import { Button } from '../components/Button';
import Modal from '../components/Modal';
import {
    Clock, CheckCircle, XCircle, AlertCircle, RefreshCw,
    ChevronDown, ChevronUp, Check, X, User, MapPin, Calendar,
    FileText, ChevronLeft, ChevronRight, AlertTriangle
} from 'lucide-react';
import './MisSolicitudes.css';

const ESTADO_PENDIENTE = 1;
const ESTADO_COMPLETADO = 2;
const ESTADO_VENCIDO = 3;
const ESTADO_SOLICITADO = 4;
const ESTADO_RECHAZADO = 5;
const ESTADO_ANULADO = 6;

// Extrae la fecha YYYY-MM-DD del campo datetime sin conversión de timezone
const extraerFechaStr = (fechaHoraRegistro) => {
    if (!fechaHoraRegistro) return null;
    // Si viene como Date object de mysql2, toISOString puede restar horas → usamos el string directamente
    return String(fechaHoraRegistro).substring(0, 10); // "YYYY-MM-DD"
};

// Detecta si un movimiento Pendiente cuya fecha ya pasó (vencida visualmente)
const esVencidaVisual = (mov) => {
    if (mov.idEstado !== ESTADO_PENDIENTE) return false;
    const movDateStr = extraerFechaStr(mov.fechaHoraRegistro);
    if (!movDateStr) return false;
    // Comparar strings YYYY-MM-DD directamente, sin pasar por Date() para evitar timezone
    const todayStr = new Date().toLocaleDateString('en-CA'); // siempre "YYYY-MM-DD"
    return movDateStr < todayStr;
};

const estadoConfig = {
    [ESTADO_SOLICITADO]: { label: 'Solicitado', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', icon: <Clock size={14} /> },
    [ESTADO_PENDIENTE]: { label: 'Pendiente', color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', icon: <AlertCircle size={14} /> },
    [ESTADO_COMPLETADO]: { label: 'Completado', color: '#22c55e', bg: 'rgba(34,197,94,0.12)', icon: <CheckCircle size={14} /> },
    [ESTADO_VENCIDO]: { label: 'Vencido', color: '#6b7280', bg: 'rgba(107,114,128,0.12)', icon: <XCircle size={14} /> },
    [ESTADO_RECHAZADO]: { label: 'Rechazado', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', icon: <XCircle size={14} /> },
    [ESTADO_ANULADO]: { label: 'Anulado', color: '#a855f7', bg: 'rgba(168,85,247,0.12)', icon: <XCircle size={14} /> },
};

const VENCIDA_VISUAL_CONFIG = { label: 'Vencida', color: '#f97316', bg: 'rgba(249,115,22,0.12)', icon: <AlertTriangle size={14} /> };

const EstadoBadge = ({ mov }) => {
    const vencida = esVencidaVisual(mov);
    const cfg = vencida ? VENCIDA_VISUAL_CONFIG : (estadoConfig[mov.idEstado] || { label: 'Desconocido', color: '#6b7280', bg: 'rgba(0,0,0,0.1)', icon: null });
    return (
        <span className="estado-badge" style={{ color: cfg.color, background: cfg.bg }}>
            {cfg.icon} {cfg.label}
        </span>
    );
};

const GrupoBadge = ({ mov }) => {
    const total = mov.grupo_total || 0;
    if (total <= 1) return null; // singleton, sin grupo
    const completados = mov.grupo_completados || 0;
    const orden = mov.ordenGrupo || 1;
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            fontSize: '0.72rem', fontWeight: '600', padding: '2px 8px',
            borderRadius: '20px', backgroundColor: 'rgba(99,102,241,0.1)',
            color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)',
            whiteSpace: 'nowrap'
        }}>
            🔗 Paso {orden}/{total}{completados > 0 ? ` · ${completados} ✓` : ''}
        </span>
    );
};

const MovimientoCard = ({ mov, esAutorizador, onApprove, onReject, onCancel }) => {
    const [expanded, setExpanded] = useState(false);
    const isPendingMyAuth = esAutorizador && mov.idEstado === ESTADO_SOLICITADO;
    const isPendingCancel = esAutorizador && mov.idEstado === ESTADO_PENDIENTE;
    const vencida = esVencidaVisual(mov);

    // Extraer la fecha como string para evitar conversión UTC → local que resta un día
    const fechaStr = extraerFechaStr(mov.fechaHoraRegistro);
    const fecha = fechaStr
        ? fechaStr.split('-').reverse().join('/') // "YYYY-MM-DD" → "DD/MM/YYYY"
        : '-';

    return (
        <div className={`solicitud-card glass ${isPendingMyAuth ? 'solicitud-card--needs-action' : ''} ${vencida ? 'solicitud-card--vencida' : ''}`}>
            <div className="solicitud-card__header" onClick={() => setExpanded(!expanded)}>
                <div className="solicitud-card__header-left">
                    <span className="solicitud-card__id">#{mov.id}</span>
                    <EstadoBadge mov={mov} />
                    <GrupoBadge mov={mov} />
                    {isPendingMyAuth && (
                        <span className="solicitud-card__action-needed">Requiere tu acción</span>
                    )}
                </div>
                <div className="solicitud-card__header-right">
                    <span className="solicitud-card__tipo">{mov.tipo_nombre}</span>
                    <button className="solicitud-card__expand-btn">
                        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                </div>
            </div>

            <div className="solicitud-card__summary">
                <div className="solicitud-card__meta">
                    <span><User size={13} /> {mov.persona_interna_nombre || mov.personaInterna}</span>
                    <span><MapPin size={13} /> {mov.origen_nombre} → {mov.destino_nombre}</span>
                    <span><Calendar size={13} /> {fecha}</span>
                </div>
            </div>

            {expanded && (
                <div className="solicitud-card__body">
                    <div className="solicitud-card__detail-grid">
                        <div className="solicitud-card__detail-item">
                            <span className="solicitud-card__detail-label">Motivo</span>
                            <span className="solicitud-card__detail-value">{mov.motivo}</span>
                        </div>
                        <div className="solicitud-card__detail-item">
                            <span className="solicitud-card__detail-label">Con Retorno</span>
                            <span className="solicitud-card__detail-value">{mov.conRegreso ? 'Sí' : 'No'}</span>
                        </div>
                        {mov.destinoDetalle && (
                            <div className="solicitud-card__detail-item">
                                <span className="solicitud-card__detail-label">Detalle destino</span>
                                <span className="solicitud-card__detail-value">{mov.destinoDetalle}</span>
                            </div>
                        )}
                        <div className="solicitud-card__detail-item">
                            <span className="solicitud-card__detail-label">Autorizante</span>
                            <span className="solicitud-card__detail-value">{mov.autorizante_nombre || mov.personaAutorizante || '-'}</span>
                        </div>
                        {mov.vigilador && (
                            <div className="solicitud-card__detail-item">
                                <span className="solicitud-card__detail-label">Vigilador</span>
                                <span className="solicitud-card__detail-value">{mov.vigilador}</span>
                            </div>
                        )}
                    </div>
                    {mov.observacion && (
                        <div className="solicitud-card__observacion">
                            <FileText size={13} />
                            <span>{mov.observacion}</span>
                        </div>
                    )}

                    {isPendingMyAuth && (
                        <div className="solicitud-card__actions">
                            <Button variant="primary" size="sm" type="button" onClick={() => onApprove(mov)}>
                                <Check size={16} /> Aprobar
                            </Button>
                            <Button variant="ghost" size="sm" type="button"
                                style={{ color: 'var(--error)', border: '1px solid var(--error)' }}
                                onClick={() => onReject(mov)}>
                                <X size={16} /> Rechazar
                            </Button>
                        </div>
                    )}
                    {isPendingCancel && (
                        <div className="solicitud-card__actions">
                            <Button variant="ghost" size="sm" type="button"
                                style={{ color: '#a855f7', border: '1px solid #a855f7' }}
                                onClick={() => onCancel(mov)}>
                                <X size={16} /> Anular
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Componente de paginación
const Pagination = ({ pagination, onPageChange }) => {
    if (!pagination || pagination.totalPages <= 1) return null;
    const { page, totalPages, total, pageSize } = pagination;

    const desde = (page - 1) * pageSize + 1;
    const hasta = Math.min(page * pageSize, total);

    // Generar páginas visibles: siempre mostrar primera, ultima, y las cercanas a la actual
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
            pages.push(i);
        } else if (pages[pages.length - 1] !== '...') {
            pages.push('...');
        }
    }

    return (
        <div className="pagination">
            <span className="pagination__info">{desde}–{hasta} de {total}</span>
            <div className="pagination__controls">
                <button
                    className="pagination__btn"
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                    title="Página anterior"
                >
                    <ChevronLeft size={16} />
                </button>

                {pages.map((p, i) => (
                    p === '...'
                        ? <span key={`ellipsis-${i}`} className="pagination__ellipsis">…</span>
                        : <button
                            key={p}
                            className={`pagination__btn ${p === page ? 'active' : ''}`}
                            onClick={() => onPageChange(p)}
                        >
                            {p}
                        </button>
                ))}

                <button
                    className="pagination__btn"
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                    title="Página siguiente"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

const MisSolicitudes = () => {
    const { accounts } = useMsal();
    const currentUser = accounts[0] || {};
    const email = currentUser.username || currentUser.email || '';

    const [data, setData] = useState({ movements: [], esAutorizador: false, pendingActionCount: 0, pagination: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filtro, setFiltro] = useState('todos');
    const [page, setPage] = useState(1);

    const [rejectModal, setRejectModal] = useState({ open: false, mov: null, observacion: '' });
    const [cancelModal, setCancelModal] = useState({ open: false, mov: null, observacion: '' });
    const [approveModal, setApproveModal] = useState({ open: false, mov: null });
    const [actionLoading, setActionLoading] = useState(false);
    const [actionResult, setActionResult] = useState(null);

    const fetchData = useCallback(async (currentPage, currentFiltro) => {
        setLoading(true);
        setError(null);
        try {
            const res = await MovementsService.getMisSolicitudes(email, currentPage, currentFiltro);
            setData(res.data);
        } catch (err) {
            setError('No se pudieron cargar las solicitudes. Intente nuevamente.');
        } finally {
            setLoading(false);
        }
    }, [email]);

    useEffect(() => {
        if (email) fetchData(page, filtro);
    }, [fetchData, email, page, filtro]);

    const handleFiltroChange = (nuevoFiltro) => {
        setFiltro(nuevoFiltro);
        setPage(1); // resetear a primera página al cambiar filtro
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleApprove = async () => {
        setActionLoading(true);
        try {
            await MovementsService.approve(approveModal.mov.id, email);
            setApproveModal({ open: false, mov: null });
            setActionResult({ type: 'success', message: 'Movimiento aprobado correctamente.' });
            fetchData(page, filtro);
        } catch (err) {
            setActionResult({ type: 'error', message: err.response?.data?.error || 'Error al aprobar el movimiento.' });
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        setActionLoading(true);
        try {
            await MovementsService.reject(rejectModal.mov.id, email, rejectModal.observacion);
            setRejectModal({ open: false, mov: null, observacion: '' });
            setActionResult({ type: 'success', message: 'Movimiento rechazado.' });
            fetchData(page, filtro);
        } catch (err) {
            setActionResult({ type: 'error', message: err.response?.data?.error || 'Error al rechazar el movimiento.' });
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancel = async () => {
        setActionLoading(true);
        try {
            await MovementsService.cancel(cancelModal.mov.id, email, cancelModal.observacion);
            setCancelModal({ open: false, mov: null, observacion: '' });
            setActionResult({ type: 'success', message: 'Movimiento anulado correctamente.' });
            fetchData(page, filtro);
        } catch (err) {
            setActionResult({ type: 'error', message: err.response?.data?.error || 'Error al anular el movimiento.' });
        } finally {
            setActionLoading(false);
        }
    };

    const pendingActionCount = data.pendingActionCount || 0;

    const filtros = [
        { key: 'todos', label: 'Todos' },
        ...(data.esAutorizador ? [{ key: 'accion', label: `Requieren acción${pendingActionCount > 0 ? ` (${pendingActionCount})` : ''}` }] : []),
        { key: 'solicitado', label: 'Solicitados' },
        { key: 'pendiente', label: 'Pendientes' },
        { key: 'completado', label: 'Completados' },
        { key: 'rechazado', label: 'Rechazados' },
        { key: 'anulado', label: 'Anulados' },
    ];

    return (
        <div className="mis-solicitudes card-anim" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <header style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                        <h1 style={{ fontSize: '2.2rem', fontWeight: '900', color: 'var(--primary)' }}>
                            Mis Solicitudes<span style={{ color: 'var(--dy-red)' }}>.</span>
                        </h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '4px' }}>
                            {data.esAutorizador
                                ? 'Gestionás tus solicitudes y las que requieren tu autorización.'
                                : 'Seguí el estado de tus solicitudes de movimiento.'}
                        </p>
                    </div>
                    <Button variant="secondary" size="sm" type="button"
                        onClick={() => fetchData(page, filtro)} disabled={loading}>
                        <RefreshCw size={16} /> Actualizar
                    </Button>
                </div>

                {data.esAutorizador && pendingActionCount > 0 && (
                    <div className="mis-solicitudes__alert">
                        <AlertCircle size={18} />
                        <span>Tenés <strong>{pendingActionCount}</strong> solicitud{pendingActionCount > 1 ? 'es' : ''} esperando tu autorización.</span>
                    </div>
                )}
            </header>

            {error && (
                <div className="mis-solicitudes__error glass">
                    <XCircle size={20} /> {error}
                </div>
            )}

            {actionResult && (
                <div className={`mis-solicitudes__alert ${actionResult.type === 'error' ? 'mis-solicitudes__alert--error' : ''}`}
                    style={{ marginBottom: '16px' }}>
                    {actionResult.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                    <span>{actionResult.message}</span>
                    <button onClick={() => setActionResult(null)}
                        style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Filtros */}
            <div className="mis-solicitudes__filtros">
                {filtros.map(f => (
                    <button
                        key={f.key}
                        className={`mis-solicitudes__filtro-btn ${filtro === f.key ? 'active' : ''}`}
                        onClick={() => handleFiltroChange(f.key)}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Lista */}
            {loading ? (
                <div className="mis-solicitudes__empty glass">
                    <svg className="spinner" viewBox="0 0 50 50" style={{ width: '36px', height: '36px', opacity: 0.5 }}>
                        <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                    </svg>
                    <p>Cargando...</p>
                </div>
            ) : data.movements.length === 0 ? (
                <div className="mis-solicitudes__empty glass">
                    <Clock size={40} style={{ opacity: 0.3 }} />
                    <p>No hay solicitudes en esta categoría.</p>
                </div>
            ) : (
                <>
                    <div className="mis-solicitudes__lista">
                        {data.movements.map(mov => (
                            <MovimientoCard
                                key={mov.id}
                                mov={mov}
                                esAutorizador={data.esAutorizador}
                                onApprove={(m) => setApproveModal({ open: true, mov: m })}
                                onReject={(m) => setRejectModal({ open: true, mov: m, observacion: '' })}
                                onCancel={(m) => setCancelModal({ open: true, mov: m, observacion: '' })}
                            />
                        ))}
                    </div>

                    <Pagination
                        pagination={data.pagination}
                        onPageChange={handlePageChange}
                    />
                </>
            )}

            {/* Modal Aprobar */}
            <Modal
                isOpen={approveModal.open}
                onClose={() => !actionLoading && setApproveModal({ open: false, mov: null })}
                title="Aprobar movimiento"
                type="success"
                message={
                    <div>
                        <p>¿Confirmás la aprobación del movimiento <strong>#{approveModal.mov?.id}</strong>?</p>
                        <p style={{ marginTop: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            El movimiento pasará al estado <strong>Pendiente</strong> y podrá ser ejecutado por el personal de seguridad.
                        </p>
                        {approveModal.mov?.conRegreso === 1 && (
                            <p style={{ marginTop: '8px', color: '#818cf8', fontSize: '0.85rem', fontWeight: '500' }}>
                                🔗 Al tratarse de un movimiento con retorno, se generará automáticamente la serie completa de movimientos encadenados, todos en estado Pendiente.
                            </p>
                        )}
                    </div>
                }
                confirmLabel={actionLoading ? 'Aprobando...' : 'Confirmar'}
                cancelLabel="Cancelar"
                onConfirm={handleApprove}
                onCancel={() => setApproveModal({ open: false, mov: null })}
            />

            {/* Modal Rechazar */}
            <Modal
                isOpen={rejectModal.open}
                onClose={() => !actionLoading && setRejectModal({ open: false, mov: null, observacion: '' })}
                title="Rechazar movimiento"
                type="error"
                message={
                    <div>
                        <p>¿Confirmás el rechazo del movimiento <strong>#{rejectModal.mov?.id}</strong>?</p>
                        <div style={{ marginTop: '16px' }}>
                            <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                                Motivo del rechazo (opcional)
                            </label>
                            <textarea
                                value={rejectModal.observacion}
                                onChange={(e) => setRejectModal(prev => ({ ...prev, observacion: e.target.value }))}
                                placeholder="Ingresá el motivo del rechazo..."
                                maxLength={300}
                                style={{
                                    width: '100%', minHeight: '80px', padding: '10px',
                                    backgroundColor: 'var(--surface)', border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius)', color: 'var(--text)',
                                    fontSize: '0.9rem', resize: 'vertical', outline: 'none'
                                }}
                            />
                        </div>
                    </div>
                }
                confirmLabel={actionLoading ? 'Rechazando...' : 'Rechazar'}
                cancelLabel="Cancelar"
                onConfirm={handleReject}
                onCancel={() => setRejectModal({ open: false, mov: null, observacion: '' })}
            />

            {/* Modal Anular */}
            <Modal
                isOpen={cancelModal.open}
                onClose={() => !actionLoading && setCancelModal({ open: false, mov: null, observacion: '' })}
                title="Anular movimiento"
                type="error"
                message={
                    <div>
                        <p>¿Confirmás la anulación del movimiento <strong>#{cancelModal.mov?.id}</strong>?</p>
                        <p style={{ marginTop: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            Esta acción dejará el movimiento en estado <strong>Anulado</strong>. No podrá revertirse.
                        </p>
                        {(cancelModal.mov?.grupo_total || 0) > 1 && (
                            <p style={{ marginTop: '8px', color: '#818cf8', fontSize: '0.85rem', fontWeight: '500' }}>
                                🔗 Este movimiento forma parte de una serie de {cancelModal.mov.grupo_total} pasos. Todos los pasos activos de la serie serán anulados.
                            </p>
                        )}
                        <div style={{ marginTop: '16px' }}>
                            <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500', display: 'block', marginBottom: '8px' }}>
                                Motivo de anulación (opcional)
                            </label>
                            <textarea
                                value={cancelModal.observacion}
                                onChange={(e) => setCancelModal(prev => ({ ...prev, observacion: e.target.value }))}
                                placeholder="Ingresá el motivo de la anulación..."
                                maxLength={300}
                                style={{
                                    width: '100%', minHeight: '80px', padding: '10px',
                                    backgroundColor: 'var(--surface)', border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius)', color: 'var(--text)',
                                    fontSize: '0.9rem', resize: 'vertical', outline: 'none'
                                }}
                            />
                        </div>
                    </div>
                }
                confirmLabel={actionLoading ? 'Anulando...' : 'Anular'}
                cancelLabel="Cancelar"
                onConfirm={handleCancel}
                onCancel={() => setCancelModal({ open: false, mov: null, observacion: '' })}
            />
        </div>
    );
};

export default MisSolicitudes;
