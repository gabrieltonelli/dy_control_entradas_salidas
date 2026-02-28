import React, { useState, useEffect } from 'react';
import { MastersService, MovementsService } from '../services/api';
import { Card, Input, Select } from '../components/FormElements';
import { Button } from '../components/Button';
import { Plus, Trash2, Send } from 'lucide-react';

import { useMsal } from "@azure/msal-react";

const MovementForm = () => {
    const { accounts } = useMsal();
    const currentUser = accounts[0] || {};

    const [legajos, setLegajos] = useState([]);
    const [lugares, setLugares] = useState([]);
    const [types, setTypes] = useState([]);
    const [formData, setFormData] = useState({
        movement: {
            idTipo: '',
            personaInterna: '',
            idLugarOrigen: '',
            idLugarDestino: '',
            motivo: '',
            personaAutorizante: '',
            observacion: '',
            destinoDetalle: '',
            conRegreso: false,
            usuario_app: currentUser.username || currentUser.email || 'anonymous'
        },
        articles: [],
        documents: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [l, lug, t] = await Promise.all([
                    MastersService.getLegajos(),
                    MastersService.getLugares(),
                    MastersService.getMovementTypes()
                ]);
                setLegajos(l.data);
                setLugares(lug.data);
                setTypes(t.data);
            } catch (error) {
                console.error('Error fetching masters:', error);
            }
        };
        fetchData();
    }, []);

    const handleMovChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            movement: {
                ...prev.movement,
                [name]: type === 'checkbox' ? checked : value
            }
        }));
    };

    const addArticle = () => {
        setFormData(prev => ({
            ...prev,
            articles: [...prev.articles, { descripcion: '', cantidad: 1, idEstado: 1, sinRetorno: false }]
        }));
    };

    const removeArticle = (index) => {
        setFormData(prev => ({
            ...prev,
            articles: prev.articles.filter((_, i) => i !== index)
        }));
    };

    const handleArticleChange = (index, e) => {
        const { name, value, type, checked } = e.target;
        const newArticles = [...formData.articles];
        newArticles[index] = { ...newArticles[index], [name]: type === 'checkbox' ? checked : value };
        setFormData(prev => ({ ...prev, articles: newArticles }));
    };

    const addDocument = () => {
        setFormData(prev => ({
            ...prev,
            documents: [...prev.documents, { tipo: 'Remito', descripcion: '', cantidad: 1, sinRetorno: false }]
        }));
    };

    const removeDocument = (index) => {
        setFormData(prev => ({
            ...prev,
            documents: prev.documents.filter((_, i) => i !== index)
        }));
    };

    const handleDocumentChange = (index, e) => {
        const { name, value, type, checked } = e.target;
        const newDocs = [...formData.documents];
        newDocs[index] = { ...newDocs[index], [name]: type === 'checkbox' ? checked : value };
        setFormData(prev => ({ ...prev, documents: newDocs }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await MovementsService.create(formData);
            alert('Movimiento registrado con éxito');
            // Reset form or navigate
        } catch (error) {
            console.error('Error creating movement:', error);
            alert('Error: ' + error.message);
        }
    };

    return (
        <div className="card-anim" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <header style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2.4rem', fontWeight: '900', color: 'var(--dy-blue)' }}>
                    Nueva Solicitud<span style={{ color: 'var(--dy-red)' }}>.</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Complete los datos para autorizar un ingreso o egreso.</p>
            </header>

            <form onSubmit={handleSubmit}>
                <Card>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Datos Generales</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                        <Select
                            label="Tipo de Movimiento"
                            name="idTipo"
                            value={formData.movement.idTipo}
                            onChange={handleMovChange}
                            options={types.map(t => ({ id: t.id, label: t.nombre }))}
                            required
                        />
                        <Select
                            label="Motivo"
                            name="motivo"
                            value={formData.movement.motivo}
                            onChange={handleMovChange}
                            options={['Motivos personales', 'Requerimiento laboral', 'Accidente o razones médicas', 'Otros']}
                            required
                        />
                        <Select
                            label="Persona a Autorizar"
                            name="personaInterna"
                            value={formData.movement.personaInterna}
                            onChange={handleMovChange}
                            options={legajos.map(l => ({ id: l.legajo, label: l.apellido_nombre }))}
                            required
                        />
                    </div>
                </Card>

                <Card>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Ruta y Destino</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                        <Select
                            label="Origen"
                            name="idLugarOrigen"
                            value={formData.movement.idLugarOrigen}
                            onChange={handleMovChange}
                            options={lugares.map(l => ({ id: l.id, label: l.nombre }))}
                            required
                        />
                        <Select
                            label="Destino"
                            name="idLugarDestino"
                            value={formData.movement.idLugarDestino}
                            onChange={handleMovChange}
                            options={lugares.map(l => ({ id: l.id, label: l.nombre }))}
                            required
                        />
                        <Input
                            label="Detalle del Destino (si es Exteriores)"
                            name="destinoDetalle"
                            value={formData.movement.destinoDetalle}
                            onChange={handleMovChange}
                        />
                    </div>
                </Card>

                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '1.25rem' }}>Artículos / Herramientas</h2>
                        <Button variant="secondary" size="sm" type="button" onClick={addArticle}>
                            <Plus size={16} /> Agregar Artículo
                        </Button>
                    </div>
                    {formData.articles.map((art, index) => (
                        <div key={index} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 40px', gap: '12px', alignItems: 'end' }}>
                                <Input label="Descripción" name="descripcion" value={art.descripcion} onChange={(e) => handleArticleChange(index, e)} required />
                                <Input label="Cantidad" type="number" name="cantidad" value={art.cantidad} onChange={(e) => handleArticleChange(index, e)} required />
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px' }}>
                                    <input type="checkbox" name="sinRetorno" checked={art.sinRetorno} onChange={(e) => handleArticleChange(index, e)} />
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sin Retorno</label>
                                </div>
                                <Button variant="ghost" type="button" onClick={() => removeArticle(index)} style={{ padding: '8px', marginBottom: '12px' }}>
                                    <Trash2 size={18} color="var(--error)" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {formData.articles.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.875rem' }}>No hay artículos registrados.</p>}
                </Card>

                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '1.25rem' }}>Documentación</h2>
                        <Button variant="secondary" size="sm" type="button" onClick={addDocument}>
                            <Plus size={16} /> Agregar Documento
                        </Button>
                    </div>
                    {formData.documents.map((doc, index) => (
                        <div key={index} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '20px', marginBottom: '20px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 40px', gap: '12px', alignItems: 'end' }}>
                                <Select label="Tipo" name="tipo" value={doc.tipo} onChange={(e) => handleDocumentChange(index, e)} options={['Remito', 'Factura', 'Presupuesto', 'Orden de compra', 'Otros']} required />
                                <Input label="Observación" name="descripcion" value={doc.descripcion} onChange={(e) => handleDocumentChange(index, e)} />
                                <Button variant="ghost" type="button" onClick={() => removeDocument(index)} style={{ padding: '8px', marginBottom: '12px' }}>
                                    <Trash2 size={18} color="var(--error)" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {formData.documents.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.875rem' }}>No hay documentos registrados.</p>}
                </Card>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                    <Button variant="secondary" type="button">Cancelar</Button>
                    <Button variant="primary" type="submit" className="glass">
                        <Send size={18} /> Generar Solicitud
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default MovementForm;
