/* eslint-disable no-unused-vars */
const logger = require('../utilities/logger');
const {
	activity,
} = require('../database/dbTables');
const {
	MessageEmbed,
	WebhookClient,
} = require('discord.js');

module.exports = {
	name: 'channelCreate',
	once: false,
	async execute(channel) {
		const embedBuilder = new MessageEmbed();

		embedBuilder.setColor('#04234f')
			.setTitle('Kanal erstellt')
			.setDescription('Der "' + channel.name + '"-Kanal wurde erstellt.')
			.addField('Position', channel.position.toString(), true)
			.addField('Typ', channel.type.toString(), true)
			.setFooter({
				text: 'Ray-ID › ' + Date.now() + '\nCopyright © 2022 newa.media',
				iconURL: 'https://cdn.newa.media/static/content/int/efuNuzVFy/l_4phwhcVwzTRGAzncjPwx.png',
			})
			.setTimestamp();

		// Logging-Webhook: Server, nickname-change
		new WebhookClient({
			id: '949956152643444796',
			token: '6UodxKN7RrHtYxHiLkG0PWx0YuXkVjP9g8A_CI24AXzaEZHeH-8slkx7TWQb2QjhWTRb',
		}).send({
			username: 'LSPD Butler | powered by nightmare API',
			avatarURL: 'https://cdn.newa.media/static/content/int/efuNuzVFy/l_4phwhcVwzTRGAzncjPwx.png',
			embeds: [embedBuilder],
		});
	},
};