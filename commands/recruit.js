/* eslint-disable no-constant-condition */
const {
	SlashCommandBuilder,
} = require('@discordjs/builders');
const {
	MessageEmbed,
	WebhookClient,
} = require('discord.js');
const {
	givers,
} = require('../database/old/ranks.json');
const {
	lspd,
} = require('../database/dbTables');
const prettyMilliseconds = require('pretty-ms');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('recruit')
		.setDescription('Stellt einen Officer automatisch ein')
		.addUserOption(option =>
			option.setName('officer')
				.setDescription('Der Officer, welcher eingestellt werden soll')
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
		.addNumberOption(option =>
			option.setName('phonenumber')
				.setDescription('Telefonnummer des Officers')
				.setRequired(true))
		.addBooleanOption(option =>
			option.setName('gwd')
				.setDescription('GWD-Status des Officers')
				.setRequired(true))
		.addBooleanOption(option =>
			option.setName('ga')
				.setDescription('GA-Status des Officers')
				.setRequired(true)),

	async execute(interaction) {
		const member = interaction.options.getMember('officer');
		const firstName = interaction.options.getString('firstname');
		const lastName = interaction.options.getString('lastname');
		const phoneNumber = interaction.options.getNumber('phonenumber');
		const serviceNumber = interaction.options.getNumber('servicenumber');
		const gwd = interaction.options.getBoolean('gwd');
		const ga = interaction.options.getBoolean('ga');

		const embedBuilder = new MessageEmbed();

		embedBuilder.setColor('#04234f')
			.setFooter({
				text: `Ray-ID › ${interaction.id}\nCopyright © 2022 newa.media`,
				iconURL: interaction.user.avatarURL(),
			})
			.setTimestamp();

		if ((!interaction.member.roles.cache.some(userRoles => userRoles.id === '946141320437723136'))) {
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

			await interaction.reply({
				embeds: [embedBuilder],
				ephemeral: true,
			});
			return;
		} else {
			await lspd.create({
				discordId: member.user.id,
				firstName: firstName,
				lastName: lastName,
				phoneNumber: phoneNumber,
				serviceNumber: serviceNumber,
				sanctionPoints: '0',
				warns: '0',
				gwd: gwd,
				ga: ga,
			});
		}

		await member.setNickname(serviceNumber + ' | ' + firstName + ' ' + lastName, interaction.member.nickname + ' verwendet: /recruit ' + member.user.username);

		const gwd_roles = ['946130627726544956', '949638519427575829', '946156330647961660', '946156329934938182', '946130563482398720', '946141318030196796', '946130347337347157', '946136381799952444'];
		const ga_roles = ['946130627726544956', '949638519427575829', '946156330647961660', '946156329934938182', '946130563482398720', '946141319217184829', '946130347337347157', '946136381799952444'];

		if (gwd) await member.roles.add(gwd_roles, interaction.member.nickname + ' verwendet: /recruit ' + member.nickname + ' (GWD angegeben)');
		if (ga) await member.roles.add(ga_roles, interaction.member.nickname + ' verwendet: /recruit ' + member.nickname + ' (GA angegeben)');

		await interaction.reply({
			content: '10-4, wurde gemacht. Ich habe alles nötige erledigt. Erstelle bitte anschließend einen Arbeitsvertrag.',
			ephemeral: true,
		});

		embedBuilder.setTitle('👋 » Einstellung')
			.setDescription(`Sehr geehrte Kolleginnen & Kollegen,
			zur Kenntnisnahme, es erfolgte **eine Einweisung** in den Polizeidienst.
			
			<@${member.id}>
			
			Herzlich willkommen im Police Department!`);

		new WebhookClient({
			id: '949933275542065152',
			token: 'I8F4gzPBP6hzFCduumpdtdsznZphHMXttZUDUxXPMHLACc5p4cYwMbQ_oTfukE22eZcC',
		}).send({
			username: `${interaction.member.nickname} | powered by nightmare API`,
			avatarURL: 'https://cdn.newa.media/static/content/int/efuNuzVFy/l_4phwhcVwzTRGAzncjPwx.png',
			embeds: [embedBuilder],
		});

		embedBuilder.setTitle('👋 » Einstellung')
			.setDescription(`${member.user.toString()} wurde von ${interaction.user.toString()} eingestellt.`)
			.addField('Vorname', firstName, true)
			.addField('Nachname', lastName, true)
			.addField('Dienstnummer', serviceNumber.toString(), true);

		new WebhookClient({
			id: '949933029789413407',
			token: '9Deal-2wxttc4txPm4RB3v_xJ0fG4-rrPEzQwiIuAkjZLl58oD-w62ffTaQU-DrS27s3',
		}).send({
			username: `${interaction.member.nickname} | powered by nightmare API`,
			avatarURL: 'https://cdn.newa.media/static/content/int/efuNuzVFy/l_4phwhcVwzTRGAzncjPwx.png',
			embeds: [embedBuilder],
		});
	},
};