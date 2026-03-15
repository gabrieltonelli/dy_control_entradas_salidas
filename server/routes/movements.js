const express = require('express');
const router = express.Router();
const movementsController = require('../controllers/movementsController');

router.post('/', movementsController.createMovement);
router.get('/', movementsController.getMovements);
router.get('/mis-solicitudes', movementsController.getMisSolicitudes);
router.get('/:id/status', movementsController.getMovementStatus);
router.put('/:id/approve', movementsController.approveMovement);
router.put('/:id/reject', movementsController.rejectMovement);
router.put('/:id/cancel', movementsController.cancelMovement);

module.exports = router;
