const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateMealPlan = async (req, res) => {
  const { healthConditions, preferences, goal, progressFeedback } = req.body;

  // Validate required input
  if (!goal || (!healthConditions && !preferences)) {
    return res.status(400).json({ error: "Please provide goal and at least one of health conditions or preferences." });
  }

  // Dynamic personalized intro
  const intro = `You are a professional dietitian AI. A user is seeking a 7-day personalized nutrition and diet plan.`;

  const profileDetails = [
    healthConditions ? `Health conditions: ${healthConditions}` : null,
    preferences ? `Dietary preferences: ${preferences}` : null,
    goal ? `Goal: ${goal}` : null,
    progressFeedback ? `User's progress/feedback: ${progressFeedback}` : null
  ].filter(Boolean).join('\n');

  // Define prompt
  const prompt = `
${intro}

User Profile:
${profileDetails}

Please generate a detailed meal plan in plain text with the following sections:
1. A 7-day meal plan (each day must have breakfast, lunch, dinner).
2. Simple healthy recipes for each meal.
3. Approximate daily calorie count.
4. Tips for staying consistent and reminders.
ONLY return structured plain text, no JSON or markdown or code.
`;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-preview-05-20"
    });

    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();

    if (!responseText || responseText.length < 10) {
      return res.status(500).json({ error: "Invalid response from AI. Please try again later." });
    }

    return res.json({ plan: responseText });
  } catch (err) {
    console.error("Gemini Meal Plan Error:", err);
    return res.status(500).json({ error: "Something went wrong with the AI service." });
  }
};
