const express = require('express');
const router = express.Router();
const movementsController = require('../controllers/movementsController');

router.post('/', movementsController.createMovement);
router.get('/', movementsController.getMovements);

module.exports = router;
