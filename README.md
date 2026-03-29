# discord-bot-manager

A lightweight Discord bot manager that runs multiple bots in a single process. Each bot listens for mentions and forwards messages to a webhook for AI processing. Perfect for n8n and other projects!

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure your bots

Copy the example config and fill in your values:

```bash
cp bots.example.json bots.json
```

`bots.json` accepts an array of bot configs:

```json
[
  {
    "name": "my-bot",
    "token": "YOUR_DISCORD_BOT_TOKEN",
    "webhookUrl": "https://your-service/webhook/...",
    "sessionId": "your-session-id"
  }
]
```

Add as many bots as you need — each gets its own Discord client.

### 3. Configure environment variables

```bash
cp .env.example .env
```

| Variable          | Description                                                |
| ----------------- | ---------------------------------------------------------- |
| `N8N_AUTH_HEADER` | Authorization header value sent with every webhook request |

### 4. Run

```bash
npm start
```

## Docker

```bash
docker-compose up -d
```

`bots.json` is mounted into the container as a volume, so you can update it without rebuilding the image.

## Claude Code Skills

This repo includes Claude Code skills for common tasks:

| Skill | Usage | Description |
| ----- | ----- | ----------- |
| `add-bot` | `/add-bot <bot-name>` | Adds a new bot entry to `bots.json` with placeholder values |
| `make-pr` | `/make-pr <pr-title>` | Creates a branch, commits changes, and opens a pull request |

## How it works

1. Each bot listens for messages where it is mentioned
2. Strips the mention and forwards the text to its configured webhook URL
3. The backend handles the AI response and replies back to Discord
