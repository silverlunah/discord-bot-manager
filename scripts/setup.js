const fs = require("fs");
const path = require("path");

const CONFIG_DIR = path.join(__dirname, "../config");

const files = [
  {
    dest: "bots.json",
    content: [
      {
        name: "my-bot",
        clientId: "YOUR_BOT_CLIENT_ID",
        serverId: "YOUR_DISCORD_SERVER_ID",
        token: "YOUR_DISCORD_BOT_TOKEN",
        webhookUrl: "https://your-n8n-instance/webhook/...",
        sessionId: "your-session-id",
      },
    ],
  },
  {
    dest: "commands.json",
    content: [
      {
        name: "deploy",
        description: "Deploy a website to the server",
        owner: "my-bot",
        webhookAction: "deploy",
        options: [
          {
            name: "website",
            description: "Which website to deploy",
            type: "choices",
            required: true,
            choices: [
              { name: "My Site", value: "my-site" },
              { name: "Shop", value: "shop-site" },
            ],
          },
        ],
      },
      {
        name: "stop",
        description: "Stop a website stack",
        owner: "my-bot",
        webhookAction: "stop",
        options: [
          {
            name: "website",
            description: "Which website to stop",
            type: "choices",
            required: true,
            choices: [
              { name: "My Site", value: "my-site" },
              { name: "Shop", value: "shop-site" },
            ],
          },
        ],
      },
    ],
  },
];

for (const { dest, content } of files) {
  const filePath = path.join(CONFIG_DIR, dest);
  if (fs.existsSync(filePath)) {
    console.log(`  skipped  config/${dest} (already exists)`);
  } else {
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + "\n");
    console.log(`  created  config/${dest}`);
  }
}
