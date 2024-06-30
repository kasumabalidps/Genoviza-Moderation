const captcha = require("../../utils/captcha");

module.exports = async (client, interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "verify") {
        const captchaInstance = captcha(client);
        captchaInstance.present(interaction.member);
    }
};
