
// server/controller/medicationController.js
const Medication = require('../models/Medication');
const sendSMS = require('../utils/sms');
const geminiClient = require('../utils/geminiClient');

exports.addMedication = async (req, res) => {
  try {
    const { userId, name, dosage, time, phone } = req.body;
    const med = new Medication({ userId, name, dosage, time, phone });
    await med.save();

    await sendSMS(phone, `💊 Reminder: Take your ${name} (${dosage}) at ${time}`);

    res.status(201).json({ message: 'Medication saved & SMS sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.checkMissedDoses = async (req, res) => {
  try {
    const { userId } = req.body;
    const missed = await Medication.find({ userId, taken: false });

    const prompt = `The user missed ${missed.length} doses. Suggest improvements.`;

    const aiResponse = await geminiClient.generateContent(prompt);

    res.json({ missed, suggestion: aiResponse.response.text() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
