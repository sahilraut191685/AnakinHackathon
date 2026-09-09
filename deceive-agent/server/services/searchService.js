const axios = require("axios");

async function searchWeb(query) {
    try {


        const apiKey = process.env.TAVILY_API_KEY;
        if (!apiKey) {
            throw new Error("TAVILY_API is missing");
        }
        const response = await axios.post(
            "https://api.tavily.com/search",
            {
                query: query,
            },
            {
                headers: {
                    "Authorization": `Bearer ${apiKey}`
                }
            }
        );

        const data = response.data;
        console.log("RAW data from tavily", data);

        const results = data.results.map((result) => ({
            title: result.title,
            url: result.url,
            snippet: result.content
        }));
        return results;

    }
    catch (error) {
        console.error("Tavily search failed:", error.message);
        throw error;

    }
}

module.exports = { searchWeb };