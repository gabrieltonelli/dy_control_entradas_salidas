import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MastersService, MovementsService } from '../services/api';
import { Card, Input, Select, Autocomplete, Switch, DatePicker, Textarea } from '../components/FormElements';
import { Button } from '../components/Button';
import Modal from '../components/Modal';
import { Plus, Trash2, Send, AlertTriangle } from 'lucide-react';

import { useMsal } from "@azure/msal-react";

const MovementForm = () => {
    const { accounts } = useMsal();
    const navigate = useNavigate();
    const currentUser = accounts[0] || {};

    const today = new Date().toISOString().split('T')[0];
    const maxDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const [legajos, setLegajos] = useState([]);
    const [lugares, setLugares] = useState([]);
    const [types, setTypes] = useState([]);
    const [myLegajo, setMyLegajo] = useState(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showSelfAuthWarning, setShowSelfAuthWarning] = useState(false);
    const [isVerifyingLegajo, setIsVerifyingLegajo] = useState(true);
    const [isLoadingMasters, setIsLoadingMasters] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            setIsLoadingMasters(true);
            try {
                // Verify current user legajo
                if (currentUser.username || currentUser.email) {
                    try {
                        const meRes = await MastersService.getMe(currentUser.username || currentUser.email);
                        setMyLegajo(meRes.data);
                    } catch (err) {
                        console.error('User legajo not found:', err);
                        setShowAuthModal(true);
                    } finally {
                        setIsVerifyingLegajo(false);
                    }
                } else {
                    setShowAuthModal(true);
                    setIsVerifyingLegajo(false);
                }

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
                const movementTypes = t.data;
                setTypes(movementTypes);

                // Asignar valores por defecto si están vacíos después de cargar los datos
                setFormData(prev => {
                    const newMov = { ...prev.movement };
                    let changed = false;

                    // 1. Motivo
                    if (!newMov.motivo) {
                        newMov.motivo = 'Motivos personales';
                        changed = true;
                    }

                    // 2. Origen (según el tipo actual)
                    if (!newMov.idLugarOrigen && lug.data.length > 0) {
                        const currentType = movementTypes.find(type => String(type.id) === String(newMov.idTipo));
                        const validOrigen = lug.data.find(l => {
                            if (currentType?.direccion === 'saliente' && l.nombre.toLowerCase() === 'exteriores') return false;
                            return true;
                        });
                        if (validOrigen) {
                            newMov.idLugarOrigen = String(validOrigen.id);
                            changed = true;
                        }
                    }

                    // 3. Destino (distinto al origen)
                    if (!newMov.idLugarDestino && lug.data.length > 0) {
                        const origin = newMov.idLugarOrigen;
                        const validDest = lug.data.find(l => String(l.id) !== String(origin));
                        if (validDest) {
                            newMov.idLugarDestino = String(validDest.id);
                            changed = true;
                        }
                    }

                    if (changed) {
                        return { ...prev, movement: newMov };
                    }
                    return prev;
                });
            } catch (error) {
                console.error('Error fetching masters:', error);
            } finally {
                setIsLoadingMasters(false);
            }
        };
        fetchData();
    }, []);

    const handleMovChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;

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

    const validateAndScroll = () => {
        const errors = [];

        // Validar en orden de arriba hacia abajo en el formulario
        if (!formData.movement.idLugarOrigen) errors.push('field-lugar-origen');
        if (!formData.movement.idLugarDestino) errors.push('field-lugar-destino');

        // Detalle del destino opcional/requerido
        const destinoLugar = lugares.find(l => String(l.id) === String(formData.movement.idLugarDestino));
        if (destinoLugar?.esDependencia === 0 && !formData.movement.destinoDetalle) {
            errors.push('field-destino-detalle');
        }

        if (!formData.movement.idTipo) errors.push('field-tipo');
        if (!formData.movement.motivo) errors.push('field-motivo');
        if (!formData.movement.fechaHoraRegistro) errors.push('field-fecha');
        if (!formData.movement.personaInterna) errors.push('field-persona-interna');

        // Si hay errores, hacer scroll al primero
        if (errors.length > 0) {
            const firstErrorId = errors[0];
            const element = document.getElementById(firstErrorId);
            if (element) {
                // ESTRATEGIA: Calculamos la posición absoluta y restamos un offset generoso (220px)
                // para que el header (70px) no tape el label ni el campo.
                const headerOffset = 220;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Intentamos hacer foco en el primer input/select del contenedor
                const input = element.querySelector('input, select, button');
                if (input) {
                    setTimeout(() => input.focus({ preventScroll: true }), 600);
                }

                // Resaltar brevemente para feedback visual
                element.style.transition = 'background-color 0.3s';
                element.style.backgroundColor = 'rgba(228, 5, 33, 0.1)';
                setTimeout(() => {
                    element.style.backgroundColor = 'transparent';
                }, 2000);
            }
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();

        // Validar campos obligatorios y hacer scroll
        if (!validateAndScroll()) return;

        // Check if legajo was found
        if (!myLegajo) {
            setShowAuthModal(true);
            return;
        }

        // Check for self-authorization
        if (String(formData.movement.personaInterna) === String(myLegajo.legajo)) {
            setShowSelfAuthWarning(true);
            return;
        }

        executeSubmit();
    };

    const executeSubmit = async () => {
        setIsSubmitting(true);
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

            const res = await MovementsService.create(submitData);

            // Guardar valores en localStorage para persistencia en el próximo formulario
            dropdownKeys.forEach(key => {
                localStorage.setItem(`movementForm_${key}`, formData.movement[key]);
            });

            // Redirect to status page on success
            navigate('/status', {
                state: {
                    success: true,
                    message: res.data?.message || 'Su solicitud ha sido registrada correctamente en el sistema.',
                    movementId: res.data?.id
                }
            });
        } catch (error) {
            console.error('Error creating movement:', error);
            setIsSubmitting(false);

            let errorMessage = error.message;

            if (error.response?.data) {
                const data = error.response.data;
                // Si hay una lista de detalles de validación, tomamos el mensaje del primer error
                if (data.details && Array.isArray(data.details) && data.details.length > 0) {
                    errorMessage = data.details[0].message || data.details[0];
                }
                // Si no hay detalles pero hay un error genérico (que no sea "Validation failed"), lo usamos
                else if (data.error && data.error !== 'Validation failed') {
                    errorMessage = data.error;
                }
                // Si el error es "Validation failed" y no hay detalles (raro), se deja el errorMessage por defecto (error.message)
            }

            // Redirect to status page on error
            navigate('/status', {
                state: {
                    success: false,
                    message: errorMessage
                }
            });
        }
    };

    if (isVerifyingLegajo || isLoadingMasters) {
        return (
            <div className="full-screen-loader">
                <svg className="spinner" viewBox="0 0 50 50" style={{ width: '50px', height: '50px' }}>
                    <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                </svg>
                <p>{isVerifyingLegajo ? 'Verificando credenciales...' : 'Cargando datos maestros...'}</p>
            </div>
        );
    }

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
                            containerId="field-tipo"
                            value={formData.movement.idTipo}
                            onChange={handleMovChange}
                            options={types.map(t => ({ id: t.id, label: t.nombre }))}
                            disabled={true} // Siempre deshabilitado
                            required
                        />
                        <Select
                            label="Motivo"
                            name="motivo"
                            containerId="field-motivo"
                            value={formData.movement.motivo}
                            onChange={handleMovChange}
                            options={['Motivos personales', 'Requerimiento laboral', 'Accidente o razones médicas', 'Otros']}
                            required
                            includePlaceholder={false}
                            disabled={isSubmitting}
                        />

                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                        <Switch
                            label="Retorno"
                            name="conRegreso"
                            checked={formData.movement.conRegreso}
                            onChange={handleMovChange}
                            activeLabel="Con retorno al origen - F2"
                            inactiveLabel="Sin retorno al origen - F1"
                            disabled={isSubmitting}
                        />
                        <DatePicker
                            label="Fecha autorizada"
                            name="fechaHoraRegistro"
                            containerId="field-fecha"
                            value={formData.movement.fechaHoraRegistro}
                            onChange={handleMovChange}
                            min={today}
                            max={maxDate}
                            required
                            disabled={isSubmitting}
                        />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                        <Select
                            label="Lugar de origen"
                            name="idLugarOrigen"
                            containerId="field-lugar-origen"
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
                            includePlaceholder={false}
                            disabled={isSubmitting}
                        />
                        <Select
                            label="Lugar de destino"
                            name="idLugarDestino"
                            containerId="field-lugar-destino"
                            value={formData.movement.idLugarDestino}
                            onChange={handleMovChange}
                            options={lugares
                                .filter(l => String(l.id) !== String(formData.movement.idLugarOrigen)) // No puede ser igual al origen
                                .map(l => ({ id: l.id, label: l.nombre }))}
                            required
                            includePlaceholder={false}
                            disabled={isSubmitting}
                        />
                        <Input
                            label={`Detalle del destino ${lugares.find(l => String(l.id) === String(formData.movement.idLugarDestino))?.esDependencia === 0 ? '' : '(opcional)'}`}
                            name="destinoDetalle"
                            containerId="field-destino-detalle"
                            value={formData.movement.destinoDetalle}
                            onChange={handleMovChange}
                            maxLength={50}
                            required={lugares.find(l => String(l.id) === String(formData.movement.idLugarDestino))?.esDependencia === 0}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div style={{ position: 'relative', zIndex: '1000', marginTop: '20px' }}>
                        <Autocomplete
                            label="Persona a autorizar"
                            containerId="field-persona-interna"
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
                            disabled={isSubmitting}
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
                            disabled={isSubmitting}
                        />
                    </div>
                </Card>

                <Card>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '1.25rem' }}>Artículos</h2>
                        <Button variant="secondary" size="sm" type="button" onClick={addArticle} disabled={isSubmitting}>
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
                                style={{ position: 'absolute', top: '12px', padding: '6px', color: 'var(--error)', float: 'right' }}
                                disabled={isSubmitting}
                            >
                                <Trash2 size={18} />
                            </Button>

                            {/* Renglón 1: Datos principales */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', paddingRight: '36px' }}>
                                <Input label="Descripción" name="descripcion" value={art.descripcion} onChange={(e) => handleArticleChange(index, e)} maxLength={100} required disabled={isSubmitting} />
                                <Select
                                    label="Presentación"
                                    name="presentacion"
                                    value={art.presentacion || 'Bulto(s)'}
                                    onChange={(e) => handleArticleChange(index, e)}
                                    options={['Unidad(es)', 'Bulto(s)', 'Kilo(s)']}
                                    required
                                    disabled={isSubmitting}
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
                                    disabled={isSubmitting}
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
                                    includePlaceholder={false}
                                    disabled={isSubmitting}
                                />
                                <Input
                                    label={`Destinatario ${lugares.find(l => String(l.id) === String(art.idLugarDestino))?.esDependencia === 0 ? '' : '(opcional)'}`}
                                    name="destinatario"
                                    value={art.destinatario}
                                    onChange={(e) => handleArticleChange(index, e)}
                                    maxLength={30}
                                    required={lugares.find(l => String(l.id) === String(art.idLugarDestino))?.esDependencia === 0}
                                    disabled={isSubmitting}
                                />
                                <Switch
                                    name="conRetorno"
                                    checked={art.conRetorno !== false}
                                    onChange={(e) => handleArticleChange(index, e)}
                                    activeLabel="Con Retorno"
                                    inactiveLabel="Sin Retorno"
                                    style={{ marginBottom: '16px' }}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                    ))}
                    {formData.articles.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.875rem' }}>No hay artículos registrados.</p>}
                    {formData.articles.length > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                            <Button variant="secondary" size="sm" type="button" onClick={addArticle} disabled={isSubmitting}>
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
                        <Button variant="secondary" size="sm" type="button" onClick={addDocument} disabled={isSubmitting}>
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
                                style={{ position: 'absolute', top: '12px', padding: '6px', color: 'var(--error)', float: 'right' }}
                                disabled={isSubmitting}
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
                                    disabled={isSubmitting}
                                />
                                <Input label="Descripción" name="descripcion" value={doc.descripcion} onChange={(e) => handleDocumentChange(index, e)} maxLength={100} required disabled={isSubmitting} />
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
                                    disabled={isSubmitting}
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
                                    includePlaceholder={false}
                                    disabled={isSubmitting}
                                />
                                <Input
                                    label={`Destinatario ${lugares.find(l => String(l.id) === String(doc.idLugarDestino))?.esDependencia === 0 ? '' : '(opcional)'}`}
                                    name="destinatario"
                                    value={doc.destinatario}
                                    onChange={(e) => handleDocumentChange(index, e)}
                                    maxLength={30}
                                    required={lugares.find(l => String(l.id) === String(doc.idLugarDestino))?.esDependencia === 0}
                                    disabled={isSubmitting}
                                />
                                <Switch
                                    name="conRetorno"
                                    checked={doc.conRetorno !== false}
                                    onChange={(e) => handleDocumentChange(index, e)}
                                    activeLabel="Con Retorno"
                                    inactiveLabel="Sin Retorno"
                                    style={{ marginBottom: '16px' }}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                    ))}
                    {formData.documents.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.875rem' }}>No hay documentos registrados.</p>}
                    {formData.documents.length > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                            <Button variant="secondary" size="sm" type="button" onClick={addDocument} disabled={isSubmitting}>
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
                        loading={isSubmitting}
                        style={{
                            width: '100%',
                            padding: '18px',
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            gap: '12px'
                        }}
                    >
                        <Send size={20} /> {isSubmitting ? 'Procesando...' : 'Generar Solicitud'}
                    </Button>
                </div>
            </form>

            {/* Modal de error: Usuario sin legajo */}
            <Modal
                isOpen={showAuthModal}
                onClose={() => { }} // No permitir cerrar
                title="Acceso Restringido"
                type="error"
                message={
                    <div>
                        <p>No se ha podido encontrar un legajo asociado a su cuenta (<strong>{currentUser.username || currentUser.email}</strong>).</p>
                        <p>Por favor, contacte con el Administrador del Sistema para regularizar su situación antes de generar solicitudes.</p>
                    </div>
                }
                confirmLabel="Entendido"
                showCancel={false}
                onConfirm={() => window.location.href = '/'}
            />

            {/* Modal de advertencia: Auto-autorización */}
            <Modal
                isOpen={showSelfAuthWarning}
                onClose={() => setShowSelfAuthWarning(false)}
                title="Advertencia"
                type="warning"
                message={
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#ffcc00' }}>
                            <AlertTriangle size={32} />
                            <strong style={{ fontSize: '1.2rem' }}>Auto-autorización detectada</strong>
                        </div>
                        <p>Usted se está autorizando a sí mismo.</p>
                        <p>Si confirma, la autorización será generada de todos modos. Esta acción será registrada en la auditoría del sistema para su posterior revisión.</p>
                        <p>¿Desea continuar con la operación?</p>
                    </div>
                }
                confirmLabel="Confirmar y Continuar"
                cancelLabel="Cancelar"
                onConfirm={executeSubmit}
            />
        </div>
    );
};

export default MovementForm;
