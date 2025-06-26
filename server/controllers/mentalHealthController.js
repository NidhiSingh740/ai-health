const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.handleChat = async (req, res) => {
  const { message, userMood, stressTriggers, mentalHealthHistory } = req.body;

  // Validate input
  if (!message) {
    return res.status(400).json({ error: "User message is required." });
  }

  // Dynamic personalized intro
  const intro = `You are a compassionate and professional AI mental health assistant. Your task is to support the user's mental well-being with empathy, positivity, and practical advice.`;

  // Build user context
  const userContext = [
    `User Message: "${message}"`,
    userMood ? `Current Mood: ${userMood}` : null,
    stressTriggers ? `Stress Triggers: ${stressTriggers}` : null,
    mentalHealthHistory ? `Mental Health History: ${mentalHealthHistory}` : null
  ].filter(Boolean).join('\n');

  // Prompt
  const prompt = `
${intro}

User Context:
${userContext}

Please provide:
1. Emotional tone analysis (e.g., calm, anxious, stressed).
2. Practical relaxation techniques (breathing, grounding, mindfulness).
3. Motivational journaling prompts or affirmations.
4. Simple daily mindfulness or self-care reminders.
5. If signs of severe distress are detected, suggest seeking professional or emergency help.

Respond kindly and clearly in plain text only (no markdown or code).
`;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-preview-05-20"
    });

    const result = await model.generateContent(prompt);
    const aiReply = await result.response.text();

    if (!aiReply || aiReply.length < 10) {
      return res.status(500).json({ error: "Invalid response from AI. Please try again later." });
    }

    res.json({ reply: aiReply });
  } catch (error) {
    console.error("Gemini Mental Health Support Error:", error);
    res.status(500).json({ error: "Something went wrong with the AI service." });
  }
};
