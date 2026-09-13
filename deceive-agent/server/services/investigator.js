const { searchWeb } = require("./searchService");
const { askAgent } = require("./llmService");
const { challengeVerdict } = require("./adversarialReviewer");

async function generateQueries(claim, companyName) {
    const prompt = `
You are an investigative researcher. You need to independently verify the following claim made by the company "${companyName}".

Claim: "${claim.text}" (Category: ${claim.category})

Generate 2 to 3 highly specific web search queries that would help verify or refute this claim using independent sources (news, government databases, SEC filings, reviews, etc.). Do not just search the company's own website.

Return ONLY valid JSON in this exact shape, with no extra text, no markdown formatting, no explanation:
{
  "queries": ["query 1", "query 2"]
}
`;
    
    const rawResponse = await askAgent(prompt);
    try {
        const clean = rawResponse.replace(/```json|```/g, "").trim();
        return JSON.parse(clean);
    } catch (error) {
        console.error("Failed to parse generateQueries JSON. Raw response:", rawResponse);
        throw new Error("generateQueries failed: model did not return valid JSON");
    }
}

async function gatherEvidence(queries) {
    const allResults = [];
    const seenUrls = new Set();

    for (const query of queries) {
        try {
            const results = await searchWeb(query);
            for (const res of results) {
                if (!seenUrls.has(res.url)) {
                    seenUrls.add(res.url);
                    allResults.push(res);
                }
            }
        } catch (error) {
            console.error(`gatherEvidence failed for query "${query}":`, error.message);
            // Continue with other queries if one fails
        }
    }
    
    return allResults;
}

async function generateVerdict(claim, evidence) {
    const prompt = `
You are an objective fact-checker. Evaluate the following claim based ONLY on the provided evidence.

Claim: "${claim.text}"

Evidence:
${JSON.stringify(evidence, null, 2)}

Classify the claim into ONE of these categories:
- "verified": The evidence strongly supports the claim.
- "unverified": There is not enough independent evidence to support the claim.
- "inconsistent": The evidence partially contradicts the claim or presents a different picture.
- "high_risk": The evidence directly refutes the claim or indicates it is a scam/fraud.

Return ONLY valid JSON in this exact shape, with no extra text, no markdown formatting, no explanation:
{
  "verdict": "verified|unverified|inconsistent|high_risk",
  "confidence": 85,
  "reasoning": "Clear explanation of how the evidence supports this verdict.",
  "sources": [{"url": "...", "title": "..."}] 
}
* Note: "sources" should only include the specific evidence URLs that led to this verdict. "confidence" must be an integer from 0 to 100.
`;
    
    const rawResponse = await askAgent(prompt);
    try {
        const clean = rawResponse.replace(/```json|```/g, "").trim();
        return JSON.parse(clean);
    } catch (error) {
        console.error("Failed to parse generateVerdict JSON. Raw response:", rawResponse);
        throw new Error("generateVerdict failed: model did not return valid JSON");
    }
}

async function investigateFullClaim(claim, companyName) {
    console.log(`\nInvestigating claim: "${claim.text}"`);
    
    const { queries } = await generateQueries(claim, companyName);
    console.log(`Generated queries:`, queries);
    
    let evidence = await gatherEvidence(queries);
    console.log(`Gathered ${evidence.length} sources of evidence.`);
    
    let verdictData = await generateVerdict(claim, evidence);
    console.log(`Investigator concluded: ${verdictData.verdict} (${verdictData.confidence}%)`);
    
    // Adversarial Review
    console.log("Reviewing verdict...");
    const review = await challengeVerdict(claim, verdictData, evidence);
    
    let wasChallenged = false;
    if (review.hasObjection) {
        wasChallenged = true;
        console.log(`Reviewer objected: "${review.objection}"`);
        console.log(`Re-searching with query: "${review.suggestedFollowUpQuery}"...`);
        
        const extraEvidence = await gatherEvidence([review.suggestedFollowUpQuery]);
        
        // Merge and deduplicate evidence
        const seenUrls = new Set(evidence.map(e => e.url));
        for (const res of extraEvidence) {
            if (!seenUrls.has(res.url)) {
                seenUrls.add(res.url);
                evidence.push(res);
            }
        }
        
        console.log(`Gathered ${extraEvidence.length} new sources. Re-evaluating...`);
        verdictData = await generateVerdict(claim, evidence);
        console.log(`Final verdict: ${verdictData.verdict} (${verdictData.confidence}%)`);
    } else {
        console.log("Reviewer agreed with the verdict.");
    }
    
    return {
        claim,
        ...verdictData,
        wasChallenged
    };
}

module.exports = {
    generateQueries,
    gatherEvidence,
    generateVerdict,
    investigateFullClaim
};
