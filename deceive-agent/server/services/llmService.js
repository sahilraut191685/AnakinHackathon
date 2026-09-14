const Groq = require("groq-sdk");
const { searchWeb } = require("./searchService");

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const searchWebTool = {
  type: "function",
  function: {
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
  },
};

async function askAgent(message, allowTools = false) {
  try {
    const messages = [{ role: "user", content: message }];

    const requestOptions = {
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages: messages,
    };

    if (allowTools) {
      requestOptions.tools = [searchWebTool];
    }

    const completion = await client.chat.completions.create(requestOptions);

    const responseMessage = completion.choices[0].message;
    const toolCalls = responseMessage.tool_calls;

    if (allowTools && toolCalls && toolCalls.length > 0) {
      const toolCall = toolCalls[0];
      const args = JSON.parse(toolCall.function.arguments);

      console.log(
        `Model requested function call: search_web("${args.query}")`
      );

      const searchResults = await searchWeb(args.query);
      console.log(`Tool returned ${searchResults.length} results`);

      // Add the assistant's tool call request and the tool result to history
      messages.push(responseMessage);
      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(searchResults),
      });

      const finalCompletion = await client.chat.completions.create({
        model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
        messages: messages,
        tools: [searchWebTool],
      });

      const finalText = finalCompletion.choices[0].message.content || "";
      console.log(`Model final response: ${finalText}`);
      return finalText;
    }

    const directText = responseMessage.content || "";
    console.log(`Model final response: ${directText}`);
    return directText;
  } catch (error) {
    console.error("LLM service error:", error.message);
    throw error;
  }
}

module.exports = { askAgent };