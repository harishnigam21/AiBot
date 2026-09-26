import { ChatGroq } from "@langchain/groq";
import { ChatGoogle } from "@langchain/google";
import { TavilySearch } from "@langchain/tavily";

const GroqModel = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0,
});

const GeminiModel = new ChatGoogle("gemini-3.6-flash");

export const TavilyModel = new TavilySearch({
  maxResults: 5,
  topic: "general",
  // includeAnswer: false,
  // includeRawContent: false,
  includeImages: true,
  // includeImageDescriptions: false,
  // searchDepth: "basic",
  // timeRange: "day",
  // includeDomains: [],
  // excludeDomains: [],
});
export const getModel = async (agent: string) => {
  switch (agent) {
    case "chat":
      return GroqModel;
    case "search":
      return TavilyModel;
    default:
      return GroqModel;
  }
};
