require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require('multer'); // New: For handling file uploads
const { createWorker } = require('tesseract.js'); // New: For OCR
const axios = require('axios'); // New: For making requests to your AI model
const startMedicationScheduler = require('../server/scheduler/medicationScheduler'); // New: Import the scheduler

const app = express();

// 🔐 CORS setup to allow frontend requests
app.use(cors({ origin: "https://arogyaai.vercel.app", credentials: true }));

// 📦 Middleware
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded files from /uploads

// --- NEW OCR AND AI INTEGRATION FOR DOCTOR CHATBOT ---

// Multer storage configuration for file uploads (store file in memory as a Buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Initialize Tesseract.js worker
let ocrWorker;
async function initializeOcrWorker() {
    try {
        ocrWorker = await createWorker('eng'); // 'eng' for English
        console.log("Tesseract.js worker initialized.");
    } catch (error) {
        console.error("❌ Failed to initialize Tesseract.js worker:", error);
        // Consider graceful degradation or process.exit(1) if OCR is critical
    }
}
initializeOcrWorker(); // Call this once when your server starts

// New Endpoint for Medical Report Analysis (placed BEFORE the general doctorChatbot route)
app.post('/api/doctor-chatbot/analyze-report', upload.single('medicalReport'), async (req, res) => {
    // 'medicalReport' is the name of the field in the formData from the frontend
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded. Please select an image of the medical report." });
    }

    // Parse user string data from formData
    const userData = req.body.user ? JSON.parse(req.body.user) : {};

    try {
        if (!ocrWorker) {
            console.warn("Tesseract.js worker not ready, attempting re-initialization...");
            await initializeOcrWorker(); // Try to re-initialize if somehow not ready
            if (!ocrWorker) {
                return res.status(500).json({ error: "OCR engine is not ready. Please try again in a moment." });
            }
        }

        // Perform OCR on the uploaded image buffer
        const { data: { text } } = await ocrWorker.recognize(req.file.buffer);
        console.log("OCR Extracted Text:", text.substring(0, 200) + "..."); // Log first 200 chars

        if (!text || text.trim().length < 50) { // Check if enough text was extracted
            return res.status(400).json({ error: "Could not extract enough readable text from the image. Please ensure the image is clear, well-lit, and the text is legible." });
        }

        // Now send the extracted text to your AI model for explanation
        const aiPrompt = `As a helpful AI Doctor Chatbot, explain the following medical report content in simple, easy-to-understand terms for a general user.
        Highlight key findings and what they generally mean.
        **Important:** Do not provide medical advice, diagnosis, or treatment recommendations. Always advise the user to consult a real medical professional for diagnosis, treatment, and any health concerns.

        User Context (if available):
        Name: ${userData.name || 'N/A'}
        Age: ${userData.age || 'N/A'}
        Gender: ${userData.gender || 'N/A'}
        Past Diseases: ${userData.diseases || 'None'}
        Allergies: ${userData.allergies || 'None'}
        Treatments: ${userData.treatments || 'None'}
        Medications: ${userData.medications || 'None'}

        Medical Report Content to Explain:
        ---
        ${text}
        ---

        Start your explanation with a friendly greeting, followed by clear points. End with the disclaimer to consult a real doctor.`;

        // Example for Google Gemini
        const geminiResponse = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: aiPrompt }] }],
            }
        );

        const aiExplanation = geminiResponse.data.candidates[0].content.parts[0].text;
        res.json({ explanation: aiExplanation });

    } catch (error) {
        console.error("❌ Error processing medical report:", error.response?.data || error.message || error);
        // Be more specific about the error if possible
        let userErrorMessage = "Failed to process medical report. Please ensure the image is clear and try again.";
        if (error.response?.data?.error) {
            userErrorMessage = error.response.data.error;
        } else if (error.message && error.message.includes("Timeout")) {
            userErrorMessage = "Processing took too long. Please try a smaller or clearer image.";
        }
        res.status(500).json({ error: userErrorMessage });
    }
});

// Basic Text Chatbot Endpoint (this is the general chatbot route, if it's not handled in router/doctorChatbot.js)
// If you already have this logic in router/doctorChatbot.js, remove this block.
app.post('/api/doctor-chatbot', async (req, res) => {
    const { question, user } = req.body;
    console.log("Received chatbot text question:", question);

    if (!question) {
        return res.status(400).json({ error: "Question is required." });
    }

    try {
        const aiPrompt = `As a helpful AI Doctor Chatbot, answer the following health question based on the user's details. Keep the language simple and easy to understand.
        User's Name: ${user.name || 'N/A'}
        User's Age: ${user.age || 'N/A'}
        User's Gender: ${user.gender || 'N/A'}
        Past Diseases: ${user.diseases || 'None'}
        Allergies: ${user.allergies || 'None'}
        Treatments: ${user.treatments || 'None'}
        Medications: ${user.medications || 'None'}

        Question: ${question}

        Provide a concise and helpful response. If it's a serious medical issue, advise them to consult a real doctor.`;

        const geminiResponse = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: aiPrompt }] }],
            }
        );

        const aiReply = geminiResponse.data.candidates[0].content.parts[0].text;
        res.json({ reply: aiReply });

    } catch (error) {
        console.error("❌ Error communicating with AI model for text chat:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to get AI response for text query." });
    }
});


// 🔗 Existing Routes (ensure these come AFTER the specific /analyze-report route if it's not in the router file itself)
const authRoute = require("./router/auth-router"); // Auth routes
app.use("/api/auth", authRoute);

const recoveryPlanRoute = require('./router/recoveryPlan');
app.use('/api/recovery-plan', recoveryPlanRoute);

// IMPORTANT: Ensure your router/doctorChatbot.js does not also define a POST to '/',
// as it would conflict with the direct app.post for text chatbot above.
// If your router/doctorChatbot.js only defines routes like '/something-else', then this is fine.
// If it defines the main chatbot logic, you should move the text chatbot logic into that router file.
const chatbotRoute = require('./router/doctorChatbot');
app.use('/api/doctor-chatbot', chatbotRoute); // This route will handle other /api/doctor-chatbot/* paths, but /analyze-report takes precedence here.

const nutritionRoute = require("./router/nutrition");
app.use("/api/nutrition", nutritionRoute);

const mentalHealthRoute = require('./router/mentalHealth');
app.use('/api/mental-health', mentalHealthRoute);

const symptomCheckerRoute = require('./router/symptomChecker');
app.use('/api/symptom-checker', symptomCheckerRoute);


const medicationRoute = require('./router/medicationReminder');
app.use('/api/medication', medicationRoute);

// 🌐 Basic route
app.get("/", (req, res) => {
    res.status(200).send("Hello Nidhi! Welcome to the Smart Health AI API.");
});

// ⚙️ Database connection
const connectDb = require("./utils/db");

// 🚀 Start server
const PORT = process.env.PORT || 5000;
app.get('/ping', (req, res) => {
  res.send('pong');
});
connectDb()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`✅ Server running on http://localhost:${PORT}`);
            startMedicationScheduler(); // New: Start the medication scheduler here
          setInterval(() => {
  fetch('https://numbr-exq6.onrender.com/api/ping')
    .then(() => console.log('Pinged self!'))
    .catch(() => console.log('Self ping failed.'));
}, 1000 * 60 * 10); // Every 10 mins
        });
    })
    .catch((error) => {
        console.error("❌ Failed to connect to the database:", error);
        process.exit(1);
    });