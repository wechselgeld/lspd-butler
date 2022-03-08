/* eslint-disable no-unused-vars */
const logger = require('../utilities/logger');
const {
	MessageEmbed,
	WebhookClient,
} = require('discord.js');
const {
	versionString,
	ownerId,
} = require('../database/old/data.json');
const {
	lspd,
	activity,
	bot,
} = require('../database/dbTables');

module.exports = {
	name: 'rateLimit',
	once: true,
	async execute(rateLimitData) {
		logger.warn(`Mich hat ein Rate-Limit getroffen:\nGlobal? ${rateLimitData.global}\nPath? ${rateLimitData.path}\n Limit? ${rateLimitData.limit}\nTimeout? ${rateLimitData.timeout}`);

		const embedBuilder = new MessageEmbed();

		embedBuilder.setColor('#04234f')
			.setTitle('Rate-Limited')
			.setDescription('Ich habe ein Rate-Limit während einer Anfrage erhalten.\n```' + rateLimitData.toString + '```')
			.addField('Globales Limit', rateLimitData.global.toString(), true)
			.addField('Limit', rateLimitData.limit.toString(), true)
			.addField('Timeout', rateLimitData.timeout.toString(), true)
			.addField('Path', rateLimitData.path, false)
			.setFooter({
				text: 'Ray-ID › ' + Date.now() + '\nCopyright © 2022 newa.media',
				iconURL: 'https://cdn.newa.media/static/content/int/efuNuzVFy/l_4phwhcVwzTRGAzncjPwx.png',
			})
			.setTimestamp();

		// Logging-Webhook: Bot log
		const webhookClient = new WebhookClient({
			id: '949640596501434438',
			token: 'EyI8kPu9Z0o9tnG7DPvF2ENKgWulrodqKjJbdBf7g4p5ZWYBU6bJJ9IcrQdhj5cA87Ux',
		}).send({
			username: 'LSPD Butler | powered by nightmare API',
			avatarURL: 'https://cdn.newa.media/static/content/int/efuNuzVFy/l_4phwhcVwzTRGAzncjPwx.png',
			embeds: [embedBuilder],
		});
	},
};