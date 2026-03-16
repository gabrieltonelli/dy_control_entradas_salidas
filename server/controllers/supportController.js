const pool = require('../config/db');

/**
 * @desc    Registrar feedback de usuario
 * @route   POST /api/support/feedback
 */
exports.createFeedback = async (req, res) => {
    const { email, tipo, comentario, valoracion, dispositivo, version_app } = req.body;

    if (!email || !comentario) {
        return res.status(400).json({ error: 'Email y comentario son obligatorios' });
    }

    try {
        await pool.query(
            `INSERT INTO soporte_feedbacks 
            (email, tipo, comentario, valoracion, dispositivo, version_app, fecha_registro) 
            VALUES (?, ?, ?, ?, ?, ?, NOW())`,
            [email, tipo || 'Sugerencia', comentario, valoracion || 0, dispositivo || '', version_app || '']
        );

        res.status(201).json({ message: '¡Gracias por tu feedback! Ha sido registrado correctamente.' });
    } catch (error) {
        console.error('Error registrando feedback:', error);
        res.status(500).json({ error: 'Error al registrar el feedback' });
    }
};

/**
 * @desc    Listar FAQs activas
 * @route   GET /api/support/faqs
 */
exports.getFaqs = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM soporte_faqs WHERE activo = 1 ORDER BY categoria, orden'
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * @desc    Listar Video Tutoriales activos
 * @route   GET /api/support/videos
 */
exports.getVideos = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM soporte_videos WHERE activo = 1 ORDER BY categoria, orden'
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
