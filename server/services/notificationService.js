const webpush = require('web-push');
const pool = require('../config/db');

// Configuración de web-push
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
        'mailto:sistemas@donyeyo.com.ar',
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
}

/**
 * Envía una notificación push a todos los suscriptores asociados a un email
 */
async function sendPushNotification(email, payload) {
    try {
        const [rows] = await pool.query(
            'SELECT subscription FROM push_subscriptions WHERE email = ?',
            [email]
        );

        if (rows.length === 0) return;

        const notifications = rows.map(row => {
            const subscription = JSON.parse(row.subscription);
            return webpush.sendNotification(subscription, JSON.stringify(payload))
                .catch(err => {
                    if (err.statusCode === 404 || err.statusCode === 410) {
                        // Suscripción expirada o inexistente, eliminarla
                        pool.query('DELETE FROM push_subscriptions WHERE subscription = ?', [row.subscription]);
                    }
                    console.error('Error enviando notificación push:', err);
                });
        });

        await Promise.all(notifications);
    } catch (error) {
        console.error('Error en sendPushNotification:', error);
    }
}

/**
 * Notifica a un autorizante sobre una nueva solicitud
 */
async function notifyNewRequest(autorizanteEmail, movement) {
    const payload = {
        title: 'Nueva solicitud pendiente',
        body: `${movement.persona_interna_nombre || 'Un usuario'} ha solicitado un ${movement.tipo_nombre || 'movimiento'}.`,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        data: {
            url: '/mis-solicitudes?filtro=accion'
        }
    };

    return sendPushNotification(autorizanteEmail, payload);
}

module.exports = {
    sendPushNotification,
    notifyNewRequest
};
