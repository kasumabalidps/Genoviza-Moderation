module.exports = async (client, interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "verify") {
        const captcha = require('../../utils/captcha')(client);
        captcha.present(interaction.member);
    }
};
