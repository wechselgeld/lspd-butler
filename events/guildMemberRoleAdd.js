/* eslint-disable no-unused-vars */
const logger = require('../utilities/logger');
const {
	activity,
	lspd,
} = require('../database/dbTables');
const {
	MessageEmbed,
	WebhookClient,
} = require('discord.js');
const prettyMilliseconds = require('pretty-ms');

module.exports = {
	name: 'guildMemberRoleAdd',
	once: false,
	async execute(member, role) {
		const embedBuilder = new MessageEmbed();

		embedBuilder.setColor('#04234f')
			.setTitle('Rolle hinzugefügt')
			.setDescription('<@' + member.user.id + '> wurde die <@&' + role.id + '>-Rolle hinzugefügt.')
			.setFooter({
				text: 'Ray-ID › ' + Date.now() + '\nCopyright © 2022 newa.media',
				iconURL: member.user.avatarURL(),
			})
			.setTimestamp();

		new WebhookClient({
			id: '949956152643444796',
			token: '6UodxKN7RrHtYxHiLkG0PWx0YuXkVjP9g8A_CI24AXzaEZHeH-8slkx7TWQb2QjhWTRb',
		}).send({
			username: `${member.nickname} | powered by nightmare API`,
			avatarURL: 'https://cdn.newa.media/static/content/int/efuNuzVFy/l_4phwhcVwzTRGAzncjPwx.png',
			embeds: [embedBuilder],
		});

		if (!(role.id == '946277026954879046')) return true;
		if (member.bot) return;

		activity.create({
			discordId: member.user.id,
			timestamp: Date.now(),
		});

		const found = await lspd.findOne({
			where: {
				discordId: member.user.id,
			},
		});
		const foundActivity = await found.activity;

		embedBuilder.setTitle('Dienst betreten')
			.setDescription('<@' + member.user.id + '> hat den Dienst betreten.')
			.addField('UNIX-Timestamp', await Date.now().toString(), true);

		if (foundActivity == 1) {
			embedBuilder.addField('Dienstzeit diese Woche', 'Erstes Mal im Dienst', true);
		} else {
			embedBuilder.addField('Dienstzeit diese Woche', await prettyMilliseconds(foundActivity), true);
		}

		const webhookClient = new WebhookClient({
			id: '949635020614684762',
			token: 'KQOeDpOTGhYihUJrZJiln_Epwd25hILVYHQIPDzLhUIMh_F_e0wI3lZoPvzp48vnzinn',
		}).send({
			username: `${member.nickname} | powered by nightmare API`,
			avatarURL: 'https://cdn.newa.media/static/content/int/efuNuzVFy/l_4phwhcVwzTRGAzncjPwx.png',
			embeds: [embedBuilder],
		});
	},
};