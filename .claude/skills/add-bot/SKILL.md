---
name: add-bot
description: Add a new bot entry to bots.json. Use when the user wants to add, register, or configure a new Discord bot.
argument-hint: "bot-name"
---

# Add a New Bot

The user wants to add a new bot called "$ARGUMENTS" to `bots.json`.

## Steps

1. Read the current `bots.json` to see existing entries
2. Append a new entry with the following shape:
   ```json
   {
     "name": "$ARGUMENTS",
     "token": "REPLACE_ME",
     "webhookUrl": "REPLACE_ME",
     "sessionId": "REPLACE_ME"
   }
   ```
3. Write the updated array back to `bots.json`
4. Tell the user which fields they still need to fill in
   sss
