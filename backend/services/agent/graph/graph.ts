import { END, START, StateGraph } from "@langchain/langgraph";

import { agentState } from "./state";
import { router } from "./router";

import { chatAgent } from "../agents/chat";
import { searchAgent } from "../agents/search";
import { codingAgent } from "../agents/coding";
import { imageAgent } from "../agents/image";
import { pdfAgent } from "../agents/pdf";
import { pptAgent } from "../agents/ppt";

const workflow = new StateGraph(agentState)
  .addNode("router", router)
  .addNode("chat", chatAgent)
  .addNode("search", searchAgent)
  .addNode("coding", codingAgent)
  .addNode("image", imageAgent)
  .addNode("pdf", pdfAgent)
  .addNode("ppt", pptAgent);

workflow.addEdge(START, "router");

workflow.addConditionalEdges(
  "router",
  (state) => {
    switch (state.agent) {
      case "chat":
        return "chat";

      case "search":
        return "search";

      case "coding":
        return "coding";

      case "image":
        return "image";

      case "pdf":
        return "pdf";

      case "ppt":
        return "ppt";

      default:
        return "chat";
    }
  },
  ["chat", "search", "coding", "image", "pdf", "ppt"],
);

workflow.addEdge("search", "chat");

workflow.addEdge("chat", END);
workflow.addEdge("coding", END);
workflow.addEdge("image", END);
workflow.addEdge("pdf", END);
workflow.addEdge("ppt", END);

export const graph = workflow.compile();
