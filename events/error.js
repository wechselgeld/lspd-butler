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
	name: 'error',
	once: true,
	async execute(error) {
		logger.error(error.name);
		logger.error(error.message);

		const embedBuilder = new MessageEmbed();

		embedBuilder.setColor('#04234f')
			.setTitle('Fehler')
			.setDescription('```' + error.message + '```')
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

process.on('uncaughtException', function(error) {
	logger.error(error);

	const embedBuilder = new MessageEmbed();

	embedBuilder.setColor('#04234f')
		.setTitle('Fehler')
		.setDescription('```' + error + '```')
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
});