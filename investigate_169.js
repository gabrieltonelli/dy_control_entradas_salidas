const mysql = require('mysql2/promise');
require('dotenv').config({ path: 'c:/Users/gabrielt/OneDrive - Don Yeyo S.A/Documentos/Proyectos/dy_control_entradas_salidas/server/.env' });

async function checkMovement() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
    });

    try {
        console.log('--- MOVIMIENTO 169 ---');
        const [movs] = await pool.query('SELECT * FROM movimientos WHERE id = 169');
        console.log(JSON.stringify(movs[0], null, 2));

        if (movs[0]) {
            console.log('\n--- LUGARES DEL MOVIMIENTO ---');
            const [lugares] = await pool.query('SELECT id, nombre FROM lugares WHERE id IN (?, ?)', [movs[0].idLugarOrigen, movs[0].idLugarDestino]);
            console.log(lugares);
        }

        console.log('\n--- PORTERIAS Y SUS LUGARES ---');
        const [porterias] = await pool.query('SELECT * FROM porterias');
        console.log('Porterias:', porterias);

        const [pl] = await pool.query('SELECT pl.*, l.nombre as lugar_nombre, p.email FROM porterias_lugares pl JOIN lugares l ON pl.idLugar = l.id JOIN porterias p ON pl.idPorteria = p.id');
        console.log('Porterias-Lugares Mapping:', pl);

        console.log('\n--- ESTADOS ---');
        const [estados] = await pool.query('SELECT * FROM estados_movimientos');
        console.log(estados);

    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkMovement();
