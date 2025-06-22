
const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/mentalHealthController');

router.post('/', handleChat);

module.exports = router;
