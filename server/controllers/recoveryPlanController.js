const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateRecoveryPlan = async (req, res) => {
  const { diagnosis, user } = req.body;

  if (!diagnosis) {
    return res.status(400).json({ error: "Diagnosis is required." });
  }

  // Personalized greeting
  const greeting = user?.name
    ? `Hey ${user.name}! `
    : `Hello there! `;

  // Build profile notes
  const parts = [];
  if (user) {
    if (user.age) parts.push(`you’re ${user.age} years old`);
    if (user.gender) parts.push(`you identify as ${user.gender}`);
    if (user.height) parts.push(`your height is approximately ${user.height}`);
    if (user.weight) parts.push(`your weight is around ${user.weight}`);
    
    if (user.allergies) {
      if (Array.isArray(user.allergies) && user.allergies.length) {
        parts.push(`you’re allergic to ${user.allergies.join(", ")}`);
      } else if (typeof user.allergies === "string" && user.allergies.trim()) {
        parts.push(`you have an allergy to ${user.allergies}`);
      }
    }

    if (user.diseases) {
      if (Array.isArray(user.diseases) && user.diseases.length) {
        parts.push(`you have a history of ${user.diseases.join(", ")}`);
      } else if (typeof user.diseases === "string" && user.diseases.trim()) {
        parts.push(`you have a history of ${user.diseases}`);
      }
    }
  }
  const profileNotes = parts.length ? parts.join("; ") + ". " : "";

  // Build prompt
  const prompt = `
${greeting}${profileNotes}You have been diagnosed with: "${diagnosis}".
Please generate a personalized recovery plan including:
✅ Hydration & nutrition tips  
✅ Resting schedule  
✅ Home remedies  
✅ Medicine reminders (mention it links to our smart medication reminder system)  
✅ Monitoring advice  

**IMPORTANT**: Reply only with a single JSON object—no extra text, no markdown, no code fences. It must have exactly these keys:
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
    const result = await model.generateContent(prompt);
    const raw = await result.response.text();

    // Extract JSON substring
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) {
      console.error("No JSON found in AI response:", raw);
      return res.status(500).json({ error: "Invalid AI response format.", rawResponse: raw });
    }

    let parsed;
    try {
      parsed = JSON.parse(match[0]);
    } catch (e) {
      console.error("Error parsing JSON:", match[0], e);
      return res.status(500).json({ error: "Failed to parse AI JSON.", rawResponse: raw });
    }

    return res.json({ recoveryPlan: parsed });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: "Something went wrong with the AI service.",
      details: error.message || error.toString()
    });
  }
};
