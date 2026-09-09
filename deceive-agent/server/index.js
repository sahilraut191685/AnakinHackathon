const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const { searchWeb } = require("./services/searchService");
const { askAgent } = require("./services/llmService");



const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

//testing 
app.post("/api/test-search", async (req, res) => {
  try {
    const { query } = req.body;

    console.log("BODY:", req.body);
    console.log("QUERY:", query);
    if (!query) {
      return res.status(400).json({
        error: "Query is required"
      });
    }
    const result = await searchWeb(query);
    res.json(result);
  }
  catch (error) {
    console.error("Test search failed:", error.message);

    res.status(500).json({
      error: "Search failed"
    });
  }
});

// Test the LLM + tool-calling loop
app.post("/api/test-agent", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    console.log("Agent received message:", message);
    const response = await askAgent(message);
    res.json({ response });
  } catch (error) {
    console.error("Agent test failed:", error.message);
    res.status(500).json({ error: "Agent request failed" });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
