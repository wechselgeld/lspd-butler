const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { lspd } = require('../database/dbTables');
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

		const found = await lspd.findOne({ where: { discordId: member.user.id } });

		const embedBuilder = new MessageEmbed();

		const gwd = found.gwd.toString();
		const ga = found.ga.toString();

		if (found) {
			embedBuilder
				.setTitle('Informationen über ' + member.nickname)
				.addField('Vor- und Nachname', found.firstName + ' ' + found.lastName, true)
				.addField('Dienstnummer', 'LSPD-' + found.serviceNumber.toString(), true)
				.addField('Telefonnummer', found.phoneNumber.toString(), true)
				.addField('Dienstzeit', prettyMilliseconds(found.activity), true)
				.addField('Strafpunkte', found.sanctionPoints.toString(), true)
				.addField('Rang', found.rank.toString(), true)
				.addField('Abmahnungen', found.warns.toString(), true)
				.addField('GWD', gwd.replace('false', '❌'), true)
				.addField('GA', ga.replace('true', '✅' || 'false', '❌'), true);
		} else {
			embedBuilder
				.setTitle('Hier ist nichts... außer Spinnenweben! 🕸️')
				.setDescription('Ich kann in meiner Datenbank keine Einträge über <@' + member.id + '> finden.');
		}

		await interaction.reply({ fetchReply: true, ephemeral: true, embeds: [embedBuilder] });
	},
};