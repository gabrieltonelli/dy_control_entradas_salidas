import React, { useState, useEffect, useRef } from 'react';
import {
    MessageSquare,
    HelpCircle,
    PlayCircle,
    Send,
    ExternalLink,
    ChevronDown,
    ChevronUp,
    Star,
    AlertCircle,
    CheckCircle2,
    Video,
    ShieldCheck,
    User
} from 'lucide-react';
import { useAuth } from '../config/AuthContext';
import { SupportService } from '../services/api';
import { useLocation, useNavigate } from 'react-router-dom';

const Soporte = () => {
    const { user, esPortero, esAutorizador } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // Leer tab de la URL
    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get('tab') || 'faq';

    const [activeTab, setActiveTab] = useState(initialTab);
    const [faqs, setFaqs] = useState([]);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openFaq, setOpenFaq] = useState(null);
    const contentRef = useRef(null);

    // Estado del formulario de feedback
    const [feedback, setFeedback] = useState({
        tipo: 'Sugerencia',
        comentario: '',
        valoracion: 5
    });
    const [sending, setSending] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [faqsRes, videosRes] = await Promise.all([
                    SupportService.getFaqs(),
                    SupportService.getVideos()
                ]);
                setFaqs(faqsRes.data);
                setVideos(videosRes.data);
            } catch (error) {
                console.error("Error cargando soporte:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        // Actualizar tab si cambia la URL
        const tab = new URLSearchParams(location.search).get('tab');
        if (tab) setActiveTab(tab);
    }, [location.search]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        navigate(`/soporte?tab=${tab}`);
        
        // Hacer scroll suave hasta el contenido
        if (contentRef.current) {
            const yOffset = -100; // Offset para no quedar pegado al tope
            const element = contentRef.current;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const handleFeedbackSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            await SupportService.sendFeedback({
                ...feedback,
                email: user.email,
                dispositivo: navigator.userAgent,
                version_app: window.__APP_VERSION__ || '1.0.0'
            });
            setSuccessMessage('¡Gracias! Tu feedback ha sido enviado correctamente y será revisado por el equipo de soporte.');
            setFeedback({ tipo: 'Sugerencia', comentario: '', valoracion: 5 });
            // Ya no ocultamos automáticamente para que el usuario vea la pantalla de éxito
        } catch (error) {
            console.error("Error enviando feedback:", error);
        } finally {
            setSending(false);
        }
    };

    const toggleFaq = (id) => {
        setOpenFaq(openFaq === id ? null : id);
    };

    // Filtrar videos por rol
    const getFilteredVideos = () => {
        const general = videos.filter(v => v.categoria === 'General');
        const porteria = esPortero ? videos.filter(v => v.categoria === 'Porteria') : [];
        const autorizantes = esAutorizador ? videos.filter(v => v.categoria === 'Autorizantes') : [];
        const solicitantes = !esPortero ? videos.filter(v => v.categoria === 'Solicitantes') : [];

        return { general, porteria, autorizantes, solicitantes };
    };

    const filteredVideos = getFilteredVideos();

    if (loading) return <div className="loading-container">Cargando soporte...</div>;

    return (
        <div className="page-container animate-fade-in" style={{ paddingBottom: '40px' }}>
            <div className="page-header">
                <div>
                    <h1>Centro de Soporte</h1>
                    <p className="text-muted">¿En qué podemos ayudarte hoy?</p>
                </div>
            </div>

            {/* Selector de Secciones por Cards */}
            <div className="support-nav-grid" style={{ marginBottom: '40px' }}>
                <div
                    className={`support-nav-card glass ${activeTab === 'faq' ? 'active' : ''}`}
                    onClick={() => handleTabChange('faq')}
                >
                    <div className="nav-card-icon"><HelpCircle size={32} /></div>
                    <div className="nav-card-content">
                        <h3>Preguntas Frecuentes</h3>
                        <p>Resolvé tus dudas rápidamente</p>
                    </div>
                </div>
                <div
                    className={`support-nav-card glass ${activeTab === 'tutorials' ? 'active' : ''}`}
                    onClick={() => handleTabChange('tutorials')}
                >
                    <div className="nav-card-icon"><PlayCircle size={32} /></div>
                    <div className="nav-card-content">
                        <h3>Videotutoriales</h3>
                        <p>Aprendé a usar el sistema paso a paso</p>
                    </div>
                </div>
                <div
                    className={`support-nav-card glass ${activeTab === 'feedback' ? 'active' : ''}`}
                    onClick={() => handleTabChange('feedback')}
                >
                    <div className="nav-card-icon"><MessageSquare size={32} /></div>
                    <div className="nav-card-content">
                        <h3>Feedback</h3>
                        <p>Ayudanos a seguir mejorando</p>
                    </div>
                </div>
            </div>

            {/* Contenido de Secciones */}
            <div className="support-content-area" ref={contentRef}>

                {/* FAQ SECTION */}
                {activeTab === 'faq' && (
                    <div className="faq-grid animate-fade-in">
                        {faqs.length === 0 ? (
                            <p className="text-muted text-center" style={{ gridColumn: '1/-1', padding: '40px' }}>No hay preguntas frecuentes cargadas todavía.</p>
                        ) : (
                            faqs.map(faq => (
                                <div key={faq.id} className="faq-card glass">
                                    <div className="faq-card-header">
                                        <span className="faq-badge">{faq.categoria}</span>
                                        <h4>{faq.pregunta}</h4>
                                    </div>
                                    <div className="faq-card-body">
                                        <p>{faq.respuesta}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* TUTORIALS TAB */}
                {activeTab === 'tutorials' && (
                    <div className="videos-sections">
                        <VideoCategory title="Generales" videos={filteredVideos.general} icon={<Video size={20} />} />
                        {esPortero && <VideoCategory title="Para Portería" videos={filteredVideos.porteria} icon={<ShieldCheck size={20} />} />}
                        {esAutorizador && <VideoCategory title="Para Autorizantes" videos={filteredVideos.autorizantes} icon={<Star size={20} />} />}
                        {!esPortero && <VideoCategory title="Para Solicitantes" videos={filteredVideos.solicitantes} icon={<User size={20} />} />}

                        {videos.length === 0 && (
                            <p className="text-muted text-center" style={{ padding: '40px' }}>No hay videotutoriales disponibles.</p>
                        )}
                    </div>
                )}

                {/* FEEDBACK TAB */}
                {activeTab === 'feedback' && (
                    <div className="feedback-section glass animate-fade-in" style={{ padding: '40px', borderRadius: '32px' }}>
                        {successMessage ? (
                            <div className="feedback-success-view animate-bounce-in" style={{ textAlign: 'center', padding: '40px 0' }}>
                                <div className="success-icon-wrapper">
                                    <CheckCircle2 size={100} strokeWidth={1.5} />
                                </div>
                                <h2 style={{ marginTop: '32px', fontSize: '2rem' }}>¡Recibido con éxito!</h2>
                                <p className="text-muted" style={{ fontSize: '1.2rem', margin: '16px auto 40px', maxWidth: '500px' }}>
                                    {successMessage}
                                </p>
                                <button
                                    onClick={() => setSuccessMessage('')}
                                    className="submit-feedback-btn"
                                    style={{ maxWidth: '300px', margin: '0 auto' }}
                                >
                                    <span>Enviar otro comentario</span>
                                </button>
                            </div>
                        ) : (
                            <>
                                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                                    <MessageSquare size={40} style={{ color: 'var(--primary)', marginBottom: '16px' }} />
                                    <h2>Tu opinión nos importa</h2>
                                    <p className="text-muted">Ayudanos a mejorar Don Yeyo Manager compartiendo tus sugerencias o reportando problemas.</p>
                                </div>

                                <form onSubmit={handleFeedbackSubmit} className="feedback-form">
                                    <div className="form-group">
                                        <label>¿De qué se trata?</label>
                                        <div className="feedback-selector">
                                            {['Sugerencia', 'Error', 'Elogio', 'Otros'].map(t => (
                                                <div
                                                    key={t}
                                                    className={`feedback-option ${feedback.tipo === t ? 'selected' : ''}`}
                                                    onClick={() => setFeedback({ ...feedback, tipo: t })}
                                                >
                                                    <div className="option-circle"></div>
                                                    <span>{t}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="form-group" style={{ marginTop: '32px' }}>
                                        <label>¿Cómo calificarías tu experiencia?</label>
                                        <div className="star-rating big">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star
                                                    key={star}
                                                    size={44}
                                                    fill={feedback.valoracion >= star ? 'var(--warning)' : 'none'}
                                                    color={feedback.valoracion >= star ? 'var(--warning)' : 'rgba(150,150,150,0.3)'}
                                                    className={feedback.valoracion >= star ? 'active-star' : ''}
                                                    onClick={() => setFeedback({ ...feedback, valoracion: star })}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="form-group" style={{ marginTop: '32px' }}>
                                        <label>Contanos más...</label>
                                        <textarea
                                            className="feedback-textarea glass"
                                            rows="5"
                                            placeholder="Tu mensaje es fundamental para seguir creciendo..."
                                            required
                                            value={feedback.comentario}
                                            onChange={(e) => setFeedback({ ...feedback, comentario: e.target.value })}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="submit-feedback-btn"
                                        disabled={sending}
                                    >
                                        {sending ? (
                                            'Enviando...'
                                        ) : (
                                            <>
                                                <span>Enviar Feedback</span>
                                                <Send size={20} />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

// Componente helper para categorías de video
const VideoCategory = ({ title, videos, icon }) => {
    if (videos.length === 0) return null;
    return (
        <div style={{ marginBottom: '32px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--primary)' }}>
                {icon} {title}
            </h3>
            <div className="videos-grid">
                {videos.map(video => (
                    <a
                        key={video.id}
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="video-item-card glass animate-fade-in"
                    >
                        <div className="video-preview">
                            <Video size={36} />
                            <div className="play-overlay">
                                <PlayCircle size={48} />
                            </div>
                        </div>
                        <div className="video-content">
                            <h4>{video.titulo}</h4>
                            <p>{video.descripcion || 'Video tutorial para este módulo'}</p>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default Soporte;
