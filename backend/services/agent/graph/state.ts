import { Annotation } from "@langchain/langgraph";

export const agentState = Annotation.Root({
  prompt: Annotation<string>(),
  aiResponse: Annotation<string>(),
  agent: Annotation<"chat" | "search" | "coding" | "image" | "pdf" | "ppt">(),
  chatId: Annotation<string>(),
  searchResults: Annotation<any[]>(),
  images: Annotation<string[]>(),
  actk: Annotation<string>(),
});

export type AgentState = typeof agentState.State;
