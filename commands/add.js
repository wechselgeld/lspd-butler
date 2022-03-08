const {
	SlashCommandBuilder,
} = require('@discordjs/builders');
const {
	MessageEmbed,
} = require('discord.js');
const {
	lspd,
} = require('../database/dbTables');
const logger = require('../utilities/logger');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add')
		.setDescription('Fügt Daten zur Datenbank hinzu')
		.addUserOption(option =>
			option.setName('officer')
				.setDescription('Der Officer, welcher hinzugefügt werden soll')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('firstname')
				.setDescription('Vorname des Officers')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('lastname')
				.setDescription('Nachname(n) des Officers')
				.setRequired(true))
		.addNumberOption(option =>
			option.setName('servicenumber')
				.setDescription('Dienstnummer des Officers')
				.setRequired(true))
		.addBooleanOption(option =>
			option.setName('ga')
				.setDescription('GA-Status des Officers')
				.setRequired(true))
		.addRoleOption(option =>
			option.setName('rank')
				.setDescription('Der Rang des Officers')
				.setRequired(true))
		.addNumberOption(option =>
			option.setName('warns')
				.setDescription('Aktuelle Anzahl der Abmahnungen (In Zahlen)')
				.setRequired(true))
		.addNumberOption(option =>
			option.setName('phonenumber')
				.setDescription('Telefonnummer des Officers')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('sanctionpoints')
				.setDescription('Aktuelle Anzahl an Strafpunkten des Officers')
				.setRequired(true)),

	async execute(interaction) {
		const member = interaction.options.getMember('officer');
		const firstName = interaction.options.getString('firstname');
		const lastName = interaction.options.getString('lastname');
		const phoneNumber = interaction.options.getNumber('phonenumber');
		const serviceNumber = interaction.options.getNumber('servicenumber');
		const sanctionPoints = interaction.options.getInteger('sanctionpoints');
		const warns = interaction.options.getNumber('warns');
		const ga = interaction.options.getBoolean('ga');
		const rank = interaction.options.getRole('rank');

		const embedBuilder = new MessageEmbed()
			.setColor('#04234f')
			.setFooter({
				text: `Ray-ID › ${interaction.id}\nCopyright © 2022 newa.media`,
				iconURL: interaction.user.avatarURL(),
			})
			.setTimestamp();

		if (!(interaction.member.roles.cache.some(userRoles => userRoles.id === '946129353958387742'))) {
			embedBuilder.setTitle('Sorry, Du bist nicht der, den ich erwartet habe... 🔍')
				.setDescription('Dir fehlt die Berechtigung, um den Befehl ausführen zu dürfen.\n*Du glaubst, dass das ein Fehler ist? Wende Dich bitte an <@272663056075456512>!*');

			interaction.reply({
				embeds: [embedBuilder],
				ephemeral: true,
			});
			return;
		}

		const found = await lspd.findOne({
			where: {
				discordId: member.user.id,
			},
		});

		if (found) {
			embedBuilder
				.setTitle(member.nickname + ' existiert bereits')
				.setDescription('Ich zeige Dir stattdessen alle Informationen, welche angegeben wurden.')
				.addField('Vor- und Nachname', found.firstName + ' ' + found.lastName, true)
				.addField('Dienstnummer', 'LSPD-' + found.serviceNumber.toString(), true)
				.addField('Telefonnummer', found.phoneNumber.toString(), true)
				.addField('Strafpunkte', found.sanctionPoints.toString(), true)
				.addField('Rang', found.rank.toString(), true)
				.addField('Abmahnungen', found.warns.toString(), true)
				.addField('GWD', found.gwd.toString().replace('false', '❌'), true)
				.addField('GA', found.ga.toString().replace('true', '✅' || 'false', '❌'), true);
		} else {
			await lspd.create({
				discordId: member.user.id,
				firstName: firstName,
				lastName: lastName,
				serviceNumber: serviceNumber,
				ga: ga,
				rank: rank.name,
				sanctionPoints: sanctionPoints,
				warns: warns,
				phoneNumber: phoneNumber,
			});

			embedBuilder
				.setTitle('Danke, dass Du meine Datenbank fütterst! 🍖')
				.setDescription('Ich habe die angegebene Person angelegt.');
		}

		await interaction.reply({
			fetchReply: true,
			ephemeral: true,
			embeds: [embedBuilder],
		});
	},
};