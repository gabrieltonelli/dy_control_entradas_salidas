/**
 * ============================================================
 * Script de diagnóstico y prueba de Push Notifications
 * ============================================================
 *
 * USO:
 *   node test_push.js <modo> <email>
 *
 * MODOS:
 *   check     → Solo verifica suscripciones del email (sin enviar)
 *   send      → Envía una notificación de prueba genérica
 *   request   → Simula "nueva solicitud pendiente" para un autorizante
 *   status    → Simula "solicitud aprobada" para un solicitante
 *   created   → Simula "movimiento creado en tu nombre" para un solicitante
 *   porteria  → Simula "paso registrado en portería" para un autorizante
 *
 * EJEMPLOS:
 *   node test_push.js check gabrielt@donyeyo.com.ar
 *   node test_push.js send leonelc@donyeyo.com.ar
 *   node test_push.js request gabrielt@donyeyo.com.ar
 *   node test_push.js status leonelc@donyeyo.com.ar
 *   node test_push.js created leonelc@donyeyo.com.ar
 *   node test_push.js porteria gabrielt@donyeyo.com.ar
 * ============================================================
 */
require('dotenv').config();
const webpush = require('web-push');
const pool = require('./config/db');

const [,, mode = 'check', email] = process.argv;

if (!email) {
    console.error('\n❌ Uso: node test_push.js <modo> <email>\n');
    console.error('   Modos: check | send | request | status | created | porteria\n');
    process.exit(1);
}

// ─── Verificar VAPID ──────────────────────────────────────────
function setupVapid() {
    if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
        console.error('❌ VAPID keys no configuradas en .env');
        process.exit(1);
    }
    webpush.setVapidDetails(
        'mailto:sistemas@donyeyo.com.ar',
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
    console.log('✅ VAPID configurado OK');
}

// ─── Buscar suscripciones ─────────────────────────────────────
async function checkSubscriptions(targetEmail) {
    const [rows] = await pool.query(
        'SELECT id, subscription, created_at FROM push_subscriptions WHERE email = ?',
        [targetEmail]
    );
    if (rows.length === 0) {
        console.log(`\n⚠️  No hay suscripciones para ${targetEmail}`);
        console.log('   → El usuario debe abrir la app y aceptar las notificaciones.\n');
        return [];
    }
    console.log(`\n📋 Suscripciones para ${targetEmail}: ${rows.length}`);
    rows.forEach(r => {
        const sub = JSON.parse(r.subscription);
        const endpoint = sub.endpoint.substring(0, 70);
        console.log(`   [ID ${r.id}] ${r.created_at} | ${endpoint}...`);
    });
    return rows;
}

// ─── Enviar payload a todas las suscripciones ─────────────────
async function sendPayload(rows, payload) {
    console.log('\n📤 Enviando...');
    for (const row of rows) {
        try {
            const subscription = JSON.parse(row.subscription);
            const result = await webpush.sendNotification(subscription, JSON.stringify(payload));
            console.log(`   ✅ ID ${row.id}: HTTP ${result.statusCode} OK`);
        } catch (err) {
            console.error(`   ❌ ID ${row.id}: Error ${err.statusCode} — ${err.message}`);
            if (err.statusCode === 404 || err.statusCode === 410) {
                await pool.query('DELETE FROM push_subscriptions WHERE id = ?', [row.id]);
                console.log(`   🗑️  Suscripción ID ${row.id} eliminada (expirada)`);
            }
        }
    }
}

// ─── Payloads por modo ────────────────────────────────────────
function getPayload(targetMode) {
    const now = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    const payloads = {
        send: {
            title: '🧪 Prueba de Notificación',
            body: `Test enviado a las ${now}. Si ves esto, las notificaciones funcionan. ✅`,
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-192x192.png',
            data: { url: '/' }
        },
        request: {
            title: 'Nueva solicitud pendiente',
            body: 'GONZALEZ LEONEL ha solicitado un INGRESO DE PERSONA EXTERNA. [TEST]',
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-192x192.png',
            data: { url: '/mis-solicitudes?filtro=accion' }
        },
        status: {
            title: '✅ Solicitud aprobada',
            body: 'Tu solicitud #999 ha sido aprobada por el autorizante. [TEST]',
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-192x192.png',
            data: { url: '/mis-solicitudes' }
        },
        created: {
            title: '📋 Movimiento creado en tu nombre',
            body: 'TONELLI GABRIEL generó un INGRESO a tu nombre. Ya está listo para portería. [TEST]',
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-192x192.png',
            data: { url: '/mis-solicitudes' }
        },
        porteria: {
            title: '✅ Paso registrado en portería',
            body: `GONZALEZ LEONEL pasó por Portería Principal a las ${now}. [TEST]`,
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-192x192.png',
            data: { url: '/mis-solicitudes' }
        }
    };
    return payloads[targetMode] || payloads.send;
}

// ─── Main ─────────────────────────────────────────────────────
async function main() {
    console.log(`\n🔍 Diagnóstico de Push Notifications`);
    console.log(`   Modo: ${mode} | Email: ${email}`);
    console.log('─'.repeat(50));

    setupVapid();

    const rows = await checkSubscriptions(email);

    if (mode === 'check') {
        pool.end();
        return;
    }

    if (rows.length === 0) {
        console.log('⛔ Sin suscripciones — no se puede enviar.\n');
        pool.end();
        return;
    }

    const payload = getPayload(mode);
    console.log(`\n📨 Payload: "${payload.title}" → "${payload.body}"`);
    await sendPayload(rows, payload);

    console.log('\n✅ Test completado.\n');
    pool.end();
}

main().catch(err => {
    console.error('Error fatal:', err);
    pool.end();
    process.exit(1);
});
