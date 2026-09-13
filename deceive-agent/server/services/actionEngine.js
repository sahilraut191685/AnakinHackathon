const { askAgent } = require("./llmService");

/**
 * Generates recommended actions and a draft email based on the investigation results.
 * 
 * @param {string} companyName - The name of the company investigated.
 * @param {Array} claimResults - The array of verdict objects.
 * @param {Object} riskData - The risk scoring output.
 * @returns {Promise<{actions: string[], draftEmail: string}>}
 */
async function generateActions(companyName, claimResults, riskData) {
    const summary = claimResults.map(r => 
        `- Claim: "${r.claim.text}"\n  Verdict: ${r.verdict} (${r.confidence}%)\n  Reasoning: ${r.reasoning}`
    ).join("\n\n");

    const prompt = `
You are an advisory assistant for risk analysts. Based on the following AI-driven investigation of "${companyName}", generate recommended next steps and a draft email.

OVERALL RISK LEVEL: ${riskData.riskLevel} (Score: ${riskData.overallScore}/100)

INVESTIGATION SUMMARY:
${summary}

TASK 1: Recommend 3 to 5 highly specific next actions for a human reviewer to take. These should be practical (e.g., "Request audited financials to verify X", "Check local registry for Y").
TASK 2: Draft a short, professional email to the company's contact or onboarding team requesting clarification or documentation for the claims that were flagged as 'unverified', 'inconsistent', or 'high_risk'. If all claims were verified, draft a simple approval/welcome email.

Return ONLY valid JSON in this exact shape, with no extra text, no markdown formatting, no explanation:
{
  "actions": ["Action 1", "Action 2", "Action 3"],
  "draftEmail": "Subject: ...\\n\\nDear ...,\\n\\n..."
}
`;

    const rawResponse = await askAgent(prompt);

    try {
        const clean = rawResponse.replace(/```json|```/g, "").trim();
        return JSON.parse(clean);
    } catch (error) {
        console.error("Failed to parse generateActions JSON. Raw response:", rawResponse);
        throw new Error("generateActions failed: model did not return valid JSON");
    }
}

module.exports = { generateActions };
