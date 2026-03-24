// bot.js
const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");
require("dotenv").config();

// Load env variables
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
const SESSION_ID = process.env.AI_SESSION_ID;

if (!DISCORD_TOKEN || !N8N_WEBHOOK_URL || !SESSION_ID) {
  console.error(
    "Missing one or more environment variables: DISCORD_TOKEN, N8N_WEBHOOK_URL, AI_SESSION_ID",
  );
  process.exit(1);
}

// Initialize Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// On ready
client.on("clientReady", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// On message received
client.on("messageCreate", async (message) => {
  // Ignore bot messages
  if (message.author.bot) return;

  try {
    // Strip mentions of the bot from message content
    const input = message.content.replace(/<@!?(\d+)>/g, "").trim();
    if (!input) return; // ignore empty messages

    console.log("Received message:", message.content);

    // Build payload expected by AI
    const payload = {
      action: "sendMessage",
      sessionId: SESSION_ID,
      chatInput: input,
      channelId: message.channelId,
    };

    // Send to n8n webhook
    await axios.post(N8N_WEBHOOK_URL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 15000, // 15 seconds
    });

    // Removed reply to Discord message
  } catch (err) {
    console.error("Error sending message to AI:", err.message);
  }
});

// Login Discord
client.login(DISCORD_TOKEN);
