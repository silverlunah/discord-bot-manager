# n8n-discord-bot-manager

A lightweight Discord bot manager that runs multiple bots in a single process. Each bot forwards messages to an n8n webhook for AI processing and supports slash commands for server actions like deployments.

## Features

- Run multiple bots from one process
- Respond to mentions in channels and direct messages
- Slash commands with dropdown choices or free text options
- All config in one place — no code changes needed to add bots or commands

## Prerequisites

- Node.js 18+
- A Discord bot token ([Discord Developer Portal](https://discord.com/developers/applications))
- An n8n instance with a webhook workflow

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example and fill in your values:

```bash
cp .env.example .env
```

```env
N8N_AUTH_HEADER=your-auth-header-value
```

### 3. Configure your bots

```bash
cp config/bots.example.json config/bots.json
```

Edit `config/bots.json`:

```json
[
  {
    "name": "my-bot",
    "clientId": "YOUR_BOT_CLIENT_ID",
    "serverId": "YOUR_DISCORD_SERVER_ID",
    "token": "YOUR_DISCORD_BOT_TOKEN",
    "webhookUrl": "https://your-n8n-instance/webhook/...",
    "sessionId": "your-session-id"
  }
]
```

| Field | Where to find it |
|-------|-----------------|
| `clientId` | Discord Developer Portal → Your App → General Information → Application ID |
| `serverId` | Right-click your server in Discord → Copy Server ID (requires Developer Mode) |
| `token` | Discord Developer Portal → Your App → Bot → Token |
| `webhookUrl` | Your n8n webhook node URL |
| `sessionId` | Any string — used to identify the conversation in n8n |

### 4. (Optional) Configure slash commands

```bash
cp config/commands.example.json config/commands.json
```

Edit `config/commands.json` to define your commands. Each command is tied to a bot via the `owner` field (must match the bot's `name`).

Two option types are supported:

**Choices** — strict dropdown, user must pick from the list:
```json
{
  "name": "deploy",
  "description": "Deploy a website",
  "owner": "my-bot",
  "webhookAction": "deploy",
  "options": [
    {
      "name": "website",
      "description": "Which website to deploy",
      "type": "choices",
      "required": true,
      "choices": [
        { "name": "My Site", "value": "my-site" },
        { "name": "Shop", "value": "shop-site" }
      ]
    }
  ]
}
```

**String** — free text input:
```json
{
  "name": "restart",
  "description": "Restart a service",
  "owner": "my-bot",
  "webhookAction": "restart",
  "options": [
    {
      "name": "service",
      "description": "Service name",
      "type": "string",
      "required": true
    }
  ]
}
```

### 5. Run

```bash
npm start
```

This registers slash commands with Discord first, then starts the bot. Re-run whenever you update `config/commands.json`.

## n8n Integration

Every event forwards a JSON payload to the bot's `webhookUrl`.

**Message (mention or DM):**
```json
{
  "action": "sendMessage",
  "sessionId": "your-session-id",
  "chatInput": "the user's message",
  "channelId": "channel-id",
  "isDM": false
}
```

**Slash command:**
```json
{
  "action": "deploy",
  "command": "deploy",
  "options": { "website": "my-site" },
  "userId": "user-id",
  "channelId": "channel-id",
  "guildId": "server-id",
  "interactionToken": "...",
  "interactionId": "..."
}
```

Use `isDM` to route message replies (channel vs DM). Use `interactionToken` + `interactionId` if you want n8n to send a follow-up response to a slash command via the Discord API.

## Docker

```bash
docker-compose up -d
```

The `config/` directory is mounted as a volume so you can update bots and commands without rebuilding.

## Claude Code Skills

This repo includes Claude Code skills for common tasks:

| Skill | Usage | Description |
| ----- | ----- | ----------- |
| `add-bot` | `/add-bot <bot-name>` | Adds a new bot entry to `config/bots.json` with placeholder values |
| `add-command` | `/add-command <command-name>` | Adds a new slash command entry to `config/commands.json` |
| `make-pr` | `/make-pr <pr-title>` | Creates a branch, commits changes, and opens a pull request |

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Deploy commands then start the bot |
| `npm run bot` | Start the bot only |
| `npm run deploy` | Register slash commands with Discord only |
