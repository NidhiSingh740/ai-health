const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.checkSymptoms = async (req, res) => {
    const { symptoms, user } = req.body;

    if (!symptoms) {
        return res.status(400).json({ error: "Symptoms are required." });
    }

    const greeting = user?.name ? `Hey ${user.name}! ` : `Hello there! `;

    const parts = [];
    if (user) {
        if (user.age) parts.push(`you’re ${user.age} years old`);
        if (user.gender) parts.push(`you identify as ${user.gender}`);
        if (user.height) parts.push(`you’re about ${user.height} cm tall`); // Changed to cm
        if (user.weight) parts.push(`and weigh around ${user.weight} kg`); // Changed to kg

        if (user.allergies) {
            if (Array.isArray(user.allergies) && user.allergies.length) {
                parts.push(`you’ve noted allergies to ${user.allergies.join(", ")}`);
            } else if (typeof user.allergies === "string" && user.allergies.trim()) {
                parts.push(`you’ve noted an allergy to ${user.allergies}`);
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

    // Modified prompt to include request for suggestedTests
    const prompt = `
${greeting}${profileNotes}Based on these symptoms: "${symptoms}", what do you think the most likely common condition is?
Also, suggest common general diagnostic tests for this condition.

**IMPORTANT**: reply *only* with a single JSON object—no extra text, no markdown, no code fences. It must have exactly these keys:
- "condition": string (e.g., "Influenza (Flu)", "Common Cold", "Migraine", "Uncertain / General Symptoms")
- "severity": "mild" | "moderate" | "severe"
- "recommendation": "self-care" | "doctor consultation" | "emergency"
- "suggestedTests": array of strings (e.g., ["Rapid Flu Test", "Throat Swab", "Complete Blood Count"]. If no specific tests, provide general checks like ["General physical exam", "Blood pressure check"]).
- "notes": (optional) string (Any additional advice or information)

**Crucial Disclaimer**: This information is for general knowledge only and does not constitute medical advice or diagnosis. Always consult a qualified healthcare professional for accurate diagnosis, treatment, and any health concerns.

Example of the exact return:
{"condition":"Common Cold","severity":"mild","recommendation":"self-care","suggestedTests":["No specific tests, general wellness check"],"notes":"Rest and fluids are recommended. Consult a doctor if symptoms worsen."}
`;

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-preview-05-20" // Using the model you indicated is working
        });
        const result = await model.generateContent(prompt);
        let raw = await result.response.text();

        // Robustly extract JSON substring, handling potential markdown fences
        raw = raw.replace(/```json\n?|\n?```/g, '').trim(); // Remove ```json and ```

        let parsed;
        try {
            parsed = JSON.parse(raw);
        } catch (e) {
            console.error("❌ Error parsing AI response as JSON:", raw, e);
            return res.status(500).json({ error: "Invalid AI response format. Raw: " + raw.substring(0, 200) + "..." });
        }

        // Validate required fields in the parsed response
        if (!parsed.condition || !parsed.severity || !parsed.recommendation || !Array.isArray(parsed.suggestedTests)) {
            console.error("❌ AI response missing required fields:", parsed);
            return res.status(500).json({ error: "AI response incomplete or malformed. Please try again." });
        }

        return res.json({ diagnosis: parsed }); // Send the complete diagnosis object
    } catch (err) {
        console.error("❌ Gemini API Error:", err.response?.data || err.message || err);
        let errorMessage = "Something went wrong with the AI service.";

        if (err.response) {
            if (err.response.status === 400) {
                if (err.response.data && err.response.data.error && err.response.data.error.message.includes("safety")) {
                    errorMessage = "Your input contains content that violates safety guidelines. Please rephrase.";
                } else if (err.response.data && err.response.data.error && err.response.data.error.message.includes("not found")) {
                     errorMessage = "AI model not found. Check your API key and model name."; // More specific error
                } else {
                     errorMessage = "Bad request to AI service. Please check your prompt.";
                }
            } else if (err.response.status === 429) {
                errorMessage = "AI service rate limit exceeded. Please try again in a moment.";
            } else {
                errorMessage = `AI service responded with status ${err.response.status}.`;
            }
        } else if (err.request) {
            errorMessage = "No response from AI service. Please check your internet connection.";
        } else {
            errorMessage = `An unexpected error occurred: ${err.message}`;
        }

        return res.status(500).json({ error: errorMessage });
    }
};