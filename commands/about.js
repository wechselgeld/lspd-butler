const {
	SlashCommandBuilder,
} = require('@discordjs/builders');
const {
	MessageEmbed,
} = require('discord.js');
const {
	lspd,
} = require('../database/dbTables');
const prettyMilliseconds = require('pretty-ms');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('Zeigt Dir Informationen über einen bestimmten Officer')
		.addUserOption(option =>
			option.setName('officer')
				.setDescription('Der Officer, über welchen Du mehr wissen möchtest')
				.setRequired(true)),

	async execute(interaction) {
		const member = interaction.options.getMember('officer');

		const found = await lspd.findOne({
			where: {
				discordId: member.user.id,
			},
		});

		const embedBuilder = new MessageEmbed()
			.setColor('#04234f')
			.setFooter({
				text: `Ray-ID › ${interaction.id}\nCopyright © 2022 newa.media`,
				iconURL: interaction.user.avatarURL(),
			})
			.setTimestamp();

		if (found) {
			embedBuilder.setTitle('Informationen über ' + member.nickname);

			if (!(found.firstName == 'Nicht angegeben')) await embedBuilder.addField('Vorname', found.firstName, true);
			if (!(found.lastName == 'Nicht angegeben')) await embedBuilder.addField('Nachname', found.lastName, true);
			if (!(found.serviceNumber == 'Nicht angegeben')) await embedBuilder.addField('Dienstnummer', found.serviceNumber, true);

			if (found.activity == '100') {
				await embedBuilder.addField('Dienstzeit diese Woche', 'Keine gesammelt', true);
			} else {
				await embedBuilder.addField('Dienstzeit diese Woche', prettyMilliseconds(parseInt(found.activity)), true);
			}

			if (found.lifetimeActivity == '100') {
				await embedBuilder.addField('Dienstzeit gesamt', 'Keine gesammelt', true);
			} else {
				await embedBuilder.addField('Dienstzeit gesamt', prettyMilliseconds(parseInt(found.lifetimeActivity)), true);
			}

			if (!(found.rank == 'Nicht angegeben')) await embedBuilder.addField('Rang', found.rank, true);

			if (!(found.sanctionPoints == 'Nicht angegeben')) await embedBuilder.addField('Strafpunkte', found.sanctionPoints, true);
			if (!(found.warns == 'Nicht angegeben')) await embedBuilder.addField('Abmahnungen', found.warns, true);
			if (!(found.phoneNumber == 'Nicht angegeben')) await embedBuilder.addField('Telefonnummer', found.phoneNumber, true);
		} else {
			embedBuilder
				.setTitle('Hier ist nichts... außer Spinnenweben! 🕸️')
				.setDescription('Ich kann in meiner Datenbank keine Einträge über <@' + member.id + '> finden.');
		}

		await interaction.reply({
			fetchReply: true,
			ephemeral: true,
			embeds: [embedBuilder],
		});
	},
};