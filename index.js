require("dotenv").config();

const { Client, GatewayIntentBits, Partials } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { handleMessage } = require("./src/message");
const { handleInteraction } = require("./src/interaction");
const log = require("./src/logger");

if (!process.env.N8N_AUTH_HEADER) {
  log.error(null, "Missing environment variable: N8N_AUTH_HEADER");
  process.exit(1);
}

const configDir = path.resolve(__dirname, "config");

const botsPath = path.join(configDir, "bots.json");
if (!fs.existsSync(botsPath)) {
  log.error(null, "Missing config/bots.json — copy config/bots.example.json to get started.");
  process.exit(1);
}

const bots = JSON.parse(fs.readFileSync(botsPath, "utf8"));
if (!Array.isArray(bots) || bots.length === 0) {
  log.error(null, "config/bots.json must be a non-empty array.");
  process.exit(1);
}

const commandsPath = path.join(configDir, "commands.json");
const commands = fs.existsSync(commandsPath)
  ? JSON.parse(fs.readFileSync(commandsPath, "utf8"))
  : [];

function startBot({ name, token, webhookUrl, sessionId }) {
  if (!name || !token || !webhookUrl || !sessionId) {
    log.error(name, "Missing required fields (name, token, webhookUrl, sessionId). Skipping.");
    return;
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.DirectMessages,
    ],
    partials: [Partials.Channel],
  });

  client.on("clientReady", () => {
    log.info(name, `Logged in as ${client.user.tag}`);
  });

  client.on("messageCreate", (message) =>
    handleMessage(message, { name, webhookUrl, sessionId, client }),
  );

  client.on("interactionCreate", (interaction) =>
    handleInteraction(interaction, { name, webhookUrl, commands, sessionId }),
  );

  client.login(token);
}

bots.forEach(startBot);
