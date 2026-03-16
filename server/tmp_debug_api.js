const mysql = require('mysql2/promise');
require('dotenv').config();

function getHoyArgentina() {
    return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' });
}

async function checkMovement() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        timezone: process.env.DB_TIMEZONE || '+00:00'
    });

    try {
        const [check] = await pool.query(
            `SELECT m.id, m.idTipo, m.idEstado, m.idLugarOrigen, m.idLugarDestino,
                    (SELECT COUNT(*) FROM movimientoTipos WHERE id = m.idTipo) as tipoExists,
                    (SELECT COUNT(*) FROM movimientoEstados WHERE id = m.idEstado) as estadoExists,
                    (SELECT COUNT(*) FROM lugares WHERE id = m.idLugarOrigen) as origenExists,
                    (SELECT COUNT(*) FROM lugares WHERE id = m.idLugarDestino) as destinoExists
             FROM movimientos m WHERE m.id = 169`
        );
        console.log('Integridad referencial:', check[0]);
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkMovement();
