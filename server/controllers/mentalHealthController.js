
const geminiAPI = require('../utils/geminiClient');

exports.handleChat = async (req, res) => {
  const { message } = req.body;

  const prompt = `
You are a compassionate mental health assistant.
User says: "${message}"
- Detect stress/anxiety levels.
- Suggest relaxation techniques (breathing, meditation).
- Recommend journaling and positive affirmations.
- Set daily mindfulness reminders.
- Provide emergency support if distress is detected.
Respond empathetically and practically.
`;

  try {
    const aiResponse = await geminiAPI(prompt);
    res.json({ reply: aiResponse });
  } catch (error) {
    console.error("Gemini mental health error:", error);
    res.status(500).json({ error: 'Unable to process request.' });
  }
};
