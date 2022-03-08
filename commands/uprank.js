/* eslint-disable no-constant-condition */
const {
	SlashCommandBuilder,
} = require('@discordjs/builders');
const {
	MessageEmbed,
	WebhookClient,
} = require('discord.js');
const {
	giveableRanks,
	givers,
} = require('../database/old/ranks.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('uprank')
		.setDescription('Befördert einen Officer automatisch')
		.addUserOption(option =>
			option.setName('officer')
				.setDescription('Der Officer, welcher eine Beförderung erhalten soll')
				.setRequired(true))
		.addRoleOption(option =>
			option.setName('rang')
				.setDescription('Der Rang, auf welchen der Officer befördert werden soll')
				.setRequired(true)),

	async execute(interaction) {
		const member = interaction.options.getMember('officer');
		const role = interaction.options.getRole('rang');

		const embedBuilder = new MessageEmbed()
			.setColor('#04234f')
			.setFooter({
				text: `Ray-ID › ${interaction.id}\nCopyright © 2022 newa.media`,
				iconURL: interaction.user.avatarURL(),
			})
			.setTimestamp();

		if (!(interaction.member.roles.cache.some(userRoles => userRoles.id === givers))) { // If the user !has one of the giver-roles
			embedBuilder.setTitle('Sorry, Du bist nicht der, den ich erwartet habe... 🔍')
				.setDescription('Dir fehlt die Berechtigung, um den Befehl ausführen zu dürfen.\n*Du glaubst, dass das ein Fehler ist? Wende Dich bitte an <@272663056075456512>!*');

			return interaction.reply({
				embeds: [embedBuilder],
				ephemeral: true,
			});
		}

		if (!role.editable) { // If the role is too high for the bot
			embedBuilder.setTitle('Ups, irgendwie geht das nicht... 🤨')
				.setDescription(`Ich kann die <@&${role.id}>-Rolle nicht erteilen, da sie höher gestellt ist als meine.`);

			return interaction.reply({
				embeds: [embedBuilder],
				ephemeral: true,
			});
		}

		if (!giveableRanks.includes(role.id)) { // If the role is a giveable role that can be given with the command
			embedBuilder.setTitle('Hä? So hab ich mir das nicht vorgestellt... 🤨')
				.setDescription(`Die <@&${role.id}>-Rolle ist kein normaler Rang. Versuche es mit einem Rang von <@&946136030279524383> bis <@&946136381799952444>.`);

			return interaction.reply({
				embeds: [embedBuilder],
				ephemeral: true,
			});
		}

		await interaction.reply({
			content: `10-4, wurde gemacht. Ich habe <@${member.id}> die Rolle <@&${role.id}> hinzugefügt.`,
			ephemeral: true,
		});

		// Adds the specified role
		await member.roles.add(role);

		embedBuilder.setTitle('Beförderung')
			.setDescription(`Sehr geehrte Kolleginnen & Kollegen,
			zur Kenntnisnahme, es erfolgte **eine Beförderung**.
			
			<@${member.id}> ➙ <@&${role.id}>
			
			Herzlichen Glückwunsch! 🎉`);

		// Logging-Webhook: Uprank-Channel
		new WebhookClient({
			id: '948398318365585409',
			token: 'klKmpLqMapR_CGyhQDB7p-TKIkxDGT-TidpUHl_629j2DTs4uUdpUzSs2cIVz1kpArcg',
		}).send({
			username: `${interaction.member.nickname} | powered by nightmare API`,
			avatarURL: 'https://cdn.newa.media/static/content/int/efuNuzVFy/l_4phwhcVwzTRGAzncjPwx.png',
			embeds: [embedBuilder],
		});

		embedBuilder.setTitle('Beförderung')
			.setDescription(`<@${member.id}> ➙ <@&${role.id}>`);

		// Logging-Webhook: Personal-Channel
		new WebhookClient({
			id: '948429421013000243',
			token: 'jtMGrMp7fVaKpoiBXaoc-oyEUravk5UyQl01aboC2xQ6G-kJLrOpGLu4c_Yooc1nmBkx',
		}).send({
			username: `${interaction.member.nickname} | powered by nightmare API`,
			avatarURL: 'https://cdn.newa.media/static/content/int/efuNuzVFy/l_4phwhcVwzTRGAzncjPwx.png',
			embeds: [embedBuilder],
		});
	},
};