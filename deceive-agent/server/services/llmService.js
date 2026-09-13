const { GoogleGenAI } = require("@google/genai");
const { searchWeb } = require("./searchService");

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


const searchWebTool = {
  type: "function",
  name: "search_web",
  description: "Search the web for current, real-time information",
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "The search query to look up",
      },
    },
    required: ["query"],
  },
};


async function askAgent(message) {
  try {
    
    const history=[
      {
        type:"user_input",
        content:[{type:"text",text:message}],
      },
    ];

    const interaction = await client.interactions.create({
      model: process.env.GEMINI_MODEL,
      store: false,
      input: history,
      tools: [searchWebTool],
    });

    
    const fcStep = interaction.steps.find((s) => s.type === "function_call");

    if (fcStep && fcStep.name === "search_web") {
      console.log(
        `Model requested function call: search_web("${fcStep.arguments.query}")`
      );

      
      const searchResults = await searchWeb(fcStep.arguments.query);
      console.log(`Tool returned ${searchResults.length} results`);

     
      history.push(...interaction.steps);
      history.push({
        type: "function_result",
        name: fcStep.name,
        call_id: fcStep.id,
        result: [{ type: "text", text: JSON.stringify(searchResults) }],
      });

     
      const finalInteraction = await client.interactions.create({
        model: process.env.GEMINI_MODEL,
        store: false,
        input: history,
        tools: [searchWebTool],
      });
      const finalText = finalInteraction.outputText || finalInteraction.output_text || "";
      console.log(`Model final response: ${finalText}`);
      return finalText;
    }

    
    const directText = interaction.outputText || interaction.output_text || "";
    console.log(`Model final response: ${directText}`);
    return directText;
  } catch (error) {
    console.error("LLM service error:", error.message);
    throw error;
  }
}

module.exports = { askAgent };
