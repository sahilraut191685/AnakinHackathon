const {askAgent}= require("./llmService");

async function extractClaims(websiteText,companyName) {
    const prompt = `
                    You are analyzing the website content of a company called "${companyName}".

                    Extract factual, checkable business claims from the text below. Only include 
                    specific, verifiable statements such as: founding year, employee count, 
                    certifications, production capacity, customer count, office/branch locations.

                    Do NOT include vague marketing language like "industry leading" or "best in class". 

                    Return ONLY valid JSON in this exact shape, with no extra text, no markdown 
                    formatting, no explanation:

{
  "claims": [
    { "id": "1", "text": "Founded in 2004", "category": "history" },
    { "id": "2", "text": "500+ employees", "category": "workforce" }
  ]
}

Website content:
"""
${websiteText}
"""
`;

const rawResponse= await askAgent(prompt);

try{
    const clean=await rawResponse.replace(/```json|```/g, "").trim();
    const prased= JSON.parse(clean);
    return prased;
}catch(error){
     console.error("Failed to parse claims JSON. Raw response:", rawResponse);
     throw new Error("Claim extraction failed: model did not return valid JSON");
}

}

module.exports={ extractClaims};

