/**
 * Audita todos los usos de NOW() / CURRENT_TIMESTAMP en la DB
 * (triggers, procedures, columns, events)
 * Uso: node audit_timezone.js
 */
require('dotenv').config();
const pool = require('./config/db');

async function main() {
    const db = process.env.DB_NAME;

    console.log('\n══════════════════════════════════════════════');
    console.log('AUDITORÍA DE TIMEZONE EN LA BASE DE DATOS');
    console.log('══════════════════════════════════════════════\n');

    // 1. Timezone actual del servidor MySQL
    const [[tz]] = await pool.query("SELECT @@global.time_zone AS global_tz, @@session.time_zone AS session_tz, NOW() AS ahora_server");
    console.log('🌐 Timezone del servidor MySQL (AWS RDS):');
    console.log(`   @@global.time_zone  = ${tz.global_tz}`);
    console.log(`   @@session.time_zone = ${tz.session_tz}`);
    console.log(`   NOW() en el server  = ${tz.ahora_server}`);
    console.log(`   Hora local real     = ${new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}\n`);

    // 2. Triggers
    const [triggers] = await pool.query(`
        SELECT TRIGGER_NAME, EVENT_MANIPULATION, EVENT_OBJECT_TABLE, 
               ACTION_TIMING, ACTION_STATEMENT
        FROM information_schema.TRIGGERS
        WHERE TRIGGER_SCHEMA = ?`, [db]);

    console.log(`🔁 TRIGGERS encontrados: ${triggers.length}`);
    triggers.forEach(t => {
        const usaNow = /NOW\(\)|CURRENT_TIMESTAMP|SYSDATE\(\)/i.test(t.ACTION_STATEMENT);
        const icon = usaNow ? '⚠️ ' : '✅';
        console.log(`\n  ${icon} ${t.TRIGGER_NAME} (${t.EVENT_TIMING || t.ACTION_TIMING} ${t.EVENT_MANIPULATION} ON ${t.EVENT_OBJECT_TABLE})`);
        if (usaNow) {
            // Mostrar líneas relevantes
            const lines = t.ACTION_STATEMENT.split('\n').filter(l => /NOW\(\)|CURRENT_TIMESTAMP|SYSDATE\(\)/i.test(l));
            lines.forEach(l => console.log(`     → ${l.trim()}`));
        }
    });

    // 3. Stored Procedures / Functions con NOW()
    const [routines] = await pool.query(`
        SELECT ROUTINE_NAME, ROUTINE_TYPE, ROUTINE_DEFINITION
        FROM information_schema.ROUTINES
        WHERE ROUTINE_SCHEMA = ?
          AND ROUTINE_DEFINITION REGEXP 'NOW\\(\\)|CURRENT_TIMESTAMP|SYSDATE\\(\\)'`, [db]);

    console.log(`\n📦 STORED PROCEDURES/FUNCTIONS con NOW(): ${routines.length}`);
    routines.forEach(r => console.log(`   ⚠️  ${r.ROUTINE_TYPE}: ${r.ROUTINE_NAME}`));

    // 4. Columnas con DEFAULT CURRENT_TIMESTAMP o ON UPDATE CURRENT_TIMESTAMP
    const [cols] = await pool.query(`
        SELECT TABLE_NAME, COLUMN_NAME, COLUMN_DEFAULT, EXTRA
        FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = ?
          AND (COLUMN_DEFAULT LIKE '%CURRENT_TIMESTAMP%' 
               OR EXTRA LIKE '%on update CURRENT_TIMESTAMP%')`, [db]);

    console.log(`\n📋 COLUMNAS con DEFAULT CURRENT_TIMESTAMP: ${cols.length}`);
    cols.forEach(c => console.log(`   ⚠️  ${c.TABLE_NAME}.${c.COLUMN_NAME} → DEFAULT: ${c.COLUMN_DEFAULT} | EXTRA: ${c.EXTRA}`));

    console.log('\n══════════════════════════════════════════════');
    console.log('DIAGNÓSTICO: El problema es que @@global.time_zone = SYSTEM');
    console.log('y el servidor RDS de AWS us-east-1 tiene timezone UTC.');
    console.log('══════════════════════════════════════════════\n');

    pool.end();
}

main().catch(e => { console.error(e); pool.end(); });
