const axios = require("axios");
const log = require("./logger");

async function handleMessage(message, { name, webhookUrl, sessionId, client }) {
  if (message.author.bot) return;

  const isDM = message.channel.type === 1; // ChannelType.DM
  if (!isDM && !message.mentions.has(client.user)) return;

  const input = message.content.replace(/<@!?(\d+)>/g, "").trim();
  if (!input) return;

  log.info(name, "Received message:", message.content);

  try {
    await axios.post(
      webhookUrl,
      {
        action: "sendMessage",
        sessionId,
        chatInput: input,
        channelId: message.channelId,
        guildId: message.guildId ?? null,
        userId: message.author.id,
        isDM,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.N8N_AUTH_HEADER,
        },
        timeout: 15000,
      },
    );
  } catch (err) {
    log.error(name, "Error sending message to n8n:", err.message);
  }
}

module.exports = { handleMessage };
