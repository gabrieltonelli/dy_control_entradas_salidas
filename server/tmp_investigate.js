const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkMovement() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        timezone: '-03:00'
    });

    const email = 'gabrielt@donyeyo.com.ar';

    try {
        console.log('--- MOVIMIENTO 169 ---');
        const [movs] = await pool.query('SELECT * FROM movimientos WHERE id = 169');
        const mov = movs[0];
        if (!mov) {
            console.log('No existe.');
        } else {
            console.log('ID:', mov.id);
            console.log('idLugarOrigen:', mov.idLugarOrigen);
            console.log('idLugarDestino:', mov.idLugarDestino);
            
            console.log('\n--- PORTERIA: ' + email + ' ---');
            const [portRows] = await pool.query(
                `SELECT p.id as idPorteria, p.nombre as porteria_nombre, pd.idLugar, l.nombre as lugar_nombre
                 FROM porterias p
                 LEFT JOIN porteriaDependencias pd ON pd.idPorteria = p.id
                 LEFT JOIN lugares l ON pd.idLugar = l.id
                 WHERE p.email = ? AND p.activa = 1`,
                [email]
            );
            
            if (portRows.length === 0) {
                console.log('No se encontró configuración de portería para este email.');
            } else {
                console.log('Portería encontrada:', portRows[0].porteria_nombre);
                const lugarIds = portRows.map(r => r.idLugar);
                console.log('Lugares controlados IDs:', lugarIds);
                
                console.log('\n--- EVALUACION DE FILTROS ---');
                console.log('1. idEstado = 1 (PENDIENTE):', mov.idEstado === 1 ? 'OK' : 'FAIL (idEstado: ' + mov.idEstado + ')');
                
                const [curdate] = await pool.query('SELECT CURDATE() as hoy');
                const hoyStr = curdate[0].hoy.toISOString().split('T')[0];
                const regStr = mov.fechaHoraRegistro.toISOString().split('T')[0];
                console.log('2. Fecha Registro (' + regStr + ') es HOY (' + hoyStr + '):', regStr === hoyStr ? 'OK' : 'FAIL');
                
                const coincideLugar = lugarIds.includes(mov.idLugarOrigen) || lugarIds.includes(mov.idLugarDestino);
                console.log('3. Algun Lugar coincide:', coincideLugar ? 'OK' : 'FAIL');
                
                if (mov.idGrupo > 0) {
                    const [minRows] = await pool.query(
                        `SELECT MIN(m2.ordenGrupo) as minOrden
                         FROM movimientos m2
                         WHERE m2.idGrupo = ? AND m2.idEstado != 2`,
                        [mov.idGrupo]
                    );
                    const minOrden = minRows[0].minOrden;
                    console.log('4. Es el paso actual del grupo (' + mov.ordenGrupo + ' == ' + minOrden + '):', mov.ordenGrupo === minOrden ? 'OK' : 'FAIL');
                } else {
                    console.log('4. No pertenece a grupo: OK');
                }
            }
        }
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkMovement();
