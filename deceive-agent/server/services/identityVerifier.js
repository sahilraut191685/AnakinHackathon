const { searchWeb } = require("./searchService");
const { askAgent } = require("./llmService");

/**
 * Verifies if the given URL belongs to the specified company name.
 * 
 * @param {string} companyName - The name of the company.
 * @param {string} url - The URL to verify.
 * @returns {Promise<{confirmed: boolean, notes: string}>} - The verification result.
 */
async function verifyIdentity(companyName, url) {
    try {
        console.log(`Verifying identity for ${companyName} (${url})...`);
        const query = `${companyName} official website headquarters founded`;
        const searchResults = await searchWeb(query);

        const prompt = `
You are an expert corporate identity verifier. 
I need to verify if the website URL "${url}" is the official website for the company "${companyName}".

Here are the top web search results for "${companyName} official website headquarters founded":
${JSON.stringify(searchResults, null, 2)}

Based on the search results, determine if "${url}" is highly likely to be the official website of "${companyName}".
Return ONLY valid JSON in the exact format below. Do not include markdown formatting, backticks, or any other text.
{
  "confirmed": true or false,
  "notes": "Brief explanation of why you made this determination."
}
`;

        const rawResponse = await askAgent(prompt);
        
        try {
            const clean = rawResponse.replace(/```json|```/g, "").trim();
            const parsed = JSON.parse(clean);
            
            if (typeof parsed.confirmed !== 'boolean') {
                throw new Error("Missing or invalid 'confirmed' boolean in response");
            }
            return parsed;
        } catch (parseError) {
            console.error("Failed to parse identity verification JSON. Raw response:", rawResponse);
            throw new Error(`Identity verification failed: model did not return valid JSON. ${parseError.message}`);
        }
    } catch (error) {
        console.error(`Error verifying identity for ${companyName}:`, error.message);
        throw error;
    }
}

module.exports = { verifyIdentity };
