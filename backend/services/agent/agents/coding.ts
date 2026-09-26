import { getModel } from "../config/llmModels";
import { AgentState } from "../graph/state";

export const codingAgent = async (
  state: AgentState,
): Promise<Partial<AgentState>> => {
  const model = await getModel("coding");
  const systemPrompt =
    "You are AI Bot, an Intelligent AI coding assistant, answer the question resourcefully, no bulk response and provide code if requires";
  const response = await (model as any).invoke([
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "human",
      content: state.prompt,
    },
  ]);
  console.log("coding agent response", response);

  return { ...state, aiResponse: response.content };
};
