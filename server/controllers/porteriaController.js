const pool = require('../config/db');

const ESTADO_PENDIENTE = 1;
const ESTADO_COMPLETADO = 2;

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
               AND DATE(m.fechaHoraRegistro) = CURDATE()
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
            [ESTADO_COMPLETADO, ESTADO_PENDIENTE, lugarIds, lugarIds, ESTADO_COMPLETADO]
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
    const { email, horaCompletado, observacionPorteria } = req.body;

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

        // Construir fechaHoraCompletado: fecha actual + horaCompletado (HH:MM)
        let fechaHoraCompletado;
        if (horaCompletado) {
            const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
            fechaHoraCompletado = `${today} ${horaCompletado}:00`;
        } else {
            // Hora actual si no se especifica
            fechaHoraCompletado = new Date().toISOString().slice(0, 19).replace('T', ' ');
        }

        await connection.query(
            `UPDATE movimientos
             SET idEstado = ?,
                 fechaHoraCompletado = ?,
                 observacionPorteria = ?
             WHERE id = ?`,
            [ESTADO_COMPLETADO, fechaHoraCompletado, observacionPorteria || null, id]
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
             ORDER BY m.fechaHoraRegistro DESC
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
