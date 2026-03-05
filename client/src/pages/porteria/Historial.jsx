import React, { useState, useCallback } from 'react';
import { useMsal } from '@azure/msal-react';
import { Download, Search } from 'lucide-react';
import * as XLSX from 'xlsx';
import { getHistorial } from '../../services/porteriaService';
import './Historial.css';

const ESTADOS = [
    { value: 'todos', label: 'Todos' },
    { value: '1', label: 'Pendiente' },
    { value: '2', label: 'Completado' },
    { value: '3', label: 'Vencido' },
    { value: '4', label: 'Solicitado' },
    { value: '5', label: 'Rechazado' },
    { value: '6', label: 'Anulado' },
];

const ESTADO_COLORS = {
    'Pendiente': { bg: 'rgba(99,102,241,0.15)', color: '#818cf8' },
    'Completado': { bg: 'rgba(16,185,129,0.15)', color: '#10b981' },
    'Vencido': { bg: 'rgba(107,114,128,0.15)', color: '#9ca3af' },
    'Solicitado': { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
    'Rechazado': { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' },
    'Anulado': { bg: 'rgba(139,92,246,0.15)', color: '#a78bfa' },
};

function formatFecha(str) {
    if (!str) return '—';
    const d = new Date(str);
    return d.toLocaleString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function Historial({ porteria }) {
    const { accounts } = useMsal();
    const email = accounts[0]?.username;

    const today = new Date().toISOString().slice(0, 10);
    const [desde, setDesde] = useState(today);
    const [hasta, setHasta] = useState(today);
    const [estado, setEstado] = useState('2'); // Completados por defecto
    const [page, setPage] = useState(1);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState('');

    const fetchData = useCallback(async (p = 1) => {
        setLoading(true);
        setError('');
        try {
            const res = await getHistorial(email, { desde, hasta, estado, page: p });
            setData(res.data);
            setPage(p);
        } catch (e) {
            setError(e.response?.data?.error || 'Error al cargar el historial');
        } finally {
            setLoading(false);
        }
    }, [email, desde, hasta, estado]);

    const handleSearch = () => fetchData(1);

    // Exportar a Excel con TODOS los registros de los filtros actuales
    const handleExport = async () => {
        setExporting(true);
        try {
            // Traer todos los registros del filtro (página por página)
            let allRows = [];
            let p = 1, totalPages = 1;
            do {
                const res = await getHistorial(email, { desde, hasta, estado, page: p });
                allRows = [...allRows, ...res.data.movements];
                totalPages = res.data.pagination.totalPages;
                p++;
            } while (p <= totalPages);

            const rows = allRows.map(m => ({
                'ID': m.id,
                'Fecha': formatFecha(m.fechaHoraRegistro),
                'Tipo': m.tipo_nombre,
                'Persona': m.persona_interna_nombre || m.idPersonaExterna || '',
                'Origen': m.origen_nombre,
                'Destino': m.destino_nombre,
                'Estado': m.estado_nombre,
                'Autorizante': m.autorizante_nombre || '',
                'Motivo': m.motivo || '',
                'Observación': m.observacion || '',
                'Obs. Portería': m.observacionPorteria || '',
                'Hora completado': formatFecha(m.fechaHoraCompletado),
            }));

            const ws = XLSX.utils.json_to_sheet(rows);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Historial');
            XLSX.writeFile(wb, `historial_porteria_${desde}_${hasta}.xlsx`);
        } catch (e) {
            alert('Error al exportar');
        } finally {
            setExporting(false);
        }
    };

    const movements = data?.movements || [];
    const pagination = data?.pagination;

    return (
        <div style={{ padding: '20px 16px', maxWidth: 1000, margin: '0 auto' }}>
            <div className="historial-header">
                <h1>Historial de movimientos</h1>
                <span className="subtitle">{porteria?.nombre}</span>
            </div>

            {/* Filtros */}
            <div className="filtros-bar">
                <div className="filtro-group">
                    <label>Desde</label>
                    <input type="date" value={desde} onChange={e => setDesde(e.target.value)} />
                </div>
                <div className="filtro-group">
                    <label>Hasta</label>
                    <input type="date" value={hasta} onChange={e => setHasta(e.target.value)} />
                </div>
                <div className="filtro-group">
                    <label>Estado</label>
                    <select value={estado} onChange={e => setEstado(e.target.value)}>
                        {ESTADOS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
                    </select>
                </div>
                <button className="btn-buscar" onClick={handleSearch} disabled={loading}>
                    <Search size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                    {loading ? 'Buscando...' : 'Buscar'}
                </button>
                <button className="btn-export" onClick={handleExport} disabled={exporting || !data || movements.length === 0}>
                    <Download size={14} />
                    {exporting ? 'Exportando...' : 'Exportar Excel'}
                </button>
            </div>

            {error && <p style={{ color: 'var(--dy-red)', marginBottom: 16 }}>{error}</p>}

            {/* Tabla */}
            {data && (
                <>
                    <div className="historial-table-wrap">
                        <table className="historial-table">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Persona</th>
                                    <th>Tipo</th>
                                    <th>Origen → Destino</th>
                                    <th>Estado</th>
                                    <th>Hora completado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {movements.length === 0 && (
                                    <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>Sin resultados</td></tr>
                                )}
                                {movements.map(m => {
                                    const colors = ESTADO_COLORS[m.estado_nombre] || {};
                                    return (
                                        <tr key={m.id}>
                                            <td style={{ whiteSpace: 'nowrap' }}>{formatFecha(m.fechaHoraRegistro)}</td>
                                            <td>{m.persona_interna_nombre || m.idPersonaExterna || '—'}</td>
                                            <td>{m.tipo_nombre}</td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{m.origen_nombre} → {m.destino_nombre}</td>
                                            <td>
                                                <span className="estado-badge" style={{ background: colors.bg, color: colors.color }}>
                                                    {m.estado_nombre}
                                                </span>
                                            </td>
                                            <td style={{ whiteSpace: 'nowrap' }}>{formatFecha(m.fechaHoraCompletado)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="pagination">
                            <button disabled={page <= 1} onClick={() => fetchData(page - 1)}>← Anterior</button>
                            <span>Pág. {pagination.page} / {pagination.totalPages} · {pagination.total} registros</span>
                            <button disabled={page >= pagination.totalPages} onClick={() => fetchData(page + 1)}>Siguiente →</button>
                        </div>
                    )}
                    {pagination && pagination.totalPages <= 1 && data && (
                        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 12 }}>
                            {pagination.total} {pagination.total === 1 ? 'registro' : 'registros'}
                        </p>
                    )}
                </>
            )}

            {!data && !loading && (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', paddingTop: 40 }}>
                    Seleccioná los filtros y presioná Buscar.
                </p>
            )}
        </div>
    );
}

export default Historial;
