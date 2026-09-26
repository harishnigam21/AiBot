import { getModel } from "../config/llmModels";
import { AgentState } from "./state";

export const router = async (
  state: AgentState,
): Promise<Partial<AgentState>> => {
  const model = await getModel("router");
  const prompt = `You are an intent-classification router for an AI assistant network. Your sole task is to analyze the user's input context and select the single most appropriate agent to handle the request.

Available Agents:
1. chat: General conversation, open-ended discussion, creative writing, advice, or general knowledge reasoning that does  ot require web search.
2. search: Queries requiring up-to-date, real-time, or time-sensitive information, recent news, or factual verification using web data.
3. coding: Writing, debugging, reviewing, refactoring, or explaining code, software development, data structures, algorithms, or technical syntax.
4. ppt: Requests to generate, structure, outline, format, or draft presentation slides or slide decks.
5. pdf: Requests to analyze, parse, extract, summarize, edit, or interact directly with PDF documents.
6. image: Requests to generate, edit, analyze, process, or describe visual graphics or images.

Rules & Constraints:
1. Output ONLY the single, exact string matching the chosen agent name (chat, search, coding, ppt, pdf, or image).
2. Do NOT include any preamble, explanations, punctuation, markdown code blocks, or additional characters.
3. If an input spans multiple capabilities, choose the primary deliverable requested.

Context Input:${state.prompt}`;

  const response = await (model as any).invoke(prompt);
  console.log("router response", response);
  return { ...state, agent: response.content.trim().toLowerCase() };
};
