const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const { searchWeb } = require("./services/searchService");
const { askAgent } = require("./services/llmService");
const { scrapeWebsite } = require("./services/scraperService");
const { extractClaims } = require("./services/claimExtractor");



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


// scrapper response
app.post("/api/test-scrapper",async(req,res)=>{
  try{
  const {url}= req.body;
  if(!url){
    return res.status(400).json({error:"url is required"});
  }
  console.log("Scrapper Recived Url:",url);
  const ans= await scrapeWebsite(url);
  res.json({ans});
  }
  catch(error){
    console.log("Failed to Scrap",error.message);
    res.status(500).json({error:"Failed Request"});
  }
  
});

// claimextractor function
app.post("/api/claimextracter", async(req,res)=>{
  
  try{
    const {url,companyname}= req.body;

    if(!url||companyname){
       return res.status(400).json({ error: "url and companyName are required" });
    }
    const websiteText= await scrapeWebsite(url);
    const claims=await extractClaims(websiteText,companyname);

    res.json(claims);

  }catch(error){
    console.error("extract-claims error:", err.message);
    res.status(500).json({ error: err.message });

  }

});





// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
