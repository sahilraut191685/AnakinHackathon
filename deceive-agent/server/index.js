const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

const { searchWeb } = require("./services/searchService");
const { askAgent } = require("./services/llmService");
const { scrapeWebsite } = require("./services/scraperService");
const { extractClaims } = require("./services/claimExtractor");
const { verifyIdentity } = require("./services/identityVerifier");
const { investigateFullClaim } = require("./services/investigator");
const { calculateRiskScore } = require("./services/riskEngine");
const { generateActions } = require("./services/actionEngine");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Testing search
app.post("/api/test-search", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }
    const result = await searchWeb(query);
    res.json(result);
  } catch (error) {
    console.error("Test search failed:", error.message);
    res.status(500).json({ error: "Search failed" });
  }
});

// Test the LLM + tool-calling loop
app.post("/api/test-agent", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }
    const response = await askAgent(message);
    res.json({ response });
  } catch (error) {
    console.error("Agent test failed:", error.message);
    res.status(500).json({ error: "Agent request failed" });
  }
});

// Scraper response
app.post("/api/test-scrapper", async(req,res)=>{
  try{
    const {url}= req.body;
    if(!url){
      return res.status(400).json({error:"url is required"});
    }
    const ans= await scrapeWebsite(url);
    res.json({ans});
  } catch(error){
    console.log("Failed to Scrap",error.message);
    res.status(500).json({error:"Failed Request"});
  }
});

// Extract claims with identity verification
app.post("/api/extract-claims", async(req,res)=>{
  try{
    const { url, companyname } = req.body;

    if(!url || !companyname){
       return res.status(400).json({ error: "url and companyname are required" });
    }
    
    // 1. Verify Identity
    const identityCheck = await verifyIdentity(companyname, url);
    if (!identityCheck.confirmed) {
        return res.status(400).json({ 
            error: "Identity verification failed. The URL does not appear to be the official website.",
            notes: identityCheck.notes 
        });
    }

    // 2. Scrape and Extract
    const websiteText = await scrapeWebsite(url);
    if (websiteText.startsWith("Error:")) {
        return res.status(400).json({ error: websiteText });
    }
    const claims = await extractClaims(websiteText, companyname);

    res.json({
        identityCheck,
        claims
    });

  } catch(error){
    console.error("extract-claims error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Main investigate pipeline
app.post("/api/investigate", async (req, res) => {
  try {
    const { companyName, url } = req.body; // Using camelCase for this new route
    
    if (!url || !companyName) {
      return res.status(400).json({ error: "url and companyName are required" });
    }

    // DEMO MODE CHECK
    if (process.env.DEMO_MODE === "true") {
      console.log("DEMO MODE ACTIVE: Returning cached data after delay...");
      const cachePath = path.join(__dirname, "data", "cachedDemo.json");
      if (fs.existsSync(cachePath)) {
          const cachedData = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
          // Artificial 2.5 second delay
          await new Promise(resolve => setTimeout(resolve, 2500));
          return res.json(cachedData);
      } else {
          console.warn("Demo mode is on but cachedDemo.json not found. Proceeding with live investigation.");
      }
    }

    // 1. Verify Identity
    const identityCheck = await verifyIdentity(companyName, url);
    if (!identityCheck.confirmed) {
      return res.status(400).json({ 
        error: "Identity verification failed. The URL does not appear to be the official website.",
        notes: identityCheck.notes 
      });
    }

    // 2. Scrape and Extract
    const websiteText = await scrapeWebsite(url);
    if (websiteText.startsWith("Error:")) {
      return res.status(400).json({ error: websiteText });
    }
    const { claims } = await extractClaims(websiteText, companyName);
    
    if (!claims || claims.length === 0) {
        return res.json({ identityCheck, claims: [], results: [], riskScore: { overallScore: 0, riskLevel: "LOW", breakdown: [] } });
    }

    // 3. Investigate Each Claim (Sequential)
    const results = [];
    for (const claim of claims) {
        const result = await investigateFullClaim(claim, companyName);
        results.push(result);
    }

    // 4. Calculate Risk Score
    const riskScore = calculateRiskScore(results);

    // 5. Generate Recommended Actions
    const { actions, draftEmail } = await generateActions(companyName, results, riskScore);

    // 6. Return full payload
    res.json({
        identityCheck,
        claims,
        results,
        riskScore,
        actions,
        draftEmail
    });

  } catch (error) {
    console.error("Investigate pipeline error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
