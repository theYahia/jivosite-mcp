#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getChatsSchema, handleGetChats, getAgentsSchema, handleGetAgents, getVisitorsSchema, handleGetVisitors } from "./tools/chats.js";

const server = new McpServer({
  name: "jivosite-mcp",
  version: "1.0.0",
});

server.tool(
  "get_chats",
  "Получить список чатов JivoSite.",
  getChatsSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetChats(params) }] }),
);

server.tool(
  "get_agents",
  "Получить список агентов (операторов) JivoSite.",
  getAgentsSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetAgents(params) }] }),
);

server.tool(
  "get_visitors",
  "Получить список посетителей JivoSite.",
  getVisitorsSchema.shape,
  async (params) => ({ content: [{ type: "text", text: await handleGetVisitors(params) }] }),
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[jivosite-mcp] Сервер запущен. 3 инструмента. Требуется JIVOSITE_TOKEN.");
}

main().catch((error) => {
  console.error("[jivosite-mcp] Ошибка:", error);
  process.exit(1);
});
