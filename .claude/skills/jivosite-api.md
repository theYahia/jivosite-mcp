# JivoSite API MCP Server

MCP-сервер для JivoSite API (api.jivosite.com/v1/, Bearer token).

## Архитектура
- src/client.ts - HTTP-клиент с Bearer-авторизацией
- src/types.ts - TypeScript-интерфейсы
- src/tools/chats.ts - get_chats, get_agents, get_visitors
- src/index.ts - точка входа MCP-сервера

## Переменные окружения
- JIVOSITE_TOKEN - Bearer-токен (обязательно)
