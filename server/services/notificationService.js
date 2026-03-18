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
            'SELECT id, subscription FROM push_subscriptions WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            console.log(`[Push] No hay suscripciones para ${email}`);
            return;
        }

        console.log(`[Push] Enviando a ${email}: ${rows.length} suscripción(es) encontradas`);

        const notifications = rows.map(async (row) => {
            try {
                const subscription = JSON.parse(row.subscription);
                await webpush.sendNotification(subscription, JSON.stringify(payload));
                console.log(`[Push] ✅ Enviado OK a suscripción ID ${row.id} de ${email}`);
            } catch (err) {
                console.error(`[Push] ❌ Error en suscripción ID ${row.id} de ${email}: ${err.statusCode} - ${err.message}`);
                if (err.statusCode === 404 || err.statusCode === 410) {
                    // Suscripción expirada o inexistente, eliminarla
                    await pool.query('DELETE FROM push_subscriptions WHERE id = ?', [row.id]);
                    console.log(`[Push] 🗑️ Suscripción ID ${row.id} eliminada (expirada)`);
                }
            }
        });

        await Promise.all(notifications);
    } catch (error) {
        console.error('[Push] Error general en sendPushNotification:', error);
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

/**
 * Notifica al solicitante sobre el cambio de estado de su solicitud
 */
async function notifyRequestStatus(requesterEmail, movementId, status, details = {}) {
    let title = '';
    let body = '';
    
    switch (status) {
        case 'approved':
            title = '✅ Solicitud aprobada';
            body = `Tu solicitud #${movementId} ha sido aprobada por el autorizante.`;
            break;
        case 'rejected':
            title = '❌ Solicitud rechazada';
            body = `Tu solicitud #${movementId} ha sido rechazada.`;
            if (details.observacion) body += ` Motivo: ${details.observacion}`;
            break;
        case 'cancelled':
            title = '🚫 Solicitud anulada';
            body = `Tu solicitud #${movementId} ha sido anulada.`;
            if (details.observacion) body += ` Motivo: ${details.observacion}`;
            break;
    }

    const payload = {
        title,
        body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        data: {
            url: '/mis-solicitudes'
        }
    };

    return sendPushNotification(requesterEmail, payload);
}

/**
 * Notifica a un solicitante que un autorizante creó un movimiento en su nombre
 */
async function notifyMovementCreatedForYou(requesterEmail, movement) {
    const payload = {
        title: '📋 Movimiento creado en tu nombre',
        body: `${movement.autorizante_nombre || 'Un autorizante'} generó un ${movement.tipo_nombre || 'movimiento'} a tu nombre. Ya está listo para ser presentado en portería.`,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        data: {
            url: '/mis-solicitudes'
        }
    };

    return sendPushNotification(requesterEmail, payload);
}

/**
 * Notifica a un autorizante que su movimiento fue completado por portería
 */
async function notifyMovementCompleted(autorizanteEmail, movement) {
    const hora = movement.fecha_completado || 'ahora recién';
    const porteria = movement.porteria_nombre || 'portería';
    const persona = movement.persona_interna_nombre || 'La persona';
    const movId = movement.id || '';

    const payload = {
        title: '✅ Paso registrado en portería',
        body: `${persona} pasó por ${porteria} a las ${hora}.`,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        data: {
            url: `/mis-solicitudes`
        }
    };

    return sendPushNotification(autorizanteEmail, payload);
}

module.exports = {
    sendPushNotification,
    notifyNewRequest,
    notifyRequestStatus,
    notifyMovementCreatedForYou,
    notifyMovementCompleted
};
