#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "http";

import { getChatsSchema, handleGetChats } from "./tools/chats.js";
import { getAgentsSchema, handleGetAgents } from "./tools/agents.js";
import { getContactsSchema, handleGetContacts, createContactSchema, handleCreateContact } from "./tools/contacts.js";
import { getMessagesSchema, handleGetMessages, sendMessageSchema, handleSendMessage } from "./tools/messages.js";
import { getWebhooksSchema, handleGetWebhooks, createWebhookSchema, handleCreateWebhook, deleteWebhookSchema, handleDeleteWebhook } from "./tools/webhooks.js";
import { skillActiveChats } from "./skills/active-chats.js";
import { skillAgentStats } from "./skills/agent-stats.js";

const TOOL_COUNT = 10;
const SKILL_COUNT = 2;

function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "jivosite-mcp",
    version: "1.1.0",
  });

  // --- Tools ---

  server.tool(
    "get_chats",
    "Получить список чатов JivoSite. Фильтр по статусу: active, closed, assigned.",
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
    "get_contacts",
    "Получить список контактов JivoSite. Поиск по имени, email, телефону.",
    getContactsSchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleGetContacts(params) }] }),
  );

  server.tool(
    "create_contact",
    "Создать новый контакт в JivoSite.",
    createContactSchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleCreateContact(params) }] }),
  );

  server.tool(
    "get_messages",
    "Получить сообщения из чата JivoSite по chat_id.",
    getMessagesSchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleGetMessages(params) }] }),
  );

  server.tool(
    "send_message",
    "Отправить сообщение в чат JivoSite.",
    sendMessageSchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleSendMessage(params) }] }),
  );

  server.tool(
    "get_webhooks",
    "Получить список вебхуков JivoSite.",
    getWebhooksSchema.shape,
    async () => ({ content: [{ type: "text", text: await handleGetWebhooks() }] }),
  );

  server.tool(
    "create_webhook",
    "Создать вебхук JivoSite для получения событий.",
    createWebhookSchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleCreateWebhook(params) }] }),
  );

  server.tool(
    "delete_webhook",
    "Удалить вебхук JivoSite.",
    deleteWebhookSchema.shape,
    async (params) => ({ content: [{ type: "text", text: await handleDeleteWebhook(params) }] }),
  );

  // --- Skills ---

  server.tool(
    "skill_active_chats",
    "Активные чаты сейчас — сводка по текущим активным чатам с операторами.",
    {},
    async () => ({ content: [{ type: "text", text: await skillActiveChats() }] }),
  );

  server.tool(
    "skill_agent_stats",
    "Статистика операторов — кто онлайн, кто оффлайн, общая сводка.",
    {},
    async () => ({ content: [{ type: "text", text: await skillAgentStats() }] }),
  );

  return server;
}

async function main() {
  const args = process.argv.slice(2);
  const httpMode = args.includes("--http");
  const port = parseInt(args.find(a => a.startsWith("--port="))?.split("=")[1] ?? "3000", 10);

  const server = createMcpServer();

  if (httpMode) {
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: () => crypto.randomUUID() });
    await server.connect(transport);

    const httpServer = createServer(async (req, res) => {
      const url = new URL(req.url ?? "/", `http://localhost:${port}`);
      if (url.pathname === "/mcp") {
        await transport.handleRequest(req, res);
      } else if (url.pathname === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ status: "ok", tools: TOOL_COUNT, skills: SKILL_COUNT }));
      } else {
        res.writeHead(404);
        res.end("Not Found");
      }
    });

    httpServer.listen(port, () => {
      console.error(`[jivosite-mcp] HTTP mode on port ${port}. ${TOOL_COUNT} tools + ${SKILL_COUNT} skills.`);
      console.error(`[jivosite-mcp] MCP endpoint: http://localhost:${port}/mcp`);
      console.error(`[jivosite-mcp] Health: http://localhost:${port}/health`);
    });
  } else {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error(`[jivosite-mcp] Stdio mode. ${TOOL_COUNT} tools + ${SKILL_COUNT} skills. Requires JIVOSITE_TOKEN.`);
  }
}

main().catch((error) => {
  console.error("[jivosite-mcp] Error:", error);
  process.exit(1);
});
