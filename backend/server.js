const express = require("express");
const cors = require("cors");
require('dotenv').config();

// Import Routes
const chatRoutes = require("./routes/chat.routes");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", chatRoutes);

// Start Server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
