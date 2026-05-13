import express from "express";
import cors from "cors";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const app = express();
app.use(cors());
app.use(express.json());

const PABBLY_WEBHOOK = "HIER_JOUW_PABBLY_WEBHOOK";

const server = new McpServer({
  name: "BOC OPS Connector",
  version: "1.0.0"
});

server.tool(
  "add_to_boc",
  {
    target: z.enum(["task", "project", "recurring", "weekly_ceo"]),
    task: z.string().optional(),
    project: z.string().optional(),
    type: z.string().optional(),
    status: z.string().optional(),
    priority: z.string().optional(),
    assignedTo: z.string().optional(),
    responsible: z.string().optional(),
    nextStep: z.string().optional(),
    blockage: z.string().optional(),
    delegate: z.string().optional(),
    actionStatus: z.string().optional(),
    client: z.string().optional(),
    frequency: z.string().optional(),
    estimatedTime: z.string().optional(),
    lastDone: z.string().optional(),
    nextExecution: z.string().optional(),
    focus: z.string().optional(),
    whyImportant: z.string().optional()
  },
  async (input) => {
    const response = await axios.post(PABBLY_WEBHOOK, input);

    return {
      content: [
        {
          type: "text",
          text: `BOC bijgewerkt. Response: ${JSON.stringify(response.data)}`
        }
      ]
    };
  }
);

app.get("/", (req, res) => {
  res.send("BOC MCP Server draait");
});

app.all("/mcp", async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`BOC MCP Server draait op poort ${PORT}`);
});
