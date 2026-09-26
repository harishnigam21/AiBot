import { TavilyModel } from "../config/llmModels";
import { AgentState } from "../graph/state";

export const searchAgent = async (
  state: AgentState,
): Promise<Partial<AgentState>> => {
  try {
    const results = await TavilyModel.invoke({
      query: state.prompt,
    });
    console.log("search agent response", results);
    return { ...state, searchResults: results.results, images: results.images };
  } catch (error) {
    return { ...state, searchResults: [], images: [] };
  }
};
