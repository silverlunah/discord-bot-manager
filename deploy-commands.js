// deploy-commands.js
// Run this once whenever you add or update commands in config/commands.json.
// Called automatically via: npm start
// Or manually: npm run deploy

const { REST, Routes, SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const configDir = path.resolve(__dirname, "config");
const botsPath = path.join(configDir, "bots.json");
const commandsPath = path.join(configDir, "commands.json");

if (!fs.existsSync(botsPath)) {
  console.error("Missing config/bots.json");
  process.exit(1);
}
if (!fs.existsSync(commandsPath)) {
  console.error("Missing config/commands.json");
  process.exit(1);
}

const bots = JSON.parse(fs.readFileSync(botsPath, "utf8"));
const commandDefs = JSON.parse(fs.readFileSync(commandsPath, "utf8"));

function buildCommand(def) {
  const cmd = new SlashCommandBuilder()
    .setName(def.name)
    .setDescription(def.description);

  for (const opt of def.options || []) {
    cmd.addStringOption((option) => {
      option
        .setName(opt.name)
        .setDescription(opt.description)
        .setRequired(opt.required ?? true);

      if (opt.type === "choices" && opt.choices) {
        option.addChoices(...opt.choices);
      }

      return option;
    });
  }

  return cmd.toJSON();
}

const builtCommands = commandDefs.map(buildCommand);

async function deploy({ name, clientId, serverId, token }) {
  if (!clientId) {
    console.error(`[${name}] Missing clientId in config/bots.json, skipping.`);
    return;
  }
  if (!serverId) {
    console.error(`[${name}] Missing serverId in config/bots.json, skipping.`);
    return;
  }

  const ownedCommands = builtCommands.filter((_, i) => commandDefs[i].owner === name);
  const rest = new REST().setToken(token);

  try {
    console.log(`[${name}] Registering ${ownedCommands.length} command(s) in server ${serverId}...`);
    await rest.put(Routes.applicationGuildCommands(clientId, serverId), { body: ownedCommands });
    console.log(`[${name}] Done.`);
  } catch (err) {
    console.error(`[${name}] Failed to register commands:`, err.message);
  }
}

(async () => {
  for (const bot of bots) {
    await deploy(bot);
  }
})();
