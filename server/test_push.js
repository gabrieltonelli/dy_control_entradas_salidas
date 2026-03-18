/**
 * Script de diagnóstico de Push Notifications
 * Uso: node test_push.js tu@email.com
 */
require('dotenv').config();
const webpush = require('web-push');
const pool = require('./config/db');

const email = process.argv[2];

if (!email) {
    console.error('❌ Uso: node test_push.js tu@email.com');
    process.exit(1);
}

async function testPush() {
    console.log('\n🔍 Diagnóstico de Push Notifications');
    console.log('=====================================');
    
    // 1. Verificar VAPID keys
    if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
        console.error('❌ VAPID keys no configuradas en .env');
        process.exit(1);
    }
    console.log('✅ VAPID_PUBLIC_KEY:', process.env.VAPID_PUBLIC_KEY.substring(0, 20) + '...');
    console.log('✅ VAPID_PRIVATE_KEY:', process.env.VAPID_PRIVATE_KEY.substring(0, 20) + '...');

    webpush.setVapidDetails(
        'mailto:sistemas@donyeyo.com.ar',
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
    console.log('✅ VAPID configurado correctamente');

    // 2. Buscar suscripciones del email
    const [rows] = await pool.query(
        'SELECT id, subscription, created_at FROM push_subscriptions WHERE email = ?',
        [email]
    );

    if (rows.length === 0) {
        console.log(`\n⚠️ No hay suscripciones para ${email}`);
        console.log('   El usuario debe abrir la app y aceptar las notificaciones.');
        pool.end();
        return;
    }

    console.log(`\n📋 Suscripciones para ${email}: ${rows.length}`);
    rows.forEach(r => {
        const sub = JSON.parse(r.subscription);
        console.log(`   - ID ${r.id} | ${r.created_at} | Endpoint: ${sub.endpoint.substring(0, 60)}...`);
    });

    // 3. Enviar notificación de prueba a cada suscripción
    const payload = JSON.stringify({
        title: '🧪 Prueba de Notificación',
        body: `Test enviado a ${email} — ${new Date().toLocaleTimeString('es-AR')}`,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
        data: { url: '/mis-solicitudes' }
    });

    console.log('\n📤 Enviando notificaciones de prueba...');
    for (const row of rows) {
        try {
            const subscription = JSON.parse(row.subscription);
            const result = await webpush.sendNotification(subscription, payload);
            console.log(`   ✅ ID ${row.id}: Enviado OK (HTTP ${result.statusCode})`);
        } catch (err) {
            console.error(`   ❌ ID ${row.id}: Error ${err.statusCode} — ${err.message}`);
            if (err.statusCode === 404 || err.statusCode === 410) {
                console.log(`      ↳ Suscripción expirada. Se recomienda eliminarla de la DB.`);
                await pool.query('DELETE FROM push_subscriptions WHERE id = ?', [row.id]);
                console.log(`      ↳ 🗑️ Eliminada.`);
            }
            if (err.body) console.log('      ↳ Body:', err.body);
        }
    }

    console.log('\n✅ Diagnóstico completado.');
    pool.end();
}

testPush().catch(err => {
    console.error('Error fatal:', err);
    pool.end();
    process.exit(1);
});
