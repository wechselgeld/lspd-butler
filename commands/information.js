const {
	SlashCommandBuilder,
} = require('@discordjs/builders');
const {
	MessageEmbed,
} = require('discord.js');
const {
	versionString,
} = require('../database/old/data.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('information')
		.setDescription('Zeigt Dir Informationen über den Bot'),

	async execute(interaction) {
		const embedBuilder = new MessageEmbed()
			.setColor('#04234f')
			.setTitle('Oh, Du willst also mehr über mich wissen? 😇')
			.setDescription(`
			Ich bin der LSPD Butler, gemacht von wechselgeld\nMeine Aufgabe ist es, dem Police Department auf LifeV jegliche Aufgaben abzunehmen und zu automatisieren.

			Mein System basiert auf der nightmare API, welche sich in der Version ${versionString} befindet. Das Projekt verwendet [Semver (Semantic Versioning)](https://semver.org/lang/de/), um eine Versionsnummer zu generieren.
			
			Du willst mehr über den Entwickler erfahren? Ich werde von [newa.media](https://newa.media/nightmare) entwickelt. Das Projekt im Großen und Ganzen steht in der Verantwortung von <@272663056075456512>.`)
			.setFooter({
				text: `Ray-ID › ${interaction.id}\nCopyright © 2022 newa.media`,
				iconURL: interaction.user.avatarURL(),
			})
			.setTimestamp();

		interaction.reply({
			fetchReply: true,
			ephemeral: true,
			embeds: [embedBuilder],
		});
	},
};