const pool = require('../config/db');

/**
 * Guarda una suscripción a notificaciones push
 */
exports.subscribe = async (req, res) => {
    const { email, subscription } = req.body;

    if (!email || !subscription) {
        return res.status(400).json({ error: 'Email y suscripción requeridos' });
    }

    try {
        const subStr = JSON.stringify(subscription);
        
        // Timestamp en hora Argentina (el servidor MySQL de RDS está en UTC)
        const nowAr = new Date().toLocaleString('sv-SE', { timeZone: 'America/Argentina/Buenos_Aires' });
        
        // Usar ON DUPLICATE KEY UPDATE para evitar duplicados
        await pool.query(
            `INSERT INTO push_subscriptions (email, subscription, created_at) 
             VALUES (?, ?, ?) 
             ON DUPLICATE KEY UPDATE created_at = ?`,
            [email, subStr, nowAr, nowAr]
        );

        res.status(201).json({ message: 'Suscripción guardada correctamente' });
    } catch (error) {
        console.error('Error guardando suscripción:', error);
        res.status(500).json({ error: 'Error al procesar la suscripción' });
    }
};

/**
 * Elimina una suscripción
 */
exports.unsubscribe = async (req, res) => {
    const { subscription } = req.body;

    if (!subscription) {
        return res.status(400).json({ error: 'Suscripción requerida' });
    }

    try {
        const subStr = JSON.stringify(subscription);
        await pool.query(
            'DELETE FROM push_subscriptions WHERE subscription = ?',
            [subStr]
        );
        res.json({ message: 'Suscripción eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Obtener la llave pública VAPID
 */
exports.getVapidPublicKey = (req, res) => {
    res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
};
