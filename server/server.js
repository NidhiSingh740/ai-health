require("dotenv").config();
const express = require("express");
const app = express();

const authRoute = require("./router/auth-router");
const connectDb = require("./utils/db"); // Assuming this connects to your database
const cors=require('cors')
// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());
// Routes
// Mount the authentication router at the /api/auth path
app.use("/api/auth", authRoute);

// Simple home route for testing
app.get("/", (req, res) => {
  res.status(200).send("Hello Nidhi! Welcome to the Smart Health AI API.");
});

// Error handling middleware (should be the last middleware)

const PORT = process.env.PORT || 5000; // Use environment variable for port

// Connect to the database and then start the server
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
}).catch(error => {
  console.error("Failed to connect to the database:", error);
  process.exit(1); // Exit the process if database connection fails
});