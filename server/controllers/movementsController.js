const pool = require('../config/db');
const { movementSchema } = require('../validations/movementSchema');

// @desc    Create a new movement
// @route   POST /api/movements
exports.createMovement = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        let validatedData;
        try {
            validatedData = movementSchema.parse(req.body);
        } catch (validationError) {
            return res.status(400).json({ error: 'Validation failed', details: validationError.errors });
        }

        const {
            movement,
            articles = [],
            documents = []
        } = validatedData;

        // 1. Obtener todos los lugares involucrados para verificar esDependencia
        const lugarIds = new Set();
        lugarIds.add(movement.idLugarDestino);
        articles.forEach(a => lugarIds.add(a.idLugarDestino));
        documents.forEach(d => lugarIds.add(d.idLugarDestino));

        const [lugarRows] = await connection.query(
            'SELECT id, esDependencia FROM lugares WHERE id IN (?)',
            [[...lugarIds]]
        );
        const lugarMap = Object.fromEntries(lugarRows.map(r => [r.id, r.esDependencia]));

        // 2. Validar destino principal del movimiento
        if (lugarMap[movement.idLugarDestino] === 0) {
            if (!movement.destinoDetalle || movement.destinoDetalle.trim() === '') {
                await connection.release();
                return res.status(400).json({ error: 'Validation failed', details: [{ message: 'El destino requiere detallar la dirección/lugar' }] });
            }
        }

        // 3. Validar destinatarios de artículos (solo si el destino del artículo es exterior)
        for (const art of articles) {
            if (lugarMap[art.idLugarDestino] === 0 && (!art.destinatario || art.destinatario.trim() === '')) {
                await connection.release();
                return res.status(400).json({
                    error: 'Validation failed',
                    details: [{ message: `Destinatario requerido para el artículo "${art.descripcion}" con destino exterior` }]
                });
            }
        }

        // 4. Validar destinatarios de documentos (solo si el destino del documento es exterior)
        for (const doc of documents) {
            if (lugarMap[doc.idLugarDestino] === 0 && (!doc.destinatario || doc.destinatario.trim() === '')) {
                await connection.release();
                return res.status(400).json({
                    error: 'Validation failed',
                    details: [{ message: `Destinatario requerido para el documento "${doc.descripcion}" con destino exterior` }]
                });
            }
        }

        // Lookup authorizing legajo by email
        const [authRows] = await connection.query('SELECT legajo FROM legajos WHERE email = ?', [movement.usuario_app]);
        if (authRows.length === 0) {
            await connection.release();
            return res.status(403).json({ error: 'Usuario no autorizado para firmar solicitudes (Email no encontrado en legajos)' });
        }
        const personaAutorizanteLegajo = authRows[0].legajo;

        // 1. Insert Movement
        const [movResult] = await connection.query(
            `INSERT INTO movimientos 
            (idGrupo, ordenGrupo, idTipo, personaInterna, idPersonaExterna, fechaHoraRegistro, conRegreso, motivo, personaAutorizante, observacion, idEstado, idLugarOrigen, idLugarDestino, destinoDetalle, usuario_app) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                0, // idGrupo forced to 0
                1, // ordenGrupo forced to 1
                movement.idTipo,
                movement.personaInterna || null,
                movement.idPersonaExterna || null,
                `${movement.fechaHoraRegistro} 00:00:00`,
                movement.conRegreso ? 1 : 0,
                movement.motivo,
                personaAutorizanteLegajo,
                movement.observacion || '',
                1, // idEstado forced to 1 (Pendiente)
                movement.idLugarOrigen,
                movement.idLugarDestino,
                movement.destinoDetalle || '',
                movement.usuario_app
            ]
        );

        const movementId = movResult.insertId;

        // 2. Insert Articles
        if (articles.length > 0) {
            for (const art of articles) {
                await connection.query(
                    `INSERT INTO articulos 
                    (idMovimiento, descripcion, cantidad, idEstado, idLugarOrigen, idLugarDestino, remitente, destinatario, sinRetorno, presentacion, observacion, usuario_app) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        movementId,
                        art.descripcion,
                        art.cantidad || 1,
                        art.idEstado || 1,
                        art.idLugarOrigen || movement.idLugarOrigen,
                        art.idLugarDestino || movement.idLugarDestino,
                        art.remitente || '',
                        art.destinatario || '',
                        art.sinRetorno ? 1 : 0,
                        art.presentacion || 'Unidad(es)',
                        art.observacion || '',
                        movement.usuario_app
                    ]
                );
            }
        }

        // 3. Insert Documents
        if (documents.length > 0) {
            for (const doc of documents) {
                await connection.query(
                    `INSERT INTO documentos 
                    (idMovimiento, descripcion, cantidad, idEstado, tipo, idLugarOrigen, idLugarDestino, remitente, destinatario, sinRetorno, observacion, usuario_app) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        movementId,
                        doc.descripcion || '',
                        doc.cantidad || 1,
                        doc.idEstado || 1,
                        doc.tipo,
                        doc.idLugarOrigen || movement.idLugarOrigen,
                        doc.idLugarDestino || movement.idLugarDestino,
                        doc.remitente || '',
                        doc.destinatario || '',
                        doc.sinRetorno ? 1 : 0,
                        doc.observacion || '',
                        movement.usuario_app
                    ]
                );
            }
        }

        // 4. Invocación de Movimientos Derivados (Capa de Negocio en DB)
        // Solo si es un movimiento marcado "con retorno"
        if (movement.conRegreso) {
            console.log(`Invocando movimientos derivados para ID: ${movementId}`);
            try {
                // El SP sp_GenerarMovimientosDerivados se encarga de:
                // - Crear movimientos de ingreso/regreso según dependencias.
                // - Clonar artículos/documentos con sinRetorno=0.
                await connection.query('CALL sp_GenerarMovimientosDerivados(?)', [movementId]);
            } catch (spError) {
                console.error('Error en Store Procedure sp_GenerarMovimientosDerivados:', spError);
                throw new Error(`Error procesando movimientos derivados: ${spError.message}`);
            }
        }

        await connection.commit();
        res.status(201).json({
            message: movement.conRegreso
                ? 'Solicitud y movimientos derivados generados correctamente'
                : 'Movimiento creado exitosamente',
            id: movementId
        });

    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

// @desc    Get all movements (with basic details)
// @route   GET /api/movements
exports.getMovements = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT m.*, mt.nombre as tipo_nombre, me.nombre as estado_nombre, 
                    lo.nombre as origen_nombre, ld.nombre as destino_nombre,
                    l.apellido_nombre as autorizante_nombre
             FROM movimientos m
             JOIN movimientoTipos mt ON m.idTipo = mt.id
             JOIN movimientoEstados me ON m.idEstado = me.id
             JOIN lugares lo ON m.idLugarOrigen = lo.id
             JOIN lugares ld ON m.idLugarDestino = ld.id
             LEFT JOIN legajos l ON m.personaAutorizante = l.legajo
             ORDER BY m.fechaHoraRegistro DESC`
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
