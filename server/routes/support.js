const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');

router.post('/feedback', supportController.createFeedback);
router.get('/faqs', supportController.getFaqs);
router.get('/videos', supportController.getVideos);

module.exports = router;
