const pool = require('../config/db');
const crypto = require('crypto');


const ESTADO_PENDIENTE = 1;
const ESTADO_COMPLETADO = 2;

// Helper para obtener hoy en formato YYYY-MM-DD ajustado a Argentina
function getHoyArgentina() {
    return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' });
}

// Helper para obtener fecha+hora actual en formato YYYY-MM-DD HH:MM:SS ajustado a Argentina
function getNowArgentina() {
    const now = new Date();
    const str = now.toLocaleString('sv-SE', { timeZone: 'America/Argentina/Buenos_Aires' });
    // sv-SE produce "YYYY-MM-DD HH:MM:SS" directamente
    return str;
}

// ---------------------------------------------------------------
// Helper: obtener los idLugar que controla la portería del email
// ---------------------------------------------------------------
async function getLugaresDePorteria(email) {
    const [rows] = await pool.query(
        `SELECT pd.idLugar
         FROM porterias p
         JOIN porteriaDependencias pd ON pd.idPorteria = p.id
         WHERE p.email = ? AND p.activa = 1`,
        [email]
    );
    return rows.map(r => r.idLugar);
}

// ---------------------------------------------------------------
// @desc  Verificar si un email es de portería (para el guard)
// @route GET /api/porteria/check?email=
// ---------------------------------------------------------------
exports.checkPorteria = async (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Email requerido' });

    try {
        const [rows] = await pool.query(
            'SELECT id, nombre FROM porterias WHERE email = ? AND activa = 1',
            [email]
        );
        if (rows.length === 0) return res.json({ esPortero: false });
        res.json({ esPortero: true, porteria: rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ---------------------------------------------------------------
// @desc  Movimientos pendientes del día para la portería
// @route GET /api/porteria/pendientes?email=
// ---------------------------------------------------------------
exports.getPendientes = async (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Email requerido' });

    try {
        const lugarIds = await getLugaresDePorteria(email);
        const hoy = getHoyArgentina();
        console.log(`[PENDIENTES] User: ${email}, Hoy: ${hoy}, Lugares: ${lugarIds}`);

        if (lugarIds.length === 0) {
            return res.status(403).json({ error: 'Esta cuenta no tiene portería asignada' });
        }

        // Movimientos pendientes cuyo origen o destino es uno de los lugares de la portería.
        // Respeta lógica de grupos: solo el primer paso no completado de cada grupo.
        const [movements] = await pool.query(
            `SELECT m.*,
                    mt.nombre  AS tipo_nombre,
                    me.nombre  AS estado_nombre,
                    lo.nombre  AS origen_nombre,
                    ld.nombre  AS destino_nombre,
                    lp.apellido_nombre  AS persona_interna_nombre,
                    le.apellido_nombre  AS autorizante_nombre,
                    CASE WHEN m.idGrupo > 0
                         THEN (SELECT COUNT(*) FROM movimientos mg WHERE mg.idGrupo = m.idGrupo)
                         ELSE 0 END AS grupo_total,
                    CASE WHEN m.idGrupo > 0
                         THEN (SELECT COUNT(*) FROM movimientos mc WHERE mc.idGrupo = m.idGrupo AND mc.idEstado = ?)
                         ELSE 0 END AS grupo_completados
             FROM movimientos m
             JOIN movimientoTipos    mt ON m.idTipo     = mt.id
             JOIN movimientoEstados  me ON m.idEstado   = me.id
             JOIN lugares            lo ON m.idLugarOrigen  = lo.id
             JOIN lugares            ld ON m.idLugarDestino = ld.id
             LEFT JOIN legajos       lp ON m.personaInterna = lp.legajo
             LEFT JOIN legajos       le ON m.personaAutorizante = le.legajo
             WHERE m.idEstado = ?
               AND DATE(m.fechaHoraRegistro) = ?
               AND (m.idLugarOrigen IN (?) OR m.idLugarDestino IN (?))
               AND (
                   m.idGrupo = 0
                   OR m.ordenGrupo = (
                       SELECT MIN(m2.ordenGrupo)
                       FROM movimientos m2
                       WHERE m2.idGrupo = m.idGrupo
                         AND m2.idEstado != ?
                   )
               )
             ORDER BY m.fechaHoraRegistro ASC`,
            [ESTADO_COMPLETADO, ESTADO_PENDIENTE, getHoyArgentina(), lugarIds, lugarIds, ESTADO_COMPLETADO]
        );

        // Cargar artículos y documentos de cada movimiento
        const ids = movements.map(m => m.id);
        let articulos = [];
        let documentos = [];
        if (ids.length > 0) {
            [articulos] = await pool.query(
                'SELECT * FROM articulos WHERE idMovimiento IN (?) ORDER BY id',
                [ids]
            );
            [documentos] = await pool.query(
                'SELECT * FROM documentos WHERE idMovimiento IN (?) ORDER BY id',
                [ids]
            );
        }

        // Adjuntar artículos y documentos a cada movimiento
        const artByMov = {};
        const docByMov = {};
        articulos.forEach(a => {
            if (!artByMov[a.idMovimiento]) artByMov[a.idMovimiento] = [];
            artByMov[a.idMovimiento].push(a);
        });
        documentos.forEach(d => {
            if (!docByMov[d.idMovimiento]) docByMov[d.idMovimiento] = [];
            docByMov[d.idMovimiento].push(d);
        });

        const result = movements.map(m => ({
            ...m,
            articulos: artByMov[m.id] || [],
            documentos: docByMov[m.id] || [],
        }));

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ---------------------------------------------------------------
// @desc  Completar un movimiento desde la portería
// @route PUT /api/porteria/:id/complete
// ---------------------------------------------------------------
exports.completeMovimiento = async (req, res) => {
    const { id } = req.params;
    const { email, horaCompletado, observacionPorteria, vigilador } = req.body;

    if (!email) return res.status(400).json({ error: 'Email requerido' });

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Verificar que el email es de una portería activa
        const [portRows] = await connection.query(
            'SELECT id FROM porterias WHERE email = ? AND activa = 1',
            [email]
        );
        if (portRows.length === 0) {
            return res.status(403).json({ error: 'Esta cuenta no tiene permisos de portería' });
        }

        // Verificar el movimiento
        const [movRows] = await connection.query(
            'SELECT * FROM movimientos WHERE id = ?',
            [id]
        );
        if (movRows.length === 0) return res.status(404).json({ error: 'Movimiento no encontrado' });
        const mov = movRows[0];

        if (mov.idEstado !== ESTADO_PENDIENTE) {
            return res.status(400).json({ error: 'Solo se pueden completar movimientos en estado "Pendiente"' });
        }

        // Construir fechaHoraCompletado: fecha actual + horaCompletado (HH:MM) en horario Argentina
        let fechaHoraCompletado;
        if (horaCompletado) {
            const today = getHoyArgentina(); // YYYY-MM-DD en hora Argentina
            fechaHoraCompletado = `${today} ${horaCompletado}:00`;
        } else {
            fechaHoraCompletado = getNowArgentina(); // Hora actual Argentina
        }

        await connection.query(
            `UPDATE movimientos
             SET idEstado = ?,
                 fechaHoraRegistro = ?,
                 fechaHoraCompletado = NULL,
                 observacionPorteria = ?,
                 vigilador = ?,
                 usuario_app = ?
             WHERE id = ?`,
            [ESTADO_COMPLETADO, fechaHoraCompletado, observacionPorteria || null, vigilador || null, email, id]
        );

        await connection.commit();
        res.json({ message: 'Movimiento completado correctamente.' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
};

// ---------------------------------------------------------------
// @desc  Historial de movimientos para la portería (con filtros)
// @route GET /api/porteria/historial?email=&desde=&hasta=&estado=&page=
// ---------------------------------------------------------------
exports.getHistorial = async (req, res) => {
    const { email, desde, hasta, estado, page = 1 } = req.query;
    if (!email) return res.status(400).json({ error: 'Email requerido' });

    const pageSize = 50;
    const offset = (Math.max(1, parseInt(page)) - 1) * pageSize;

    try {
        const lugarIds = await getLugaresDePorteria(email);
        if (lugarIds.length === 0) {
            return res.status(403).json({ error: 'Esta cuenta no tiene portería asignada' });
        }

        const params = [];
        let whereExtra = '';

        // Filtro por fechas
        if (desde) { whereExtra += ' AND DATE(m.fechaHoraRegistro) >= ?'; params.push(desde); }
        if (hasta) { whereExtra += ' AND DATE(m.fechaHoraRegistro) <= ?'; params.push(hasta); }

        // Filtro por estado (default: solo completados)
        if (estado && estado !== 'todos') {
            whereExtra += ' AND m.idEstado = ?';
            params.push(parseInt(estado));
        }

        const baseWhere = `
            WHERE (m.idLugarOrigen IN (?) OR m.idLugarDestino IN (?))
            ${whereExtra}
        `;
        const baseParams = [lugarIds, lugarIds, ...params];

        const [[{ total }]] = await pool.query(
            `SELECT COUNT(*) as total
             FROM movimientos m
             ${baseWhere}`,
            baseParams
        );

        const [rows] = await pool.query(
            `SELECT m.*,
                    mt.nombre AS tipo_nombre,
                    me.nombre AS estado_nombre,
                    lo.nombre AS origen_nombre,
                    ld.nombre AS destino_nombre,
                    lp.apellido_nombre AS persona_interna_nombre,
                    le.apellido_nombre AS autorizante_nombre
             FROM movimientos m
             JOIN movimientoTipos   mt ON m.idTipo    = mt.id
             JOIN movimientoEstados me ON m.idEstado  = me.id
             JOIN lugares           lo ON m.idLugarOrigen  = lo.id
             JOIN lugares           ld ON m.idLugarDestino = ld.id
             LEFT JOIN legajos      lp ON m.personaInterna    = lp.legajo
             LEFT JOIN legajos      le ON m.personaAutorizante = le.legajo
             ${baseWhere}
             ORDER BY 
                CASE WHEN m.idEstado = 1 AND DATE(m.fechaHoraRegistro) >= CURDATE() THEN 0 ELSE 1 END,
                m.fechaHoraRegistro DESC
             LIMIT ? OFFSET ?`,
            [...baseParams, pageSize, offset]
        );

        res.json({
            movements: rows,
            pagination: {
                total,
                page: parseInt(page),
                pageSize,
                totalPages: Math.ceil(total / pageSize),
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ---------------------------------------------------------------
// @desc  Validar QR y completar movimiento
// @route POST /api/porteria/scan-qr
// ---------------------------------------------------------------
exports.scanQR = async (req, res) => {
    const { qrData, email, vigilador } = req.body;
    if (!qrData || !email) return res.status(400).json({ error: 'Datos de escaneo incompletos' });

    try {
        if (process.env.ENABLE_QR === 'false') {
            return res.status(403).json({ error: 'El uso de códigos QR está deshabilitado temporalmente.' });
        }
        const secret = process.env.QR_SECRET || 'dy_internal_secret_key_2026_qr';
        
        let id;
        try {
            // Desencriptar el QR (formato esperado: id:hash)
            const parts = qrData.split(':');
            if (parts.length !== 2) throw new Error('Formato inválido');
            
            id = parts[0];
            const receivedHash = parts[1];
            
            const expectedHash = crypto.createHmac('sha256', secret)
                .update(id.toString())
                .digest('hex')
                .substring(0, 10);
                
            if (receivedHash !== expectedHash) {
                return res.status(403).json({ error: 'Código QR inválido o manipulado' });
            }
        } catch (e) {
            return res.status(400).json({ error: 'No se pudo leer el código QR' });
        }

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Verificar portería
            const [portRows] = await connection.query(
                'SELECT id FROM porterias WHERE email = ? AND activa = 1',
                [email]
            );
            if (portRows.length === 0) {
                return res.status(403).json({ error: 'Esta cuenta no tiene permisos de portería' });
            }

            // 2. Verificar movimiento (debe estar PENDIENTE y SER HOY)
            const [movRows] = await connection.query(
                `SELECT * FROM movimientos 
                 WHERE id = ? AND idEstado = ? AND DATE(fechaHoraRegistro) = ?`,
                [id, ESTADO_PENDIENTE, getHoyArgentina()]
            );

            if (movRows.length === 0) {
                return res.status(404).json({ error: 'La autorización no es válida para hoy o ya fue procesada' });
            }

            // 3. Completar usando hora exacta de Argentina
            await connection.query(
                `UPDATE movimientos
                 SET idEstado = ?,
                     fechaHoraRegistro = ?,
                     fechaHoraCompletado = NULL,
                     observacionPorteria = CONCAT(COALESCE(observacionPorteria, ''), ' [Completado vía QR]'),
                     vigilador = ?,
                     usuario_app = ?
                 WHERE id = ?`,
                [ESTADO_COMPLETADO, getNowArgentina(), vigilador || 'SISTEMA QR', email, id]
            );

            await connection.commit();
            
            const requiereFichaje = movRows[0].motivo?.toLowerCase() !== 'requerimiento laboral';
            
            res.json({ 
                message: 'Autorización procesada correctamente vía QR', 
                id, 
                requiereFichaje 
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
