import express from "express";
import cors from "cors";
import axios from "axios";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const app = express();

app.use(cors());
app.use(express.json());

const PABBLY_WEBHOOK = "https://connect.pabbly.com/webhook-listener/webhook/IjU3NjYwNTY4MDYzMTA0MzM1MjZiNTUzNiI_3D_pc/IjU3NjcwNTZlMDYzMzA0MzI1MjY4NTUzMjUxMzUi_pc";

const CLIENT_PROFILE_WEBHOOK = "https://connect.pabbly.com/webhook-listener/webhook/IjU3NjYwNTY4MDYzMTA0MzM1MjZiNTUzNiI_3D_pc/IjU3NjcwNTZlMDYzMDA0MzM1MjY4NTUzMjUxMzci_pc";

const WORKFLOW_HUB_WEBHOOK = "https://connect.pabbly.com/webhook-listener/webhook/IjU3NjYwNTY4MDYzMTA0MzM1MjZiNTUzNiI_3D_pc/IjU3NjcwNTZlMDYzMTA0MzQ1MjY5NTUzMjUxMzIi_pc";

function createMcpServer() {

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
            text: `BOC bijgewerkt: ${JSON.stringify(response.data)}`
          }
        ]
      };
    }
  );

  server.tool(
    "add_client_profile",
    {
      target: z.enum(["client_profile", "client_profile_intake"]),
      klant: z.string().optional(),
      fiche: z.string().optional(),
      ontbrekendeInfo: z.string().optional(),
      laatsteVraag: z.string().optional(),
      status: z.string().optional(),
      opmerking: z.string().optional()
    },
    async (input) => {
      const response = await axios.post(CLIENT_PROFILE_WEBHOOK, input);

      return {
        content: [
          {
            type: "text",
            text: `Klantprofiel bijgewerkt: ${JSON.stringify(response.data)}`
          }
        ]
      };
    }
  );

  server.tool(
    "add_to_workflow_hub",
    {
      target: z.enum([
        "coworker_inbox",
        "review_queue",
        "coworker_status",
        "log"
      ]),

      id: z.string().optional(),
      coworker: z.string().optional(),
      klant: z.string().optional(),
      type: z.string().optional(),
      opdracht: z.string().optional(),
      prioriteit: z.string().optional(),
      status: z.string().optional(),
      aangemaaktDoor: z.string().optional(),
      outputLink: z.string().optional(),
      opmerking: z.string().optional(),

      bestand: z.string().optional(),
      feedback: z.string().optional(),

      huidigeTaak: z.string().optional(),
      blokkage: z.string().optional(),

      actie: z.string().optional(),
      resultaat: z.string().optional()
    },
    async (input) => {
      const response = await axios.post(WORKFLOW_HUB_WEBHOOK, input);

      return {
        content: [
          {
            type: "text",
            text: `Workflow Hub bijgewerkt: ${JSON.stringify(response.data)}`
          }
        ]
      };
    }
  );

  return server;
}

app.get("/", (req, res) => {
  res.send("BOC MCP Server draait");
});

app.all("/mcp", async (req, res) => {
  try {
    const server = createMcpServer();

    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("MCP error:", error);

    res.status(500).json({
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`BOC MCP Server draait op poort ${PORT}`);
});
