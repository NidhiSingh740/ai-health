const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.checkSymptoms = async (req, res) => {
  const { symptoms } = req.body;
  console.log("Received symptoms:", symptoms);
  if (!symptoms) {
    return res.status(400).json({ error: "Symptoms are required." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-05-20" });

    const prompt = `User symptoms: ${symptoms}.
    Diagnose the possible condition, categorize the severity (mild, moderate, severe), and suggest whether it's self-care, doctor consultation, or emergency.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = await response.text();

    res.json({ diagnosis: text });
  } catch (error) {
    console.error("Gemini API Error:", error.message || error);
    res.status(500).json({ error: "Something went wrong with Gemini API." });
  }
};
