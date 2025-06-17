
const geminiAPI = require('../utils/geminiClient');

const askDoctorBot = async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "Question is required" });
  }

  const prompt = `You are a medical assistant. The user asks: "${question}". Provide useful, research-backed answers, and mention home remedies, medicine if needed, and whether to see a doctor.`;

  const answer = await geminiAPI(prompt);

  res.json({ answer });
};

module.exports = { askDoctorBot };
