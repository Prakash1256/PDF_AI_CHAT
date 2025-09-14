const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import Routes
const chatRoutes = require("./routes/chat.routes");

const app = express();

// Use Render-assigned port or fallback for local dev
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "*", // ✅ allow all origins
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

// Routes
app.use("/api", chatRoutes);

// Start Server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
