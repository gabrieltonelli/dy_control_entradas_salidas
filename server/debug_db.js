const pool = require('./config/db');

async function checkRecentAudit() {
    try {
        const [rows] = await pool.query('SELECT id, fechaHora FROM auditoria ORDER BY id DESC LIMIT 5');
        console.log("RECIENTES EN AUDITORIA:");
        rows.forEach(r => console.log(`ID: ${r.id} | Fecha: ${r.fechaHora}`));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkRecentAudit();
