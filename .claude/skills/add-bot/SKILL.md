---
name: add-bot
description: Add a new bot entry to config/bots.json. Use when the user wants to add, register, or configure a new Discord bot.
argument-hint: "bot-name"
---

# Add a New Bot

The user wants to add a new bot called "$ARGUMENTS" to `config/bots.json`.

## Steps

1. Read the current `config/bots.json` to see existing entries
2. Append a new entry with the following shape:
   ```json
   {
     "name": "$ARGUMENTS",
     "clientId": "REPLACE_ME",
     "serverId": "REPLACE_ME",
     "token": "REPLACE_ME",
     "webhookUrl": "REPLACE_ME",
     "sessionId": "REPLACE_ME"
   }
   ```
3. Write the updated array back to `config/bots.json`
4. Tell the user which fields they still need to fill in:
   - `clientId` — Application ID from Discord Developer Portal
   - `serverId` — Right-click your server in Discord → Copy Server ID
   - `token` — Bot token from Discord Developer Portal
   - `webhookUrl` — n8n webhook URL for this bot
   - `sessionId` — Session identifier for n8n conversation context
