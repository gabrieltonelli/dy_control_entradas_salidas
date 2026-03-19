require('dotenv').config();
const pool = require('./config/db');

(async () => {
    const db = process.env.DB_NAME;

    const [[r]] = await pool.query("SELECT @@global.time_zone AS g, @@session.time_zone AS s, NOW() AS now");
    console.log("=== SERVER TIMEZONE ===");
    console.log("global:", r.g);
    console.log("session:", r.s);
    console.log("NOW():", r.now);
    console.log("Node hora AR:", new Date().toLocaleString('sv-SE', {timeZone:'America/Argentina/Buenos_Aires'}));

    console.log("\n=== TRIGGERS ===");
    const [tr] = await pool.query(
        "SELECT TRIGGER_NAME, EVENT_OBJECT_TABLE, ACTION_STATEMENT FROM information_schema.TRIGGERS WHERE TRIGGER_SCHEMA=?", [db]
    );
    tr.forEach(t => {
        const usaNow = /NOW\(\)|CURRENT_TIMESTAMP|SYSDATE/i.test(t.ACTION_STATEMENT);
        console.log((usaNow ? "USES_NOW" : "ok") + " | " + t.TRIGGER_NAME + " | " + t.EVENT_OBJECT_TABLE);
        if (usaNow) {
            t.ACTION_STATEMENT.split('\n')
                .filter(l => /NOW\(\)|CURRENT_TIMESTAMP|SYSDATE/i.test(l))
                .forEach(l => console.log("       > " + l.trim()));
        }
    });

    console.log("\n=== COLUMNAS CON TIMESTAMP AUTOMÁTICO ===");
    const [cols] = await pool.query(
        "SELECT TABLE_NAME, COLUMN_NAME, COLUMN_DEFAULT, EXTRA FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=? AND (COLUMN_DEFAULT LIKE '%CURRENT_TIMESTAMP%' OR EXTRA LIKE '%on update%')",
        [db]
    );
    cols.forEach(c => console.log(c.TABLE_NAME + "." + c.COLUMN_NAME + " | DEFAULT=" + c.COLUMN_DEFAULT + " | EXTRA=" + c.EXTRA));

    console.log("\n=== STORED PROCEDURES con NOW() ===");
    const [sp] = await pool.query(
        "SELECT ROUTINE_NAME, ROUTINE_TYPE FROM information_schema.ROUTINES WHERE ROUTINE_SCHEMA=? AND ROUTINE_DEFINITION REGEXP 'NOW|CURRENT_TIMESTAMP'",
        [db]
    );
    sp.forEach(p => console.log(p.ROUTINE_TYPE + ": " + p.ROUTINE_NAME));

    pool.end();
})().catch(e => { console.error(e.message); pool.end(); });
