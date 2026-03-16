const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');

router.get('/vapid-key', notificationsController.getVapidPublicKey);
router.post('/subscribe', notificationsController.subscribe);
router.post('/unsubscribe', notificationsController.unsubscribe);

module.exports = router;
