const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
const masterRoutes = require('./routes/masters');
const movementRoutes = require('./routes/movements');

app.use('/api/masters', masterRoutes);
app.use('/api/movements', movementRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Control de Ingresos y Egresos API' });
});

// Basic error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

if (process.env.NODE_ENV !== 'production' || !process.env.NETLIFY) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
