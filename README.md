```markdown
# Roblox Status Checker

The script will periodically check the Roblox user's status (default is every 2 minutes) and send a Discord notification when they are in a game

## Prerequisites

Before running the script, make sure you have the following dependencies installed:

- Node.js
- Axios
- Cheerio

You can install them using npm:
```

```bash
npm install axios cheerio
```

## Configuration

1. Create a `config.json` file with the following structure:

```json
{
    "user_id": "TARGET_ROBLOX_USER_ID",
    "webhook_url": "YOUR_DISCORD_WEBHOOK_URL"
}
```

Replace `TARGET_ROBLOX_USER_ID` with the Roblox user ID you want to monitor, and `YOUR_DISCORD_WEBHOOK_URL` with the Discord webhook URL where you want to receive notifications

## Usage

1. Run the script using the following command:

```bash
node Main.js
```
