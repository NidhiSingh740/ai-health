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

    // --- MODIFIED PROMPT FOR JSON OUTPUT ---
    const prompt = `Based on the user symptoms: "${symptoms}", please provide a diagnosis.
    Your response MUST be a JSON object with the following keys:
    - "condition": a string describing the possible medical condition.
    - "severity": a string indicating the severity, chosen from "mild", "moderate", or "severe".
    - "recommendation": a string suggesting the course of action, chosen from "self-care", "doctor consultation", or "emergency".
    - "notes": an optional string for any additional relevant information or advice.

    Example JSON response:
    {
      "condition": "Common Cold",
      "severity": "mild",
      "recommendation": "self-care",
      "notes": "Rest, drink fluids, and consider over-the-counter medications."
    }`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = await response.text();

    // --- PARSE THE JSON RESPONSE ---
    let parsedDiagnosis;
    try {
      // Clean up the text to ensure it's valid JSON (remove any leading/trailing ```json or other non-JSON chars)
      const jsonString = text.replace(/```json\n?|\n?```/g, '').trim();
      parsedDiagnosis = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Failed to parse Gemini response as JSON:", parseError);
      // If parsing fails, send the raw text, but it's better to make the model consistent.
      return res.status(500).json({ error: "Failed to parse AI response. Please try again.", rawResponse: text });
    }

    res.json({ diagnosis: parsedDiagnosis }); // Send the parsed JSON object
  } catch (error) {
    console.error("Gemini API Error:", error.message || error);
    res.status(500).json({ error: "Something went wrong with Gemini API." });
  }
};