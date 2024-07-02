module.exports = {
    data: {
        name: "restart",
        description: "Restart Bot",
    },
    async execute(message) {
        if (message.author.id !== "832491713653637172") {
            await message.channel.send("Kamu tidak bisa menggunakan Command ini!!");
            return;
        }
        await message.channel.send("🔃 Restarting...");
        process.exit(0);
    }
}