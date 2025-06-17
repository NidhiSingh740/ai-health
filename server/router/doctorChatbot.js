
const express = require('express');
const router = express.Router();
const { askDoctorBot } = require('../controllers/doctorChatbotController');

router.post('/', askDoctorBot);

module.exports = router;
