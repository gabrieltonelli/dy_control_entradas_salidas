const fs = require('fs');
const pool = require('./config/db');

pool.query('SHOW CREATE PROCEDURE sp_GenerarMovimientosDerivados').then(([rows]) => {
    fs.writeFileSync('sp_GenerarMovimientosDerivados.sql', rows[0]['Create Procedure']);
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
