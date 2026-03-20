const pool = require('./config/db');

async function inspect() {
    try {
        const [rows] = await pool.query('DESCRIBE legajos');
        console.log(JSON.stringify(rows, null, 2));
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

inspect();
