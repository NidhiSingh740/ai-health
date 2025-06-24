const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateRecoveryPlan = async (req, res) => {
  const { diagnosis, user } = req.body;

  if (!diagnosis) {
    return res.status(400).json({ error: "Diagnosis is required." });
  }

  // Create personalized profile string like in Symptom Checker
  const parts = [];
  if (user) {
    if (user.age) parts.push(`Age: ${user.age}`);
    if (user.gender) parts.push(`Gender: ${user.gender}`);
    if (user.height) parts.push(`Height: ${user.height}`);
    if (user.weight) parts.push(`Weight: ${user.weight}`);
    if (user.diseases?.length) parts.push(`Pre-existing conditions: ${user.diseases.join(", ")}`);
    if (user.allergies?.length) parts.push(`Allergies: ${user.allergies.join(", ")}`);
    if (user.medications?.length) parts.push(`Medications: ${user.medications.join(", ")}`);
    if (user.treatments?.length) parts.push(`Ongoing treatments: ${user.treatments.join(", ")}`);
  }

  const profileNotes = parts.length ? `Patient Profile: ${parts.join("; ")}.` : '';

  const prompt = `
  ${profileNotes}
  The patient has been diagnosed with "${diagnosis}". Based on this diagnosis and their profile, generate a tailored recovery plan with:

  ✅ Hydration & nutrition tips  
  ✅ Resting schedule  
  ✅ Home remedies  
  ✅ Medicine reminders (mention integration with the smart medication reminder system)  
  ✅ Monitoring & adaptation guidance

  Respond *only* in JSON with keys:
  {
    "hydrationTips": "...",
    "restSchedule": "...",
    "homeRemedies": "...",
    "medicineReminders": "...",
    "monitoringAdvice": "..."
  }
  `;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });
    const result = await model.generateContent([prompt]);
    const raw = await result.response.text();

    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) {
      return res.status(500).json({ error: "Invalid AI response format.", rawResponse: raw });
    }

    let parsed;
    try {
      parsed = JSON.parse(match[0]);
    } catch (err) {
      return res.status(500).json({ error: "Failed to parse AI JSON.", rawResponse: raw });
    }

    return res.json({ recoveryPlan: parsed });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to generate recovery plan", details: error.message });
  }
};
