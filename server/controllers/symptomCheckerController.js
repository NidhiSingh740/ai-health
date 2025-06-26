const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.checkSymptoms = async (req, res) => {
  const { symptoms, user } = req.body;

  if (!symptoms) {
    return res.status(400).json({ error: "Symptoms are required." });
  }

  // Personalized greeting                    
  const greeting = user?.name
    ? `Hey ${user.name}! `
    : `Hello there! `;

  // Build profile notes, guarding against non-array fields
  const parts = [];
  if (user) {
    if (user.age) parts.push(`I see you’re ${user.age} years old`);
    if (user.gender) parts.push(`you identify as ${user.gender}`);
    if (user.height) parts.push(`you’re about ${user.height} tall`);
    if (user.weight) parts.push(`and weigh around ${user.weight}`);
    
    // Allergies: could be array or string
    if (user.allergies) {
      if (Array.isArray(user.allergies) && user.allergies.length) {
        parts.push(`you’ve noted allergies to ${user.allergies.join(", ")}`);
      } else if (typeof user.allergies === "string" && user.allergies.trim()) {
        parts.push(`you’ve noted an allergy to ${user.allergies}`);
      }
    }

    // Diseases: similarly
    if (user.diseases) {
      if (Array.isArray(user.diseases) && user.diseases.length) {
        parts.push(`you have a history of ${user.diseases.join(", ")}`);
      } else if (typeof user.diseases === "string" && user.diseases.trim()) {
        parts.push(`you have a history of ${user.diseases}`);
      }
    }
  }
  const profileNotes = parts.length ? parts.join("; ") + ". " : "";

  // Force JSON-only output
  const prompt = `
${greeting}${profileNotes}Based on these symptoms: "${symptoms}", what do you think the diagnosis is?
**IMPORTANT**: reply *only* with a single JSON object—no extra text, no markdown, no code fences. It must have exactly these keys:
- "condition": string
- "severity": "mild" | "moderate" | "severe"
- "recommendation": "self-care" | "doctor consultation" | "emergency"
- "notes": (optional) string

Example of the exact return:
{"condition":"Common Cold","severity":"mild","recommendation":"self-care","notes":"Rest and fluids."}
`;

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-preview-05-20"
    });
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

    return res.json({ diagnosis: parsed });
  } catch (err) {
    console.error("Gemini API Error:", err);
    return res.status(500).json({ error: "Something went wrong with the AI service." });
  }
};
