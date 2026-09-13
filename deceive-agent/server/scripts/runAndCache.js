const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Load .env from parent directory
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const { verifyIdentity } = require("../services/identityVerifier");
const { scrapeWebsite } = require("../services/scraperService");
const { extractClaims } = require("../services/claimExtractor");
const { investigateFullClaim } = require("../services/investigator");
const { calculateRiskScore } = require("../services/riskEngine");
const { generateActions } = require("../services/actionEngine");

const COMPANY_NAME = "Stripe";
const COMPANY_URL = "https://stripe.com";

async function runAndCache() {
    console.log(`Starting demo cache generation for ${COMPANY_NAME} (${COMPANY_URL})`);
    
    try {
        console.log("\n1. Verifying Identity...");
        const identityCheck = await verifyIdentity(COMPANY_NAME, COMPANY_URL);
        
        console.log("\n2. Scraping Website...");
        const websiteText = await scrapeWebsite(COMPANY_URL);
        
        console.log("\n3. Extracting Claims...");
        const { claims } = await extractClaims(websiteText, COMPANY_NAME);
        console.log(`Found ${claims.length} claims.`);
        
        console.log("\n4. Investigating Claims (this will take a while)...");
        const results = [];
        for (let i = 0; i < claims.length; i++) {
            console.log(`\n--- Claim ${i + 1}/${claims.length} ---`);
            const result = await investigateFullClaim(claims[i], COMPANY_NAME);
            results.push(result);
        }
        
        console.log("\n5. Calculating Risk Score...");
        const riskScore = calculateRiskScore(results);
        console.log(`Score: ${riskScore.overallScore}, Level: ${riskScore.riskLevel}`);
        
        console.log("\n6. Generating Actions...");
        const { actions, draftEmail } = await generateActions(COMPANY_NAME, results, riskScore);
        
        const finalData = {
            identityCheck,
            claims,
            results,
            riskScore,
            actions,
            draftEmail
        };
        
        const dataDir = path.join(__dirname, "..", "data");
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir);
        }
        
        const cachePath = path.join(dataDir, "cachedDemo.json");
        fs.writeFileSync(cachePath, JSON.stringify(finalData, null, 2));
        
        console.log(`\n✅ Success! Demo cache saved to ${cachePath}`);
    } catch (error) {
        console.error("Failed to generate demo cache:", error);
    }
}

runAndCache();
