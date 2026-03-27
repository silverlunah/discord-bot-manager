// bot.js
const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

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
    ],
  });

  // On ready
  client.on("clientReady", () => {
    console.log(`[${name}] Logged in as ${client.user.tag}`);
  });

  // On message received
  client.on("messageCreate", async (message) => {
    // Ignore bot messages
    if (message.author.bot) return;

    // Check if this bot was mentioned in the message
    if (!message.mentions.has(client.user)) return;

    try {
      // Strip the bot mention from message content
      const input = message.content.replace(/<@!?(\d+)>/g, "").trim();
      if (!input) return; // ignore empty messages after mention

      console.log(`[${name}] Received message:`, message.content);

      // Build payload expected by AI
      const payload = {
        action: "sendMessage",
        sessionId: sessionId,
        chatInput: input,
        channelId: message.channelId,
      };

      // Send to n8n webhook
      await axios.post(webhookUrl, payload, {
        headers: {
          "Content-Type": "application/json",
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
