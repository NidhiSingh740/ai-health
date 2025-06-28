// server/router/symptomChecker.js

const express = require('express');
const router = express.Router();
const { checkSymptoms } = require('../controllers/symptomCheckerController');

router.post('/check', checkSymptoms);

module.exports = router;
