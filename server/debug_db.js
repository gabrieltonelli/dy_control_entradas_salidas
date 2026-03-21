const pool = require('./config/db');

async function fixAuditTable() {
    try {
        console.log("Iniciando conversión de la tabla auditoria...");
        
        // El pool tiene session time_zone = '-03:00' por defecto gracias a db.js
        // Modificar de TIMESTAMP a DATETIME hará que MySQL convierta los valores almacenados en UTC
        // a la hora local (-03:00) y los guarde literalmente así, para que no dependan más de la zona
        // horaria del cliente que se conecte (Ej: DBeaver, AWS UTC, etc).
        
        await pool.query("ALTER TABLE auditoria MODIFY fechaHora DATETIME DEFAULT CURRENT_TIMESTAMP");
        console.log("¡Éxito! La columna fechaHora ahora es de tipo DATETIME.");
        
        process.exit(0);
    } catch (err) {
        console.error("Error convirtiendo tabla:", err);
        process.exit(1);
    }
}

fixAuditTable();
