/* eslint-disable no-unused-vars */
const logger = require('../utilities/logger');
const {
	MessageEmbed,
	WebhookClient,
	Permissions,
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
	name: 'ready',
	once: true,
	async execute(client) {
		if (client.guilds.cache.size > 1) {
			logger.info(`Da bin ich, verbunden als ${client.user.tag}. Ich befinde mich auf ${client.guilds.cache.size} Servern.`);
		} else {
			logger.info(`Da bin ich, verbunden als ${client.user.tag}. Ich befinde mich auf einem Server.`);
		}

		const link = client.generateInvite({
			permissions: [
				Permissions.FLAGS.ADMINISTRATOR,
			],
			scopes: ['bot'],
		});

		logger.info(link);

		// Syncs all tables
		lspd.sync();
		bot.sync();
		activity.sync({
			force: true, // Deletes all entries in that table and re-creates it
		});

		// tries to find a owner-id
		const found = await bot.findOne({
			where: {
				ownerId: '272663056075456512',
			},
		});
		if (found) found.increment('version'); // Increments the "version"-field +1 times

		const wechselgeld = client.users.cache.find(user => user.id === ownerId);
		const embedBuilder = new MessageEmbed();

		embedBuilder.setColor('#04234f')
			.setDescription('Der Bot-Account ist nun online und kann Anfragen verarbeiten.')
			.setTitle('Bot online')
			.addField('Version', versionString, true)
			.addField('Neustart durch', '<@' + wechselgeld.id + '>', true)
			.addField('Einladungs-Link', link, false)
			.setFooter({
				text: 'Ray-ID › ' + Date.now() + '\nCopyright © 2022 newa.media',
				iconURL: wechselgeld.avatarURL(),
			})
			.setTimestamp();

		// Logging-Webhook: Bot log
		new WebhookClient({
			id: '949640596501434438',
			token: 'EyI8kPu9Z0o9tnG7DPvF2ENKgWulrodqKjJbdBf7g4p5ZWYBU6bJJ9IcrQdhj5cA87Ux',
		}).send({
			username: `${wechselgeld.username} | powered by nightmare API`,
			avatarURL: 'https://cdn.newa.media/static/content/int/efuNuzVFy/l_4phwhcVwzTRGAzncjPwx.png',
			embeds: [embedBuilder],
		});
	},
};