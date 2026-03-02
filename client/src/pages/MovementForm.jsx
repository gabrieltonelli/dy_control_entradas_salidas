import React, { useState, useEffect } from 'react';
import { MastersService, MovementsService } from '../services/api';
import { Card, Input, Select, Autocomplete, Switch, DatePicker, Textarea } from '../components/FormElements';
import { Button } from '../components/Button';
import { Plus, Trash2, Send } from 'lucide-react';

import { useMsal } from "@azure/msal-react";

const MovementForm = () => {
    const { accounts } = useMsal();
    const currentUser = accounts[0] || {};

    const today = new Date().toISOString().split('T')[0];
    const maxDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const capitalizeName = (str) => {
        if (!str) return '';
        return str.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    const getSavedValue = (key, defaultValue) => {
        return localStorage.getItem(`movementForm_${key}`) || defaultValue;
    };

    const dropdownKeys = ['idTipo', 'idLugarOrigen', 'idLugarDestino', 'motivo'];

    const [legajos, setLegajos] = useState([]);
    const [lugares, setLugares] = useState([]);
    const [types, setTypes] = useState([]);
    const [formData, setFormData] = useState({
        movement: {
            idTipo: getSavedValue('idTipo', '1'),
            personaInterna: '', // Siempre vacío al cargar
            fechaHoraRegistro: new Date().toISOString().split('T')[0], // Solo fecha para el input
            idLugarOrigen: getSavedValue('idLugarOrigen', ''),
            idLugarDestino: getSavedValue('idLugarDestino', ''),
            motivo: getSavedValue('motivo', ''),
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

                // Normalizar nombres de legajos (Capitalize)
                const normalizedLegajos = l.data.map(item => ({
                    ...item,
                    apellido_nombre: capitalizeName(item.apellido_nombre)
                }));

                setLegajos(normalizedLegajos);
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
        const val = type === 'checkbox' ? checked : value;

        if (dropdownKeys.includes(name)) {
            localStorage.setItem(`movementForm_${name}`, val);
        }

        setFormData(prev => ({
            ...prev,
            movement: {
                ...prev.movement,
                [name]: val
            }
        }));
    };

    const addArticle = () => {
        setFormData(prev => ({
            ...prev,
            articles: [...prev.articles, {
                descripcion: '',
                cantidad: 1,
                idEstado: 1,
                conRetorno: true,
                presentacion: 'Bulto(s)',
                idLugarDestino: prev.movement.idLugarDestino,
                destinatario: ''
            }]
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
            documents: [...prev.documents, {
                tipo: 'Remito',
                descripcion: '',
                cantidad: 1,
                conRetorno: true,
                idLugarDestino: prev.movement.idLugarDestino,
                destinatario: ''
            }]
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
            // Transform conRetorno (UI) back to sinRetorno (API expected)
            const submitData = {
                ...formData,
                articles: formData.articles.map(art => ({
                    ...art,
                    sinRetorno: !art.conRetorno
                })),
                documents: formData.documents.map(doc => ({
                    ...doc,
                    sinRetorno: !doc.conRetorno
                }))
            };

            await MovementsService.create(submitData);
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
                <h1 style={{ fontSize: '2.4rem', fontWeight: '900', color: 'var(--primary)' }}>
                    Nueva Solicitud<span style={{ color: 'var(--dy-red)' }}>.</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Complete los datos para autorizar un ingreso o egreso.</p>
            </header>

            <form onSubmit={handleSubmit}>
                <Card style={{ position: 'relative', zIndex: 10 }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Detalles del movimiento</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                        <Select
                            label="Tipo de movimiento"
                            name="idTipo"
                            value={formData.movement.idTipo}
                            onChange={handleMovChange}
                            options={types.map(t => ({ id: t.id, label: t.nombre }))}
                            disabled
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
                        <DatePicker
                            label="Fecha autorizada"
                            name="fechaHoraRegistro"
                            value={formData.movement.fechaHoraRegistro}
                            onChange={handleMovChange}
                            min={today}
                            max={maxDate}
                            required
                        />
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <Switch
                            label="Retorno"
                            name="conRegreso"
                            checked={formData.movement.conRegreso}
                            onChange={handleMovChange}
                            activeLabel="Con retorno al origen - F2"
                            inactiveLabel="Sin retorno al origen - F1"
                        />
                    </div>
                    <div style={{ position: 'relative', zIndex: '1000', marginTop: '20px' }}>
                        <Autocomplete
                            label="Persona a autorizar"
                            placeholder="Empiece a escribir apellido..."
                            value={formData.movement.personaInterna}
                            options={legajos.map(l => ({ id: l.legajo, label: l.apellido_nombre }))}
                            onSelect={(opt) => {
                                setFormData(prev => ({
                                    ...prev,
                                    movement: {
                                        ...prev.movement,
                                        personaInterna: opt.id
                                    }
                                }));
                            }}
                            required
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                        <Select
                            label="Origen"
                            name="idLugarOrigen"
                            value={formData.movement.idLugarOrigen}
                            onChange={handleMovChange}
                            options={lugares
                                .filter(l => {
                                    const currentType = types.find(t => String(t.id) === String(formData.movement.idTipo));
                                    // Si es saliente, no mostrar Exteriores
                                    if (currentType?.direccion === 'saliente' && l.nombre.toLowerCase() === 'exteriores') return false;
                                    return true;
                                })
                                .map(l => ({ id: l.id, label: l.nombre }))}
                            required
                        />
                        <Select
                            label="Destino"
                            name="idLugarDestino"
                            value={formData.movement.idLugarDestino}
                            onChange={handleMovChange}
                            options={lugares
                                .filter(l => String(l.id) !== String(formData.movement.idLugarOrigen)) // No puede ser igual al origen
                                .map(l => ({ id: l.id, label: l.nombre }))}
                            required
                        />
                        <Input
                            label={`Detalle del destino ${lugares.find(l => String(l.id) === String(formData.movement.idLugarDestino))?.esDependencia === 0 ? '' : '(opcional)'}`}
                            name="destinoDetalle"
                            value={formData.movement.destinoDetalle}
                            onChange={handleMovChange}
                            maxLength={50}
                            required={lugares.find(l => String(l.id) === String(formData.movement.idLugarDestino))?.esDependencia === 0}
                        />
                    </div>
                    <div style={{ marginTop: '20px' }}>
                        <Textarea
                            label="Observación (opcional)"
                            name="observacion"
                            value={formData.movement.observacion}
                            onChange={handleMovChange}
                            placeholder="Ingrese notas o detalles adicionales aquí..."
                            maxLength={500}
                        />
                    </div>
                </Card>

                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '1.25rem' }}>Artículos</h2>
                        <Button variant="secondary" size="sm" type="button" onClick={addArticle}>
                            <Plus size={16} />
                            <span className="desktop-only">Agregar Artículo</span>
                            <span className="mobile-only">Agregar</span>
                        </Button>
                    </div>
                    {formData.articles.map((art, index) => (
                        <div key={index} style={{
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            padding: '20px',
                            paddingTop: '16px',
                            marginBottom: '20px',
                            backgroundColor: 'rgba(255, 255, 255, 0.02)',
                            position: 'relative'
                        }}>
                            {/* Botón eliminar (posición absoluta) */}
                            <Button
                                variant="ghost"
                                type="button"
                                onClick={() => removeArticle(index)}
                                style={{ position: 'absolute', top: '12px', right: '12px', padding: '6px', color: 'var(--error)' }}
                            >
                                <Trash2 size={18} />
                            </Button>

                            {/* Renglón 1: Datos principales */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', paddingRight: '36px' }}>
                                <Input label="Descripción" name="descripcion" value={art.descripcion} onChange={(e) => handleArticleChange(index, e)} maxLength={100} required />
                                <Select
                                    label="Presentación"
                                    name="presentacion"
                                    value={art.presentacion || 'Bulto(s)'}
                                    onChange={(e) => handleArticleChange(index, e)}
                                    options={['Unidad(es)', 'Bulto(s)', 'Kilo(s)']}
                                    required
                                />
                                <Input
                                    label="Cant."
                                    type="number"
                                    name="cantidad"
                                    value={art.cantidad}
                                    min={1}
                                    step={1}
                                    onKeyDown={(e) => ['-', '+', '.', 'e', 'E'].includes(e.key) && e.preventDefault()}
                                    onChange={(e) => {
                                        const v = parseInt(e.target.value, 10);
                                        handleArticleChange(index, { target: { name: 'cantidad', value: isNaN(v) || v < 1 ? 1 : v } });
                                    }}
                                    required
                                />
                            </div>

                            {/* Renglón 2: Logística */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end', marginTop: '4px' }}>
                                <Select
                                    label="Destino"
                                    name="idLugarDestino"
                                    value={art.idLugarDestino}
                                    onChange={(e) => handleArticleChange(index, e)}
                                    options={lugares.map(l => ({ id: l.id, label: l.nombre }))}
                                    required
                                />
                                <Input
                                    label={`Destinatario ${lugares.find(l => String(l.id) === String(art.idLugarDestino))?.esDependencia === 0 ? '' : '(opcional)'}`}
                                    name="destinatario"
                                    value={art.destinatario}
                                    onChange={(e) => handleArticleChange(index, e)}
                                    maxLength={30}
                                    required={lugares.find(l => String(l.id) === String(art.idLugarDestino))?.esDependencia === 0}
                                />
                                <Switch
                                    name="conRetorno"
                                    checked={art.conRetorno !== false}
                                    onChange={(e) => handleArticleChange(index, e)}
                                    activeLabel="Con Retorno"
                                    inactiveLabel="Sin Retorno"
                                    style={{ marginBottom: '16px' }}
                                />
                            </div>
                        </div>
                    ))}
                    {formData.articles.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.875rem' }}>No hay artículos registrados.</p>}
                    {formData.articles.length > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                            <Button variant="secondary" size="sm" type="button" onClick={addArticle}>
                                <Plus size={16} />
                                <span className="desktop-only">Agregar Artículo</span>
                                <span className="mobile-only">Agregar</span>
                            </Button>
                        </div>
                    )}
                </Card>

                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '1.25rem' }}>Documentación</h2>
                        <Button variant="secondary" size="sm" type="button" onClick={addDocument}>
                            <Plus size={16} />
                            <span className="desktop-only">Agregar Documento</span>
                            <span className="mobile-only">Agregar</span>
                        </Button>
                    </div>
                    {formData.documents.map((doc, index) => (
                        <div key={index} style={{
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius)',
                            padding: '20px',
                            paddingTop: '16px',
                            marginBottom: '20px',
                            backgroundColor: 'rgba(255, 255, 255, 0.02)',
                            position: 'relative'
                        }}>
                            {/* Botón eliminar (posición absoluta) */}
                            <Button
                                variant="ghost"
                                type="button"
                                onClick={() => removeDocument(index)}
                                style={{ position: 'absolute', top: '12px', right: '12px', padding: '6px', color: 'var(--error)' }}
                            >
                                <Trash2 size={18} />
                            </Button>

                            {/* Renglón 1: Datos principales */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', paddingRight: '36px' }}>
                                <Select
                                    label="Tipo"
                                    name="tipo"
                                    value={doc.tipo}
                                    onChange={(e) => handleDocumentChange(index, e)}
                                    options={['Remito', 'Factura', 'Presupuesto', 'Orden de compra', 'Otros']}
                                    required
                                />
                                <Input label="Descripción" name="descripcion" value={doc.descripcion} onChange={(e) => handleDocumentChange(index, e)} maxLength={100} required />
                                <Input
                                    label="Cant."
                                    type="number"
                                    name="cantidad"
                                    value={doc.cantidad}
                                    min={1}
                                    step={1}
                                    onKeyDown={(e) => ['-', '+', '.', 'e', 'E'].includes(e.key) && e.preventDefault()}
                                    onChange={(e) => {
                                        const v = parseInt(e.target.value, 10);
                                        handleDocumentChange(index, { target: { name: 'cantidad', value: isNaN(v) || v < 1 ? 1 : v } });
                                    }}
                                    required
                                />
                            </div>

                            {/* Renglón 2: Logística */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end', marginTop: '4px' }}>
                                <Select
                                    label="Destino"
                                    name="idLugarDestino"
                                    value={doc.idLugarDestino}
                                    onChange={(e) => handleDocumentChange(index, e)}
                                    options={lugares.map(l => ({ id: l.id, label: l.nombre }))}
                                    required
                                />
                                <Input
                                    label={`Destinatario ${lugares.find(l => String(l.id) === String(doc.idLugarDestino))?.esDependencia === 0 ? '' : '(opcional)'}`}
                                    name="destinatario"
                                    value={doc.destinatario}
                                    onChange={(e) => handleDocumentChange(index, e)}
                                    maxLength={30}
                                    required={lugares.find(l => String(l.id) === String(doc.idLugarDestino))?.esDependencia === 0}
                                />
                                <Switch
                                    name="conRetorno"
                                    checked={doc.conRetorno !== false}
                                    onChange={(e) => handleDocumentChange(index, e)}
                                    activeLabel="Con Retorno"
                                    inactiveLabel="Sin Retorno"
                                    style={{ marginBottom: '16px' }}
                                />
                            </div>
                        </div>
                    ))}
                    {formData.documents.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.875rem' }}>No hay documentos registrados.</p>}
                    {formData.documents.length > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                            <Button variant="secondary" size="sm" type="button" onClick={addDocument}>
                                <Plus size={16} />
                                <span className="desktop-only">Agregar Documento</span>
                                <span className="mobile-only">Agregar</span>
                            </Button>
                        </div>
                    )}
                </Card>

                <div style={{ marginTop: '32px' }}>
                    <Button
                        variant="primary"
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '18px',
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            gap: '12px'
                        }}
                    >
                        <Send size={20} /> Generar Solicitud
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default MovementForm;
