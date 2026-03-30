// bot.js
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const N8N_AUTH_HEADER = process.env.N8N_AUTH_HEADER;
if (!N8N_AUTH_HEADER) {
  console.error("Missing environment variable: N8N_AUTH_HEADER");
  process.exit(1);
}

// Load bot configs from bots.json
const configPath = path.resolve(__dirname, "bots.json");
if (!fs.existsSync(configPath)) {
  console.error("Missing bots.json config file.");
  process.exit(1);
}

const bots = JSON.parse(fs.readFileSync(configPath, "utf8"));

if (!Array.isArray(bots) || bots.length === 0) {
  console.error("bots.json must be a non-empty array.");
  process.exit(1);
}

function startBot({ name, token, webhookUrl, sessionId }) {
  if (!name || !token || !webhookUrl || !sessionId) {
    console.error(
      `Bot config is missing required fields (name, token, webhookUrl, sessionId). Skipping.`,
    );
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

  // On ready
  client.on("clientReady", () => {
    console.log(`[${name}] Logged in as ${client.user.tag}`);
  });

  // On message received
  client.on("messageCreate", async (message) => {
    // Ignore bot messages
    if (message.author.bot) return;

    // Allow DMs or messages where the bot is mentioned
    const isDM = message.channel.type === 1; // ChannelType.DM = 1
    if (!isDM && !message.mentions.has(client.user)) return;

    try {
      // Strip the bot mention from message content (no-op for DMs)
      const input = message.content.replace(/<@!?(\d+)>/g, "").trim();
      if (!input) return; // ignore empty messages

      console.log(`[${name}] Received message:`, message.content);

      // Build payload expected by AI
      const payload = {
        action: "sendMessage",
        sessionId: sessionId,
        chatInput: input,
        channelId: message.channelId,
        isDM: isDM,
      };

      // Send to n8n webhook
      await axios.post(webhookUrl, payload, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": N8N_AUTH_HEADER,
        },
        timeout: 15000, // 15 seconds
      });

      // No reply from bot directly
    } catch (err) {
      console.error(`[${name}] Error sending message to AI:`, err.message);
    }
  });

  client.login(token);
}

bots.forEach(startBot);
