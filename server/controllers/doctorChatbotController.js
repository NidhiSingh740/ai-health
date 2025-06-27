const geminiAPI = require('../utils/geminiClient');

const askDoctorBot = async (req, res) => {
  try {
    const { question, user } = req.body;

    if (!question || !user) {
      return res.status(400).json({ error: 'Missing question or user profile.' });
    }

    const prompt = `
You are a helpful virtual doctor. Based on the user's profile and question, provide a concise, useful medical response.

User Profile:
- Name: ${user.name || 'N/A'}
- Age: ${user.age || 'N/A'}
- Gender: ${user.gender || 'N/A'}
- Height: ${user.height || 'N/A'}
- Weight: ${user.weight || 'N/A'}
- Diseases: ${user.diseases || 'None'}
- Allergies: ${user.allergies || 'None'}
- Treatments: ${user.treatments || 'None'}
- Medications: ${user.medications || 'None'}

Question: ${question}

Respond in the following format:
1. Answer
2. Home Remedies
3. Medications
4. Recommendation
`;

    const aiResponse = await geminiAPI(prompt);

    res.json({
      answer: {
        response: aiResponse
      }
    });
  } catch (error) {
    console.error("Doctor Chatbot Error:", error.message);
    res.status(500).json({ error: 'Failed to process your request.' });
  }
};

// ✅ Use named export
module.exports = { askDoctorBot };
