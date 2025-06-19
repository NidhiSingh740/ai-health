
const express = require("express");
const router = express.Router();
const { generateMealPlan } = require("../controllers/nutritionController");

router.post("/", generateMealPlan);

module.exports = router;
