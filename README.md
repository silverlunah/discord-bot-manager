# n8n-discord-bot-manager

A lightweight Discord bot manager that runs multiple bots in a single process. Each bot forwards messages to an n8n webhook for AI processing and supports slash commands for server actions like deployments.

## Features

- Run multiple bots from one process
- Respond to mentions in channels and direct messages
- Slash commands with dropdown choices or free text options
- Loading animation during long-running slash commands (e.g. deploy)
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

This also runs the setup script which creates any missing config files in `config/` with placeholder values.

### 2. Configure environment

Copy the example and fill in your values:

```bash
cp .env.example .env
```

```env
N8N_AUTH_HEADER=your-auth-header-value
```

### 3. Configure your bots

Edit `config/bots.json` (created by setup with placeholders):

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

Edit `config/commands.json` (created by setup with placeholders). Each command is tied to a bot via the `owner` field (must match the bot's `name`).

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

### 5. (Optional) Customize deploy loading messages

Edit `config/loading-messages.json` to change what the bot says while a deploy is running:

```json
[
  "Warming up the servers...",
  "Pushing code to the cloud...",
  "Almost there, probably..."
]
```

### 6. Run

```bash
npm start
```

This runs setup, registers slash commands with Discord, then starts the bot. Re-run whenever you update `config/commands.json`.

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
  "interactionId": "...",
  "sessionId": "your-session-id"
}
```

> `sessionId` is only included in the payload when `webhookAction` is `deploy`.

Use `isDM` to route message replies (channel vs DM). Use `interactionToken` + `interactionId` if you want n8n to send a follow-up response to a slash command via the Discord API.

## Docker

Make sure your `.env` and `config/` files are in place first, then:

```bash
docker-compose up -d
```

The `config/` directory is mounted as a writable volume — the setup script will create any missing config files with placeholders on first boot. Secrets (`bots.json`, `commands.json`, `.env`) are excluded from the image via `.dockerignore`.

To rebuild after code changes:

```bash
docker-compose up -d --build
```

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
| `npm start` | Run setup, register slash commands, then start the bot |
| `npm run bot` | Start the bot only (skips setup and command registration) |
| `npm run deploy` | Register slash commands with Discord only |
| `npm run prepare` | Create missing config files with placeholders (runs automatically on `npm install`) |
