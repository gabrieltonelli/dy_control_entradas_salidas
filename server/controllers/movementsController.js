const pool = require('../config/db');
const { movementSchema } = require('../validations/movementSchema');

// Estado IDs
const ESTADO_PENDIENTE = 1;
const ESTADO_SOLICITADO = 4;
const ESTADO_RECHAZADO = 5;

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

        // Lookup usuario actual en legajos
        const [userRows] = await connection.query(
            'SELECT legajo, esAutorizador FROM legajos WHERE email = ?',
            [movement.usuario_app]
        );
        if (userRows.length === 0) {
            await connection.release();
            return res.status(403).json({ error: 'Usuario no autorizado para firmar solicitudes (Email no encontrado en legajos)' });
        }
        const currentUserLegajo = userRows[0].legajo;
        const currentUserEsAutorizador = userRows[0].esAutorizador === 1;

        // Determinar autorizante y estado inicial
        let personaAutorizanteLegajo;
        let idEstadoInicial;

        if (currentUserEsAutorizador) {
            // El creador es autorizador: se auto-autoriza, estado Pendiente
            personaAutorizanteLegajo = currentUserLegajo;
            idEstadoInicial = ESTADO_PENDIENTE;
        } else {
            // El creador no es autorizador: requiere un autorizante externo, estado Solicitado
            // personaAutorizante viene del body (seleccionado por el usuario en el form)
            if (!movement.personaAutorizante) {
                await connection.release();
                return res.status(400).json({ error: 'Validation failed', details: [{ message: 'Debe seleccionar un autorizante para el movimiento' }] });
            }
            // Verificar que el autorizante efectivamente lo sea
            const [authRows] = await connection.query(
                'SELECT legajo, esAutorizador FROM legajos WHERE legajo = ?',
                [movement.personaAutorizante]
            );
            if (authRows.length === 0 || authRows[0].esAutorizador !== 1) {
                await connection.release();
                return res.status(400).json({ error: 'Validation failed', details: [{ message: 'El autorizante seleccionado no tiene permisos de autorización' }] });
            }
            personaAutorizanteLegajo = movement.personaAutorizante;
            idEstadoInicial = ESTADO_SOLICITADO;
        }

        // 5. Insert Movement
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
                idEstadoInicial,
                movement.idLugarOrigen,
                movement.idLugarDestino,
                movement.destinoDetalle || '',
                movement.usuario_app
            ]
        );

        const movementId = movResult.insertId;

        // 6. Insert Articles
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

        // 7. Insert Documents
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

        // 8. Invocación de Movimientos Derivados (solo si es con retorno Y ya está en estado Pendiente)
        if (movement.conRegreso && idEstadoInicial === ESTADO_PENDIENTE) {
            console.log(`Invocando movimientos derivados para ID: ${movementId}`);
            try {
                await connection.query('CALL sp_GenerarMovimientosDerivados(?)', [movementId]);
            } catch (spError) {
                console.error('Error en Store Procedure sp_GenerarMovimientosDerivados:', spError);
                throw new Error(`Error procesando movimientos derivados: ${spError.message}`);
            }
        }

        await connection.commit();

        const statusMsg = idEstadoInicial === ESTADO_SOLICITADO
            ? 'Solicitud enviada al autorizante. Quedará en estado "Solicitado" hasta ser aprobada.'
            : (movement.conRegreso
                ? 'Solicitud y movimientos derivados generados correctamente'
                : 'Movimiento creado exitosamente');

        res.status(201).json({
            message: statusMsg,
            id: movementId,
            estado: idEstadoInicial
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
                    l.apellido_nombre as autorizante_nombre,
                    lp.apellido_nombre as persona_interna_nombre
             FROM movimientos m
             JOIN movimientoTipos mt ON m.idTipo = mt.id
             JOIN movimientoEstados me ON m.idEstado = me.id
             JOIN lugares lo ON m.idLugarOrigen = lo.id
             JOIN lugares ld ON m.idLugarDestino = ld.id
             LEFT JOIN legajos l ON m.personaAutorizante = l.legajo
             LEFT JOIN legajos lp ON m.personaInterna = lp.legajo
             ORDER BY m.fechaHoraRegistro DESC`
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get movements for the current user (paginated)
//          - Movements created by the user (all states)
//          - Movements pending authorization by the user (if authorizer)
// @route   GET /api/movements/mis-solicitudes?email=...&page=1&filtro=todos
exports.getMisSolicitudes = async (req, res) => {
    const { email, filtro = 'todos' } = req.query;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    // Paginación
    const pageSize = parseInt(process.env.PAGE_SIZE_SOLICITUDES) || 20;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const offset = (page - 1) * pageSize;

    try {
        // Get user legajo
        const [userRows] = await pool.query(
            'SELECT legajo, esAutorizador FROM legajos WHERE email = ?',
            [email]
        );
        if (userRows.length === 0) return res.status(404).json({ error: 'User not found' });

        const { legajo, esAutorizador } = userRows[0];

        // Construir condición WHERE y parámetros según rol y filtro
        let whereClause;
        let whereParams;

        if (esAutorizador) {
            whereClause = '(m.usuario_app = ? OR m.personaAutorizante = ?)';
            whereParams = [email, legajo];
        } else {
            whereClause = 'm.usuario_app = ?';
            whereParams = [email];
        }

        // Filtro adicional por estado
        const filtroMap = {
            'solicitado': 4,
            'pendiente': 1,
            'completado': 2,
            'rechazado': 5,
            'vencido': 3,
            'accion': 4, // = solicitado, para autorizadores
        };
        if (filtroMap[filtro] !== undefined) {
            whereClause += ' AND m.idEstado = ?';
            whereParams.push(filtroMap[filtro]);
        }

        const baseQuery = `
            FROM movimientos m
            JOIN movimientoTipos mt ON m.idTipo = mt.id
            JOIN movimientoEstados me ON m.idEstado = me.id
            JOIN lugares lo ON m.idLugarOrigen = lo.id
            JOIN lugares ld ON m.idLugarDestino = ld.id
            LEFT JOIN legajos l ON m.personaAutorizante = l.legajo
            LEFT JOIN legajos lp ON m.personaInterna = lp.legajo
            WHERE ${whereClause}`;

        // Total para paginación
        const [[{ total }]] = await pool.query(
            `SELECT COUNT(*) as total ${baseQuery}`,
            whereParams
        );

        // Datos paginados
        const [rows] = await pool.query(
            `SELECT m.*, mt.nombre as tipo_nombre, me.nombre as estado_nombre,
                    lo.nombre as origen_nombre, ld.nombre as destino_nombre,
                    l.apellido_nombre as autorizante_nombre,
                    lp.apellido_nombre as persona_interna_nombre
             ${baseQuery}
             ORDER BY m.fechaHoraRegistro DESC
             LIMIT ? OFFSET ?`,
            [...whereParams, pageSize, offset]
        );

        // Contar solicitados pendientes de acción (siempre sin filtrar, para el badge)
        let pendingActionCount = 0;
        if (esAutorizador) {
            const [[{ cnt }]] = await pool.query(
                `SELECT COUNT(*) as cnt FROM movimientos m
                 WHERE m.personaAutorizante = ? AND m.idEstado = 4`,
                [legajo]
            );
            pendingActionCount = cnt;
        }

        res.json({
            movements: rows,
            esAutorizador: esAutorizador === 1,
            pendingActionCount,
            pagination: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize)
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Approve a movement (only for authorizers)
// @route   PUT /api/movements/:id/approve
exports.approveMovement = async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: 'Email is required' });

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Verify authorizer
        const [userRows] = await connection.query(
            'SELECT legajo, esAutorizador FROM legajos WHERE email = ?',
            [email]
        );
        if (userRows.length === 0 || !userRows[0].esAutorizador) {
            return res.status(403).json({ error: 'No tiene permisos de autorización' });
        }
        const authLegajo = userRows[0].legajo;

        // Get movement
        const [movRows] = await connection.query(
            'SELECT * FROM movimientos WHERE id = ?',
            [id]
        );
        if (movRows.length === 0) return res.status(404).json({ error: 'Movimiento no encontrado' });

        const mov = movRows[0];

        // Only movements in "Solicitado" state can be approved
        if (mov.idEstado !== ESTADO_SOLICITADO) {
            return res.status(400).json({ error: 'Solo se pueden aprobar movimientos en estado "Solicitado"' });
        }

        // Verify this authorizer is the assigned one
        if (mov.personaAutorizante !== authLegajo) {
            return res.status(403).json({ error: 'Usted no es el autorizante asignado a este movimiento' });
        }

        // Update to Pendiente
        await connection.query(
            'UPDATE movimientos SET idEstado = ? WHERE id = ?',
            [ESTADO_PENDIENTE, id]
        );

        // If conRegreso, generate derived movements now
        if (mov.conRegreso) {
            try {
                await connection.query('CALL sp_GenerarMovimientosDerivados(?)', [parseInt(id)]);
            } catch (spError) {
                console.error('Error en SP al aprobar:', spError);
                throw new Error(`Error al generar movimientos derivados: ${spError.message}`);
            }
        }

        await connection.commit();
        res.json({ message: 'Movimiento aprobado correctamente. Estado: Pendiente.' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

// @desc    Reject a movement (only for authorizers)
// @route   PUT /api/movements/:id/reject
exports.rejectMovement = async (req, res) => {
    const { id } = req.params;
    const { email, observacion } = req.body;

    if (!email) return res.status(400).json({ error: 'Email is required' });

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Verify authorizer
        const [userRows] = await connection.query(
            'SELECT legajo, esAutorizador FROM legajos WHERE email = ?',
            [email]
        );
        if (userRows.length === 0 || !userRows[0].esAutorizador) {
            return res.status(403).json({ error: 'No tiene permisos de autorización' });
        }
        const authLegajo = userRows[0].legajo;

        // Get movement
        const [movRows] = await connection.query(
            'SELECT * FROM movimientos WHERE id = ?',
            [id]
        );
        if (movRows.length === 0) return res.status(404).json({ error: 'Movimiento no encontrado' });

        const mov = movRows[0];

        // Only Solicitado or Pendiente can be rejected
        if (mov.idEstado !== ESTADO_SOLICITADO && mov.idEstado !== ESTADO_PENDIENTE) {
            return res.status(400).json({ error: 'Solo se pueden rechazar movimientos en estado "Solicitado" o "Pendiente"' });
        }

        // Verify this authorizer is the assigned one
        if (mov.personaAutorizante !== authLegajo) {
            return res.status(403).json({ error: 'Usted no es el autorizante asignado a este movimiento' });
        }

        // Update to Rechazado, optionally update observacion
        const newObs = observacion
            ? `[RECHAZADO] ${observacion}`
            : (mov.observacion ? `[RECHAZADO] ${mov.observacion}` : '[RECHAZADO]');

        await connection.query(
            'UPDATE movimientos SET idEstado = ?, observacion = ? WHERE id = ?',
            [ESTADO_RECHAZADO, newObs, id]
        );

        await connection.commit();
        res.json({ message: 'Movimiento rechazado.' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};
