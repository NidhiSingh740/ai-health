const express = require('express');
const router = express.Router();

// 👇 Make sure you're importing the actual function
const { generateRecoveryPlan } = require('../controllers/recoveryPlanController');

// 👇 Route definition: pass the function, not an object
router.post('/generate', generateRecoveryPlan);

module.exports = router;
