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
	name: 'inviteCreate',
	once: false,
	async execute(invite) {
		const embedBuilder = new MessageEmbed();

		embedBuilder.setColor('#04234f')
			.setTitle('Einladung erstellt')
			.setDescription('<@' + invite.inviterId + '> hat eine Einladung zum Discord erstellt.')
			.addField('Code', invite.code, true)
			.addField('Ablauf', invite.expiresAt.toDateString(), true)
			.addField('Kanal', '<#' + invite.channelId + '>', true)
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