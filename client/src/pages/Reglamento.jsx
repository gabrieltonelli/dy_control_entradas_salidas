import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { BookOpen, AlertCircle, Clock, Search } from 'lucide-react';
import { Card } from '../components/FormElements';
import './Reglamento.css';

const Reglamento = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchSheet = async () => {
            try {
                // El URL viene de variable de entorno configurado como export?format=csv
                const sheetUrl = import.meta.env.VITE_REGLAMENTO_SHEET_URL;
                console.log('Cargando reglamento desde:', sheetUrl);

                if (!sheetUrl) {
                    throw new Error('La URL del reglamento no está configurada.');
                }

                // Usamos responseType text para asegurar compatibilidad con CSV de Google
                const response = await axios.get(sheetUrl, {
                    responseType: 'text',
                    headers: { 'Cache-Control': 'no-cache' }
                });

                if (!response.data) {
                    throw new Error('La respuesta del servidor está vacía.');
                }

                // Leer el CSV usando la librería XLSX
                const workbook = XLSX.read(response.data, { type: 'string' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                console.log('Datos procesados:', jsonData);
                setData(jsonData);
            } catch (err) {
                console.error('Error al cargar la hoja de Google:', err);
                setError('No se pudo cargar el reglamento. Verifica la conexión o la configuración de la URL.');
            } finally {
                setLoading(false);
            }
        };

        fetchSheet();
    }, []);

    // Filtro flexible que busca en varios campos
    const filteredData = data.filter(item => {
        if (!item) return false;
        const searchStr = filter.toLowerCase();
        const resNum = String(item['Resolución #'] || '').toLowerCase();
        const titulo = String(item.Título || '').toLowerCase();
        const desc = String(item.Descripción || '').toLowerCase();

        return resNum.includes(searchStr) ||
            titulo.includes(searchStr) ||
            desc.includes(searchStr);
    });

    // Auxiliar para formatear la fecha de vigencia (maneja strings y números seriales de Excel)
    const formatVigencia = (val) => {
        if (!val) return 'No especificada';

        // Si es un número (serial de Excel/Google Sheets)
        if (typeof val === 'number') {
            // Excel empieza en 1/1/1900. Ajustamos por el offset de JS (1/1/1970)
            const date = new Date(Math.round((val - 25569) * 86400 * 1000));
            return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        }

        // Si ya es un string, lo devolvemos tal cual
        return String(val);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner-large"></div>
                <p>Sincronizando con el servidor de normativas...</p>
            </div>
        );
    }

    return (
        <div className="reglamento-container card-anim">
            <header className="page-header">
                <div className="header-icon-box">
                    <BookOpen size={32} />
                </div>
                <h1 className="page-title">Reglamento Normativo<span className="dot">.</span></h1>
                <p className="page-subtitle">Marco regulatorio y disposiciones vigentes del sistema CIE.</p>
            </header>

            <div className="search-bar-container">
                <div className="search-input-wrapper">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar por resolución, título o palabra clave..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            {error && (
                <div className="error-message">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            <div className="reglamento-list">
                {filteredData.map((item, index) => (
                    <Card key={index} className="reglamento-card">
                        <div className="reglamento-card-header">
                            <span className="resolution-number">Resolución #{item['Resolución #']}</span>
                            {item.Estado && (
                                <span className={`status-badge ${String(item.Estado).toLowerCase().trim()}`}>
                                    {item.Estado}
                                </span>
                            )}
                        </div>
                        <h3 className="reglamento-title">{item.Título}</h3>
                        <p className="reglamento-description">{item.Descripción}</p>
                        <div className="reglamento-footer">
                            <span className="vigencia">
                                <Clock size={14} />
                                Vigencia: {formatVigencia(item['Fecha Vigencia'] || item['Fecha Vigencias'])}
                            </span>
                        </div>
                    </Card>
                ))}

                {!loading && data.length > 0 && filteredData.length === 0 && (
                    <div className="no-results glass">
                        <p>No se encontraron normativas que coincidan con "<strong>{filter}</strong>"</p>
                        <button onClick={() => setFilter('')} className="btn-clear-search">Limpiar búsqueda</button>
                    </div>
                )}

                {!loading && data.length === 0 && !error && (
                    <div className="no-data-message glass" style={{ padding: '40px', borderRadius: '20px' }}>
                        <BookOpen size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
                        <p>El reglamento está vacío o la hoja de cálculo no tiene registros válidos.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reglamento;
