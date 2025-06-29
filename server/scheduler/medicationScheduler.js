

// server/scheduler/medicationScheduler.js
const cron = require('node-cron');
const Medication = require('../models/Medication'); // Ensure path is correct
const sendSMS = require('../utils/sms'); // Ensure path is correct

/**
 * @function startMedicationScheduler
 * @description Initializes and starts a cron job to check for and send medication reminders.
 * The job runs every minute, checking for medications due and not yet sent.
 */
const startMedicationScheduler = () => {
  // Schedule a task to run every minute
  // In a real-world scenario, you might adjust this frequency based on needs (e.g., every 5 minutes, or hourly)
  cron.schedule('* * * * *', async () => {
    console.log('Running medication reminder scheduler...');
    const now = new Date();

    try {
      // Find medications that are due (schedule is in the past or present) and haven't been sent yet
      const medicationsDue = await Medication.find({
        schedule: { $lte: now }, // Schedule is less than or equal to current time
        sent: false,             // Has not been sent yet
      });

      console.log(`Found ${medicationsDue.length} medications due.`);

      for (const med of medicationsDue) {
        try {
          const message = `💊 Reminder: Take your ${med.medicationName} (${med.dosage || 'N/A'}) now! This was scheduled for ${new Date(med.schedule).toLocaleTimeString()}.`;
          await sendSMS(med.phoneNumber, message);

          // Mark medication as sent to prevent sending multiple times
          med.sent = true;
          await med.save();
          console.log(`SMS reminder sent for ${med.medicationName} to ${med.phoneNumber}`);
        } catch (smsError) {
          console.error(`Failed to send SMS for medication ${med.medicationName} (ID: ${med._id}):`, smsError);
          // Optionally, handle specific SMS errors (e.g., invalid number)
          // For now, we just log and continue to the next medication
        }
      }
    } catch (dbError) {
      console.error('Error fetching medications for scheduler:', dbError);
    }
  });

  console.log('Medication scheduler started. It will check for reminders every minute.');
};

module.exports = startMedicationScheduler;
