/**
 * Fix script: subsana el movimiento 242
 * ───────────────────────────────────────
 * Problema: movimiento 242 es EGRESO Pellegrini→Hipólito sin retorno,
 * pero le faltó generar el INGRESO en Hipólito (el SP no fue invocado).
 *
 * Acciones:
 *  1. Asigna un nuevo idGrupo al movimiento 242 (orden 1).
 *  2. Inserta el movimiento faltante: INGRESO en Hipólito (orden 2).
 *
 * Uso: node fix_mov_242.js [--dry-run]
 */
require('dotenv').config();
const pool = require('./config/db');

const DRY_RUN = process.argv.includes('--dry-run');

async function main() {
    const conn = await pool.getConnection();
    let released = false;

    const release = () => {
        if (!released) { released = true; conn.release(); pool.end(); }
    };

    try {
        // ─── Leer movimiento 242 ───────────────────────────────────
        const [[mov]] = await conn.query('SELECT * FROM movimientos WHERE id = 242');
        if (!mov) throw new Error('Movimiento 242 no encontrado');

        console.log('\n📋 Movimiento 242 (original):');
        console.log(`   Tipo: ${mov.idTipo} | Estado: ${mov.idEstado} | ConRegreso: ${mov.conRegreso}`);
        console.log(`   Origen: ${mov.idLugarOrigen} → Destino: ${mov.idLugarDestino}`);
        console.log(`   Persona: ${mov.personaInterna} | Autorizante: ${mov.personaAutorizante}`);
        console.log(`   Fecha: ${mov.fechaHoraRegistro}`);

        // ─── Asignar nuevo idGrupo ────────────────────────────────
        const [[{maxGrupo}]] = await conn.query('SELECT MAX(idGrupo) AS maxGrupo FROM movimientos');
        const nuevoGrupo = (maxGrupo || 0) + 1;
        console.log(`\n🔢 Nuevo idGrupo asignado: ${nuevoGrupo}`);

        const ingresoData = {
            idGrupo: nuevoGrupo,
            ordenGrupo: 2,
            idTipo: 2,
            personaInterna: mov.personaInterna,
            idPersonaExterna: mov.idPersonaExterna,
            fechaHoraRegistro: mov.fechaHoraRegistro,
            conRegreso: 0,
            motivo: mov.motivo,
            personaAutorizante: mov.personaAutorizante,
            observacion: mov.observacion || '',
            idEstado: 1,
            idLugarOrigen: mov.idLugarDestino,   // INVERTIDO: Hipólito
            idLugarDestino: mov.idLugarOrigen,   // INVERTIDO: Pellegrini
            destinoDetalle: mov.destinoDetalle || '',
            personaReceptora: mov.personaReceptora,
            usuario_app: mov.usuario_app,
            vigilador: mov.vigilador
        };

        console.log('\n📝 Registro a insertar (INGRESO pendiente en Hipólito):');
        console.log(`   Tipo: ${ingresoData.idTipo} | Estado: ${ingresoData.idEstado}`);
        console.log(`   Origen: ${ingresoData.idLugarOrigen} → Destino: ${ingresoData.idLugarDestino}`);
        console.log(`   idGrupo: ${ingresoData.idGrupo} | ordenGrupo: ${ingresoData.ordenGrupo}`);

        if (DRY_RUN) {
            console.log('\n⚠️  MODO DRY-RUN: no se realizaron cambios en la DB.');
            console.log('   Ejecutar sin --dry-run para aplicar los cambios.');
            release();
            return;
        }

        await conn.beginTransaction();

        await conn.query(
            'UPDATE movimientos SET idGrupo = ?, ordenGrupo = 1 WHERE id = 242',
            [nuevoGrupo]
        );
        console.log(`\n✅ Movimiento 242 actualizado → idGrupo=${nuevoGrupo}, ordenGrupo=1`);

        const [result] = await conn.query(
            `INSERT INTO movimientos 
             (idGrupo, ordenGrupo, idTipo, personaInterna, idPersonaExterna, fechaHoraRegistro,
              conRegreso, motivo, personaAutorizante, observacion, idEstado,
              idLugarOrigen, idLugarDestino, destinoDetalle, personaReceptora, usuario_app, vigilador)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
                ingresoData.idGrupo, ingresoData.ordenGrupo, ingresoData.idTipo,
                ingresoData.personaInterna, ingresoData.idPersonaExterna, ingresoData.fechaHoraRegistro,
                ingresoData.conRegreso, ingresoData.motivo, ingresoData.personaAutorizante,
                ingresoData.observacion, ingresoData.idEstado,
                ingresoData.idLugarOrigen, ingresoData.idLugarDestino, ingresoData.destinoDetalle,
                ingresoData.personaReceptora, ingresoData.usuario_app, ingresoData.vigilador
            ]
        );
        const nuevoId = result.insertId;
        console.log(`✅ Registro INGRESO insertado con ID: ${nuevoId}`);

        await conn.commit();
        console.log('\n🎉 Fix completado correctamente.\n');

        const [grupo] = await conn.query(
            `SELECT m.id, m.ordenGrupo, mt.nombre AS tipo,
                    lo.nombre AS origen, ld.nombre AS destino, me.nombre AS estado
             FROM movimientos m
             JOIN movimientoTipos mt ON mt.id = m.idTipo
             JOIN lugares lo ON lo.id = m.idLugarOrigen
             JOIN lugares ld ON ld.id = m.idLugarDestino
             JOIN movimientoEstados me ON me.id = m.idEstado
             WHERE m.idGrupo = ?
             ORDER BY m.ordenGrupo`, [nuevoGrupo]
        );
        console.log(`📦 Grupo ${nuevoGrupo} — ${grupo.length} movimientos:`);
        grupo.forEach(g => {
            console.log(`   [orden ${g.ordenGrupo}] ID ${g.id}: [${g.tipo}] ${g.origen} → ${g.destino} | ${g.estado}`);
        });

    } catch (err) {
        try { await conn.rollback(); } catch (_) {}
        console.error('\n❌ Error:', err.message);
    } finally {
        release();
    }
}

main();
