const express = require('express');
const router = express.Router();
const mastersController = require('../controllers/mastersController');

router.get('/legajos', mastersController.getLegajos);
router.get('/lugares', mastersController.getLugares);
router.get('/movement-types', mastersController.getMovementTypes);
router.get('/movement-states', mastersController.getMovementStates);

module.exports = router;
