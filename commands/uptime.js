const {
	SlashCommandBuilder,
} = require('@discordjs/builders');
const {
	MessageActionRow,
	MessageButton,
	MessageEmbed,
} = require('discord.js');
const prettyMilliseconds = require('pretty-ms');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('uptime')
		.setDescription('Antwortet sekundengenau mit der aktuellen Uptime des Bot-Accounts.'),

	async execute(interaction) {
		const button = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setStyle('LINK')
					.setLabel('NEWA Media-Status')
					.setURL('https://status.newa.media')
					.setDisabled(false),
			);

		const embedBuilder = new MessageEmbed();

		embedBuilder.setColor('#04234f')
			.setAuthor({
				name: 'Los Santos Police Department',
				iconURL: 'https://cdn.newa.media/static/content/int/efuNuzVFy/l_4phwhcVwzTRGAzncjPwx.png',
			})
			.setTitle('Langsam werde ich echt müde... 🥱')
			.setDescription(`Ich bin bereits ${prettyMilliseconds(interaction.client.uptime)} am rattern!`)
			.setFooter({
				text: `Ray-ID › ${interaction.id}\nCopyright © 2022 newa.media`,
				iconURL: interaction.user.avatarURL(),
			})
			.setTimestamp();

		interaction.reply({
			fetchReply: true,
			ephemeral: true,
			embeds: [embedBuilder],
			components: [button],
		});
	},
};