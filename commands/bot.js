const {
	SlashCommandBuilder,
} = require('@discordjs/builders');
const {
	MessageEmbed,
	WebhookClient,
} = require('discord.js');
const {
	ownerId,
} = require('../database/old/data.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bot')
		.setDescription('Editiert den Bot-Account.')
		.addSubcommand(subCommand => subCommand.setName('shutdown').setDescription('Fährt den Bot herunter'))
		.addSubcommand(subCommand => subCommand.setName('avatar').setDescription('Ändert den aktuellen Avatar des Bot-Accounts')
			.addStringOption(option =>
				option.setName('link')
					.setDescription('Der direkte Bild-Link')
					.setRequired(true)))
		.addSubcommand(subCommand => subCommand.setName('username').setDescription('Ändert den aktuellen Nutzernamen des Bot-Accounts')
			.addStringOption(option =>
				option.setName('name')
					.setDescription('Der neue Benutzername')
					.setRequired(true))),

	async execute(interaction) {
		const avatar = interaction.options.getString('link');
		const username = interaction.options.getString('name');

		const embedBuilder = new MessageEmbed()
			.setColor('#04234f')
			.setFooter({
				text: `Ray-ID › ${interaction.id}\nCopyright © 2022 newa.media`,
				iconURL: interaction.user.avatarURL(),
			})
			.setTimestamp();

		if (!(interaction.user.id == '272663056075456512')) {
			embedBuilder.setTitle('Sorry, Du bist nicht der, den ich erwartet habe... 🔍')
				.setDescription('Dir fehlt die Berechtigung, um den Befehl ausführen zu dürfen.\n*Du glaubst, dass das ein Fehler ist? Wende Dich bitte an <@272663056075456512>!*');

			return interaction.reply({
				embeds: [embedBuilder],
				ephemeral: true,
			});
		}

		const wechselgeld = interaction.client.users.cache.find(user => user.id === ownerId);
		const webhookClient = new WebhookClient({
			id: '949640596501434438',
			token: 'EyI8kPu9Z0o9tnG7DPvF2ENKgWulrodqKjJbdBf7g4p5ZWYBU6bJJ9IcrQdhj5cA87Ux',
		});

		switch (interaction.options.getSubcommand()) {
		case 'shutdown':
			embedBuilder.setTitle('Ich lege mich ersteinmal schlafen... 😴')
				.setDescription('Gute Nacht, ich lege mich jetzt etwas schlafen... Schau auf den [NEWA Media-Status](https://status.newa.media), um jederzeit zu wissen, wann ich offline oder online bin.');

			await interaction.reply({
				fetchReply: true,
				ephemeral: true,
				embeds: [embedBuilder],
			});

			embedBuilder.setTitle('Bot offline')
				.setDescription('Befehl ausgeführt von › ' + wechselgeld.username);

			webhookClient.send({
				username: `${wechselgeld.username} | powered by nightmare API`,
				avatarURL: 'https://cdn.newa.media/static/content/int/efuNuzVFy/l_4phwhcVwzTRGAzncjPwx.png',
				embeds: [embedBuilder],
			});

			await interaction.client.destroy();
			process.exit();
			break;
		case 'avatar':
			if (!avatar.endsWith('.png', '.jpg', '.webp')) {
				embedBuilder.setTitle('Das schaut nicht ganz richtig aus... 🤨')
					.setDescription('Du musst den direkten Bildlink einfügen. Darunter zählen z. B. Links, welche am Ende eine Dateiendung beinhalten.\n*Erlaubte Dateiformate sind ".png", ".jpg" und ".webp".*').setImage(null);

				await interaction.reply({
					fetchReply: true,
					ephemeral: true,
					embeds: [embedBuilder],
				});
				return;
			}

			interaction.client.user.setAvatar(avatar);

			embedBuilder.setDescription('Perfekt, ich habe mein Avatar-Bild erfolgreich geändert. Unten findest Du das Bild angehängt.')
				.setFooter({
					text: `Ray-ID › ${interaction.id}\nCopyright © 2022 newa.media`,
					iconURL: interaction.user.avatarURL(),
				})
				.setImage(avatar);

			await interaction.reply({
				fetchReply: true,
				ephemeral: true,
				embeds: [embedBuilder],
			});

			embedBuilder.setTitle('Avatar geändert')
				.setDescription('Mein Avatar wurde von ' + interaction.user.toString() + ' geändert.');

			webhookClient.send({
				username: `${wechselgeld.username} | powered by nightmare API`,
				avatarURL: 'https://cdn.newa.media/static/content/int/efuNuzVFy/l_4phwhcVwzTRGAzncjPwx.png',
				embeds: [embedBuilder],
			});
			break;
		case 'username':
			interaction.client.user.setUsername(username).catch(error => {
				embedBuilder.setTitle('Da ist etwas schief gelaufen... 😒')
					.setDescription(error.toString());
				interaction.reply({
					fetchReply: true,
					ephemeral: true,
					embeds: [embedBuilder],
				});
				return;
			});

			embedBuilder.setTitle('Wow, das klingt aber gut! 🎉')
				.setDescription('Ich habe mir den Nutzernamen erfolgreich gesetzt.');

			await interaction.reply({
				fetchReply: true,
				ephemeral: true,
				embeds: [embedBuilder],
			});

			embedBuilder.setTitle('Username geändert')
				.setDescription('Mein Benutzername wurde von ' + interaction.user.toString() + ' geändert.')
				.addField('Neuer Nutzername', interaction.client.user.username, false);

			webhookClient.send({
				username: `${wechselgeld.username} | powered by nightmare API`,
				avatarURL: 'https://cdn.newa.media/static/content/int/efuNuzVFy/l_4phwhcVwzTRGAzncjPwx.png',
				embeds: [embedBuilder],
			});
			break;
		}
	},
};