const axios = require("axios");
const log = require("./logger");
const DEPLOY_LOADING_MESSAGES = require("../config/loading-messages.json");

async function handleInteraction(interaction, { name, webhookUrl, commands, sessionId }) {
  if (!interaction.isChatInputCommand()) return;

  const cmd = commands.find(
    (c) => c.name === interaction.commandName && c.owner === name,
  );
  if (!cmd) return;

  // Defer immediately — n8n may take longer than Discord's 3 second limit
  await interaction.deferReply();

  const options = {};
  for (const opt of cmd.options || []) {
    options[opt.name] = interaction.options.getString(opt.name);
  }

  const isDeploy = cmd.webhookAction === "deploy";
  let loadingInterval;

  if (isDeploy) {
    let msgIndex = 0;
    await interaction.editReply(DEPLOY_LOADING_MESSAGES[0]);
    loadingInterval = setInterval(async () => {
      msgIndex = (msgIndex + 1) % DEPLOY_LOADING_MESSAGES.length;
      await interaction.editReply(DEPLOY_LOADING_MESSAGES[msgIndex]);
    }, 2500);
  }

  try {
    log.info(name, `Slash command /${interaction.commandName}:`, options);

    await axios.post(
      webhookUrl,
      {
        action: cmd.webhookAction || interaction.commandName,
        command: interaction.commandName,
        options,
        userId: interaction.user.id,
        channelId: interaction.channelId,
        guildId: interaction.guildId,
        // Passed so n8n can follow up via Discord API if needed
        interactionToken: interaction.token,
        interactionId: interaction.id,
        ...(isDeploy && { sessionId }),
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.N8N_AUTH_HEADER,
        },
        timeout: 15000,
      },
    );

    clearInterval(loadingInterval);
    await interaction.editReply(isDeploy ? `Deploy kicked off for **${options.website}**!` : "Request received.");
  } catch (err) {
    clearInterval(loadingInterval);
    log.error(name, "Error sending slash command to n8n:", err.message);
    await interaction.editReply("Failed to process command.");
  }
}

module.exports = { handleInteraction };
