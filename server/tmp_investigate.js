const mysql = require('mysql2/promise');
require('dotenv').config();

function getHoyArgentina() {
    const d = new Date();
    const hoy = d.toLocaleDateString('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' });
    console.log(`[DEBUG DATE] Server Time: ${d.toISOString()}, Hoy Arg: ${hoy}`);
    return hoy;
}

async function checkMovement() {
    console.log('--- REVISANDO LOGICA CLIENTE ---');
    const hoyArg = getHoyArgentina();
    console.log('Hoy Argentina (calculado):', hoyArg);
    
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        timezone: process.env.DB_TIMEZONE || '+00:00'
    });

    try {
        console.log('\n--- MOVIMIENTO 169 ---');
        const [movs] = await pool.query('SELECT * FROM movimientos WHERE id = 169');
        const mov = movs[0];
        if (!mov) {
            console.log('No existe.');
        } else {
            console.log('ID:', mov.id);
            console.log('idEstado:', mov.idEstado);
            console.log('fechaHoraRegistro (RAW):', mov.fechaHoraRegistro);
            
            const [localDateCheck] = await pool.query('SELECT DATE(?) as regDate', [mov.fechaHoraRegistro]);
            const regDateStr = localDateCheck[0].regDate.toISOString().split('T')[0];
            
            console.log('Fecha Registro (YYYY-MM-DD):', regDateStr);
            console.log('Coincide con Hoy Arg (' + hoyArg + '):', regDateStr === hoyArg);

            if (mov.idGrupo > 0) {
                const [minRows] = await pool.query(
                    `SELECT MIN(m2.ordenGrupo) as minOrden
                     FROM movimientos m2
                     WHERE m2.idGrupo = ? AND m2.idEstado != 2`,
                    [mov.idGrupo]
                );
                const minOrden = minRows[0].minOrden;
                console.log('idGrupo:', mov.idGrupo);
                console.log('ordenGrupo (Este registro):', mov.ordenGrupo);
                console.log('minOrden (Siguiente pendiente):', minOrden);
                console.log('¿Es el que debe mostrarse?:', mov.ordenGrupo === minOrden);
            } else {
                console.log('No pertenece a un grupo.');
            }

            const email = 'gabrielt@donyeyo.com.ar';
            console.log('\n--- PORTERIA: ' + email + ' ---');
            const [portRows] = await pool.query(
                `SELECT pd.idLugar, l.nombre
                 FROM porterias p
                 JOIN porteriaDependencias pd ON pd.idPorteria = p.id
                 JOIN lugares l ON pd.idLugar = l.id
                 WHERE p.email = ? AND p.activa = 1`,
                [email]
            );
            console.log('Lugares controlados:', portRows.map(r => `${r.idLugar} (${r.nombre})`));
            
            const lugarIds = portRows.map(r => r.idLugar);
            console.log('Origen habilitado:', lugarIds.includes(mov.idLugarOrigen));
            console.log('Destino habilitado:', lugarIds.includes(mov.idLugarDestino));
        }
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkMovement();
