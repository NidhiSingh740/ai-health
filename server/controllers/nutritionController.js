
const geminiAPI = require("../utils/geminiClient");

exports.generateMealPlan = async (req, res) => {
  const { healthConditions, preferences, goal, progressFeedback } = req.body;

  let prompt = `
You are a dietitian AI. The user has:
- Health conditions: ${healthConditions || "none"}
- Dietary preferences: ${preferences || "none"}
- Goals: ${goal}

1. Provide a 7-day meal plan (breakfast, lunch, dinner).
2. Include healthy recipes for each meal.
3. Calculate approximate daily calories.
4. Suggestions for meal reminders.
${progressFeedback ? `5. Adjust plan based on feedback: ${progressFeedback}` : ""}
`;

  try {
    const plan = await geminiAPI(prompt);
    res.json({ plan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini error generating meal plan" });
  }
};
