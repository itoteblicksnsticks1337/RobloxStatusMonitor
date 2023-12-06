const axios = require('axios');
const cheerio = require('cheerio');
const config = require('./config.json');

const roblox_status = {
    in_game: 2,
    not_in_game: 0,
};

const axiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

// Scrapes the username from the Roblox profile page using cheerio
const get_user_details = async (user_id) => {
    try {
        const response = await axiosInstance.get(`https://www.roblox.com/users/${user_id}/profile`);
        const $ = cheerio.load(response.data);  // Loads HTML for parsing
        const username = $('.profile-display-name').text().trim().replace('@', '');  // Extracts username
        return username || "Username not found";
    } catch (error) {
        console.error("Error fetching user details:", error.message);
        return "Username not found";
    }
};

const check_user_status = async () => {
    try {
        const user_id = config.user_id;
        // POST request to Roblox presence API to get the user's current presence
        const presence_response = await axiosInstance.post("https://presence.roblox.com/v1/presence/users", {
            userIds: [user_id],
        });

        // Interpreting the presence response to set user status
        const user_presence_type = presence_response.data.userPresences[0]?.userPresenceType || roblox_status.not_in_game;
        const status = user_presence_type === roblox_status.in_game ? "in_game" : "not_in_game";

        const username = await get_user_details(user_id);  // Getting the username for the webhook

        if (status === "in_game") {
            await send_to_discord(username, "In game", user_id);
        }
    } catch (error) {
        console.error("Main error:", error.message);
    }
};

// Prepares and sends a Discord webhook payload
const send_to_discord = async (username, status, user_id) => {
    const profile_url = `https://www.roblox.com/users/${user_id}/profile`;

    const payload = {
        embeds: [{
            title: "sniper",
            description: `user \`${username}\` (id: \`${user_id}\`) is currently **${status}**.`,
            color: 5814783,
            url: profile_url,
        }],
    };

    try {
        await axiosInstance.post(config.webhook_url, payload);  // Sending the webhook
    } catch (error) {
        console.error("Error sending to discord:", error.message);
    }
};

setInterval(check_user_status, 2 * 60 * 1000); // Sets a 2 minute interval for status check

check_user_status();
