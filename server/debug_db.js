const pool = require('./config/db');

async function fixPorteria() {
    try {
        console.log("Activando portería de Gabriel y asignando lugar 2...");
        
        // 1. Activar la portería
        await pool.query("UPDATE porterias SET activa = 1 WHERE email = 'gabrielt@donyeyo.com.ar'");
        
        // 2. Obtener el ID
        const [rows] = await pool.query("SELECT id FROM porterias WHERE email = 'gabrielt@donyeyo.com.ar'");
        if (rows.length > 0) {
            const idPorteria = rows[0].id;
            // 3. Asegurar que tenga el lugar 2
            await pool.query("INSERT IGNORE INTO porteriaDependencias (idPorteria, idLugar) VALUES (?, 2)", [idPorteria]);
            console.log(`Portería ${idPorteria} (Gabriel) activada y vinculada al lugar 2.`);
        } else {
            console.log("No se encontró la portería de Gabriel.");
        }
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixPorteria();
