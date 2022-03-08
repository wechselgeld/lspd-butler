const {
	SlashCommandBuilder,
} = require('@discordjs/builders');
const {
	MessageActionRow,
	MessageButton,
	MessageEmbed,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Antwortet mit der aktuellen Latenz'),

	async execute(interaction) {
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setStyle('LINK')
					.setLabel('NEWA Media-Status')
					.setURL('https://status.newa.media')
					.setDisabled(false),
			);

		const embedBuilder = new MessageEmbed()
			.setColor('#04234f')
			.setAuthor({
				name: 'Los Santos Police Department',
				iconURL: 'https://cdn.newa.media/static/content/int/efuNuzVFy/l_4phwhcVwzTRGAzncjPwx.png',
			})
			.setFooter({
				text: `Ray-ID › ${interaction.id}\nCopyright © 2022 newa.media`,
				iconURL: interaction.user.avatarURL(),
			})
			.setTimestamp();

		embedBuilder.setTitle('Ich teste die Verbindung...')
			.setDescription('Bitte warte, ich teste gerade die Websocket und Schnitstellen-Latenz.');

		const sent = await interaction.reply({
			fetchReply: true,
			ephemeral: true,
			embeds: [embedBuilder],
			components: [row],
		});

		const roundtripLatency = sent.createdTimestamp - interaction.createdTimestamp;

		if (roundtripLatency > 350) {
			embedBuilder.setTitle('Ich bin schon einmal schneller gelaufen... 😟')
				.setDescription(`Meine Schnittstelle weist eine Latenz von ${Math.round(interaction.client.ws.ping)}ms auf.
				Die Roundtrip-Latenz beträgt ${roundtripLatency}ms. Das ist in einem akzeptablen Bereich, aber keine Spitzenleistung.`);
		} else if (roundtripLatency < 350) {
			embedBuilder.setTitle('Fast so schnell wie Usain Bolt, oder? 🏃')
				.setDescription(`Meine Schnittstelle weist eine Latenz von ${Math.round(interaction.client.ws.ping)}ms auf.
				Die Roundtrip-Latenz beträgt ${roundtripLatency}ms. Das ist ganz normal und ein guter Wert!`);
		}

		interaction.editReply({
			fetchReply: true,
			ephemeral: true,
			embeds: [embedBuilder],
			components: [row],
		});
	},
};