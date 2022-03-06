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
	name: 'ready',
	once: true,
	async execute(client) {
		if (client.guilds.cache.size > 1) {
			logger.info(`Da bin ich, verbunden als ${client.user.tag}. Ich befinde mich auf ${client.guilds.cache.size} Servern.`);
		} else {
			logger.info(`Da bin ich, verbunden als ${client.user.tag}. Ich befinde mich auf einem Server.`);
		}
		logger.info('https://discord.com/oauth2/authorize?client_id=945919052327559178&scope=bot&permissions=8');

		lspd.sync();
		bot.sync();
		activity.sync({
			force: true,
		});

		const found = await bot.findOne({
			where: {
				ownerId: '272663056075456512',
			},
		});
		if (found) found.increment('version');

		const wechselgeld = client.users.cache.find(user => user.id === ownerId);
		const embedBuilder = new MessageEmbed();

		embedBuilder.setColor('#04234f')
			.setAuthor({
				name: 'Los Santos Police Department',
				iconURL: 'https://cdn.newa.media/static/content/int/efuNuzVFy/l_4phwhcVwzTRGAzncjPwx.png',
			})
			.setTitle('Bot online')
			.setDescription('Aktuelle Version › ' + versionString + '.' + found.version + '\nNeustart ausgeführt von › ' + wechselgeld.username)
			.setFooter({
				text: 'Ray-ID › Event\nCopyright © 2022 newa.media',
				iconURL: wechselgeld.avatarURL(),
			})
			.setTimestamp();

		const webhookClient = new WebhookClient({
			id: '949640596501434438',
			token: 'EyI8kPu9Z0o9tnG7DPvF2ENKgWulrodqKjJbdBf7g4p5ZWYBU6bJJ9IcrQdhj5cA87Ux',
		}).send({
			username: `${wechselgeld.username} | powered by nightmare API`,
			avatarURL: 'https://cdn.newa.media/static/content/int/efuNuzVFy/l_4phwhcVwzTRGAzncjPwx.png',
			embeds: [embedBuilder],
		});
	},
};