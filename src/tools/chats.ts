import { z } from "zod";
import { jivoGet } from "../client.js";

export const getChatsSchema = z.object({
  limit: z.number().int().min(1).max(100).default(20).describe("Количество чатов"),
  offset: z.number().int().default(0).describe("Смещение"),
});

export async function handleGetChats(params: z.infer<typeof getChatsSchema>): Promise<string> {
  const result = await jivoGet("chats", {
    limit: String(params.limit),
    offset: String(params.offset),
  });
  return JSON.stringify(result, null, 2);
}

export const getAgentsSchema = z.object({
  limit: z.number().int().min(1).max(100).default(50).describe("Количество агентов"),
});

export async function handleGetAgents(params: z.infer<typeof getAgentsSchema>): Promise<string> {
  const result = await jivoGet("agents", {
    limit: String(params.limit),
  });
  return JSON.stringify(result, null, 2);
}

export const getVisitorsSchema = z.object({
  limit: z.number().int().min(1).max(100).default(20).describe("Количество посетителей"),
  offset: z.number().int().default(0).describe("Смещение"),
});

export async function handleGetVisitors(params: z.infer<typeof getVisitorsSchema>): Promise<string> {
  const result = await jivoGet("visitors", {
    limit: String(params.limit),
    offset: String(params.offset),
  });
  return JSON.stringify(result, null, 2);
}
