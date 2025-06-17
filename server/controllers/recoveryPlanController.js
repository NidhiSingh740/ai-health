const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateRecoveryPlan = async (req, res) => {
  const { diagnosis } = req.body;

  if (!diagnosis) {
    return res.status(400).json({ error: "Diagnosis is required." });
  } 

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });

    const prompt = `
      Based on the diagnosed condition "${diagnosis}", suggest a customized recovery plan including:
      ✅ Hydration & nutrition tips
      ✅ Resting schedule
      ✅ Home remedies
      ✅ Medicine reminders (mention that it's linked to the smart medication reminder system)
      ✅ Mention continuous monitoring and adaptation if needed.
      Respond only in structured JSON format like:
      {
        "hydrationTips": "...",
        "restSchedule": "...",
        "homeRemedies": "...",
        "medicineReminders": "...",
        "monitoringAdvice": "..."
      }
    `;

    const result = await model.generateContent([prompt]);
    const response = await result.response;
    const text = response.text();

    console.log("Gemini response:", text);

    const cleanText = text.replace(/```json|```/g, '').trim();
    const plan = JSON.parse(cleanText);

    res.json({ recoveryPlan: plan });

  } catch (error) {
    console.error("Recovery Plan Error:", error);
    res.status(500).json({
      error: "Failed to generate recovery plan",
      details: error.message || error.toString()
    });
  }
};
