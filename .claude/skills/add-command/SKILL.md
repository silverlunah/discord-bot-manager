---
name: add-command
description: Add a new slash command entry to config/commands.json. Use when the user wants to add or register a new slash command for a bot.
argument-hint: "command-name"
---

# Add a New Slash Command

The user wants to add a new slash command called "$ARGUMENTS" to `config/commands.json`.

## Steps

1. Read `config/commands.json` if it exists, otherwise start with an empty array
2. Read `config/bots.json` to know the available bot names for the `owner` field
3. Ask the user:
   - Which bot should own this command? (must match a `name` in `config/bots.json`)
   - What should the command do? (used for `description` and `webhookAction`)
   - What options does it need? For each option ask:
     - Option name
     - `choices` (strict dropdown — user picks from a list) or `string` (free text)
     - If `choices`: what are the choices? (name + value pairs)
4. Append the new command using this shape:
   ```json
   {
     "name": "$ARGUMENTS",
     "description": "DESCRIPTION",
     "owner": "BOT_NAME",
     "webhookAction": "$ARGUMENTS",
     "options": [
       {
         "name": "OPTION_NAME",
         "description": "OPTION_DESCRIPTION",
         "type": "choices",
         "required": true,
         "choices": [
           { "name": "Display Name", "value": "value" }
         ]
       }
     ]
   }
   ```
5. Write the updated array back to `config/commands.json`
6. Remind the user to run `npm start` (or `npm run deploy`) to register the command with Discord
