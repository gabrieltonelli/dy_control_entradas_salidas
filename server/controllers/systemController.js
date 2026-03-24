const { version } = require('../package.json');

exports.getVersion = (req, res) => {
    try {
        res.json({ version });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la versión del sistema' });
    }
};
