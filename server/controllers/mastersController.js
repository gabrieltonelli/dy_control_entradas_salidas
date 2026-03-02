const pool = require('../config/db');

// @desc    Get all legajos
// @route   GET /api/masters/legajos
exports.getLegajos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT legajo, apellido_nombre FROM legajos ORDER BY apellido_nombre');
        res.json(rows);
    } catch (error) {
        console.error('Error in getLegajos:', error);
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get all lugares
// @route   GET /api/masters/lugares
exports.getLugares = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, nombre, esDependencia FROM lugares ORDER BY nombre');
        res.json(rows);
    } catch (error) {
        console.error('Error in getLugares:', error);
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get all movement types
// @route   GET /api/masters/movement-types
exports.getMovementTypes = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM movimientoTipos');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get all movement states
// @route   GET /api/masters/movement-states
exports.getMovementStates = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM movimientoEstados');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// @desc    Get current user legajo info by email
// @route   GET /api/masters/me
exports.getMe = async (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const [rows] = await pool.query('SELECT legajo, apellido_nombre, email FROM legajos WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Legajo not found for this email' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error in getMe:', error);
        res.status(500).json({ error: error.message });
    }
};
