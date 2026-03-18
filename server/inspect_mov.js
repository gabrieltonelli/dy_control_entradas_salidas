require('dotenv').config();
const pool = require('./config/db');

async function main() {
    const movId = process.argv[2] || 242;

    // 1. Datos del movimiento principal
    const [movRows] = await pool.query(`
        SELECT m.*, 
               mt.nombre AS tipo_nombre,
               me.nombre AS estado_nombre,
               lo.nombre AS origen_nombre,
               ld.nombre AS destino_nombre,
               lp.apellido_nombre AS persona_nombre,
               la.apellido_nombre AS autorizante_nombre
        FROM movimientos m
        JOIN movimientoTipos mt ON m.idTipo = mt.id
        JOIN movimientoEstados me ON m.idEstado = me.id
        JOIN lugares lo ON m.idLugarOrigen = lo.id
        JOIN lugares ld ON m.idLugarDestino = ld.id
        LEFT JOIN legajos lp ON lp.legajo = m.personaInterna
        LEFT JOIN legajos la ON la.legajo = m.personaAutorizante
        WHERE m.id = ?`, [movId]);

    if (!movRows.length) { console.error(`Movimiento ${movId} no encontrado`); pool.end(); return; }
    
    const mov = movRows[0];
    console.log('\n══════════════════════════════════════════════');
    console.log(`MOVIMIENTO #${movId}`);
    console.log('══════════════════════════════════════════════');
    console.log(`Tipo:           ${mov.tipo_nombre}`);
    console.log(`Estado:         ${mov.estado_nombre}`);
    console.log(`Persona:        ${mov.persona_nombre} (legajo ${mov.personaInterna})`);
    console.log(`Autorizante:    ${mov.autorizante_nombre}`);
    console.log(`Origen:         ${mov.origen_nombre} (ID ${mov.idLugarOrigen})`);
    console.log(`Destino:        ${mov.destino_nombre} (ID ${mov.idLugarDestino})`);
    console.log(`Con Regreso:    ${mov.conRegreso ? 'SÍ' : 'NO'}`);
    console.log(`idGrupo:        ${mov.idGrupo}`);
    console.log(`ordenGrupo:     ${mov.ordenGrupo}`);
    console.log(`Fecha Registro: ${mov.fechaHoraRegistro}`);

    // 2. Si tiene grupo, mostrar todos los del grupo
    if (mov.idGrupo > 0) {
        const [grupo] = await pool.query(`
            SELECT m.id, m.ordenGrupo, m.idLugarOrigen, m.idLugarDestino,
                   lo.nombre AS origen, ld.nombre AS destino,
                   me.nombre AS estado, m.conRegreso
            FROM movimientos m
            JOIN lugares lo ON lo.id = m.idLugarOrigen
            JOIN lugares ld ON ld.id = m.idLugarDestino
            JOIN movimientoEstados me ON me.id = m.idEstado
            WHERE m.idGrupo = ?
            ORDER BY m.ordenGrupo`, [mov.idGrupo]);

        console.log(`\n📦 GRUPO ${mov.idGrupo} — ${grupo.length} movimiento(s):`);
        grupo.forEach(g => {
            const marker = g.id == movId ? '→' : '  ';
            console.log(`  ${marker} [orden ${g.ordenGrupo}] ID ${g.id}: ${g.origen} → ${g.destino} | Estado: ${g.estado} | ConRegreso: ${g.conRegreso}`);
        });
    } else {
        console.log('\n⚠️  Este movimiento no tiene grupo asignado (idGrupo = 0).');
    }

    // 3. Mostrar tipos de movimiento disponibles
    const [tipos] = await pool.query('SELECT id, nombre FROM movimientoTipos ORDER BY id');
    console.log('\n📋 Tipos de movimiento en DB:');
    tipos.forEach(t => console.log(`  [${t.id}] ${t.nombre}`));

    // 4. Mostrar lugares disponibles
    const [lugares] = await pool.query('SELECT id, nombre FROM lugares ORDER BY id');
    console.log('\n📍 Lugares en DB:');
    lugares.forEach(l => console.log(`  [${l.id}] ${l.nombre}`));

    pool.end();
}

main().catch(e => { console.error(e); pool.end(); });
