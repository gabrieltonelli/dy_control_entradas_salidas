const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixTriggers() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });

        console.log('--- Iniciando corrección de Triggers ---');
        console.log(`Conectado a: ${process.env.DB_NAME}`);

        // 1. Obtener lista de triggers
        const [triggers] = await connection.query('SHOW TRIGGERS');

        for (const trg of triggers) {
            const triggerName = trg.Trigger;
            console.log(`\nProcesando: ${triggerName}...`);

            // 2. Obtener la definición actual
            const [[createStmt]] = await connection.query(`SHOW CREATE TRIGGER \`${triggerName}\``);
            let sql = createStmt['SQL Original Statement'] || createStmt['Create Trigger'];

            // 3. Limpiar el DEFINER para hacerlo agnóstico (se usará el usuario actual)
            // Esto elimina la parte "DEFINER=`usuario`@`host`"
            const cleanedSql = sql.replace(/DEFINER\s*=\s*`[^`]+`@`[^`]+`/i, 'DEFINER = CURRENT_USER');

            try {
                // 4. Borrar y recrear
                await connection.query(`DROP TRIGGER IF EXISTS \`${triggerName}\``);
                await connection.query(cleanedSql);
                console.log(`✅ Recreado exitosamente con DEFINER = CURRENT_USER`);
            } catch (err) {
                console.error(`❌ Error al recrear ${triggerName}:`, err.message);
            }
        }

        console.log('\n--- Proceso finalizado ---');

    } catch (error) {
        console.error('Error fatal:', error.message);
    } finally {
        if (connection) await connection.end();
    }
}

fixTriggers();
