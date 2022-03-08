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
	name: 'guildBanAdd',
	once: false,
	async execute(ban) {
		const embedBuilder = new MessageEmbed();

		embedBuilder.setColor('#04234f')
			.setTitle('Bann erstellt')
			.setDescription('<@' + ban.user.id + '> wurde von diesem Discord gebannt.')
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
			content: '⚠️ <@&946129353958387742>',
			username: 'LSPD Butler | powered by nightmare API',
			avatarURL: 'https://cdn.newa.media/static/content/int/efuNuzVFy/l_4phwhcVwzTRGAzncjPwx.png',
			embeds: [embedBuilder],
		});
	},
};