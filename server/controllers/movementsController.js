const pool = require('../config/db');

// @desc    Create a new movement
// @route   POST /api/movements
exports.createMovement = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const {
            movement,
            articles = [],
            documents = []
        } = req.body;

        // 1. Insert Movement
        const [movResult] = await connection.query(
            `INSERT INTO movimientos 
            (idGrupo, idTipo, personaInterna, idPersonaExterna, conRegreso, motivo, personaAutorizante, observacion, idLugarOrigen, idLugarDestino, destinoDetalle, usuario_app) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                movement.idGrupo || 0,
                movement.idTipo,
                movement.personaInterna || null,
                movement.idPersonaExterna || null,
                movement.conRegreso ? 1 : 0,
                movement.motivo,
                movement.personaAutorizante,
                movement.observacion || '',
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

        await connection.commit();
        res.status(201).json({
            message: 'Movement created successfully',
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
