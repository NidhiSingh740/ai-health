require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// 🔐 CORS setup to allow frontend requests
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// 📦 Middleware
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve uploaded files from /uploads

// 🔗 Routes
const authRoute = require("./router/auth-router");        // Auth routes
const profileRoutes = require("./router/profileRoutes");  // Profile routes
const recoveryPlanRoute = require('./router/recoveryPlan');
app.use('/api/recovery-plan', recoveryPlanRoute);
const chatbotRoute = require('./router/doctorChatbot');
app.use('/api/doctor-chatbot', chatbotRoute);


app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoutes);

const symptomCheckerRoute = require('./router/symptomChecker');
app.use('/api/symptom-checker', symptomCheckerRoute);
// 🌐 Basic route
app.get("/", (req, res) => {
  res.status(200).send("Hello Nidhi! Welcome to the Smart Health AI API.");
});

// ⚙️ Database connection
const connectDb = require("./utils/db");

// 🚀 Start server
const PORT = process.env.PORT || 5000;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to connect to the database:", error);
    process.exit(1);
  });
