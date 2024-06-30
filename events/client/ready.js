const { ActivityType } = require("discord.js");

module.exports = (client) => {
    console.log(`🚀 Genoviza Bot Online!`);
    let memberCount = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
    let isWatchingServer = true;
    setInterval(() => {
        if (isWatchingServer) {
            client.user.setActivity({ type: ActivityType.Watching, name: `Genoviza Server 👑` });
            isWatchingServer = false;
        } else {
            client.user.setActivity({ type: ActivityType.Watching, name: `Members: ${memberCount} 🤵` });
            isWatchingServer = true;
        }
        memberCount = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
    }, 7 * 1000);
};
