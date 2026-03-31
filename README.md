# @theyahia/jivosite-mcp

MCP-сервер для JivoSite API — чаты, агенты, посетители. **3 инструмента.**

[![npm](https://img.shields.io/npm/v/@theyahia/jivosite-mcp)](https://www.npmjs.com/package/@theyahia/jivosite-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Часть серии [Russian API MCP](https://github.com/theYahia/russian-mcp) (50 серверов) by [@theYahia](https://github.com/theYahia).

## Установка

### Claude Desktop

```json
{
  "mcpServers": {
    "jivosite": {
      "command": "npx",
      "args": ["-y", "@theyahia/jivosite-mcp"],
      "env": { "JIVOSITE_TOKEN": "your-token" }
    }
  }
}
```

### Claude Code

```bash
claude mcp add jivosite -e JIVOSITE_TOKEN=your-token -- npx -y @theyahia/jivosite-mcp
```

### VS Code / Cursor

```json
{ "servers": { "jivosite": { "command": "npx", "args": ["-y", "@theyahia/jivosite-mcp"], "env": { "JIVOSITE_TOKEN": "your-token" } } } }
```

> Требуется `JIVOSITE_TOKEN`. Получите в панели JivoSite.

## Инструменты (3)

| Инструмент | Описание |
|------------|----------|
| `get_chats` | Список чатов |
| `get_agents` | Список агентов (операторов) |
| `get_visitors` | Список посетителей |

## Примеры

```
Покажи последние чаты
Список агентов JivoSite
Кто сейчас онлайн из посетителей
```

## Лицензия

MIT
