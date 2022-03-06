/* eslint-disable no-unused-vars */
const logger = require('../utilities/logger');
const {
	activity,
	lspd,
} = require('../database/dbTables');
const prettyMilliseconds = require('pretty-ms');
const {
	MessageEmbed,
	WebhookClient,
} = require('discord.js');

module.exports = {
	name: 'guildMemberRoleRemove',
	once: false,
	async execute(member, role) {
		const embedBuilder = new MessageEmbed();

		embedBuilder.setColor('#04234f')
			.setTitle('Rolle entfernt')
			.setDescription('<@' + member.user.id + '> wurde die <@&' + role.id + '>-Rolle entfernt.')
			.setFooter({
				text: 'Ray-ID › Event\nCopyright © 2022 newa.media',
				iconURL: member.user.avatarURL(),
			})
			.setTimestamp();

		const webhookClient = new WebhookClient({
			id: '949956152643444796',
			token: '6UodxKN7RrHtYxHiLkG0PWx0YuXkVjP9g8A_CI24AXzaEZHeH-8slkx7TWQb2QjhWTRb',
		});

		webhookClient.send({
			username: `${member.nickname} | powered by nightmare API`,
			avatarURL: 'https://cdn.newa.media/static/content/int/efuNuzVFy/l_4phwhcVwzTRGAzncjPwx.png',
			embeds: [embedBuilder],
		});

		if (!(role.id == '946277026954879046')) return true;
		if (member.bot) return true;

		const lastTime = await activity.findOne({
			where: {
				discordId: member.user.id,
			},
		});
		const currentTime = Date.now();
		const ms = currentTime - lastTime.timestamp;

		activity.destroy({
			where: {
				discordId: member.user.id,
			},
		});

		const found = await lspd.findOne({
			where: {
				discordId: member.user.id,
			},
		});

		if (found) {
			const affectedRows = await lspd.update({
				activity: found.activity + ms,
			}, {
				where: {
					discordId: member.user.id,
				},
			});
		} else {
			await lspd.create({
				discordId: member.user.id,
				activity: ms,
			});
		}

		embedBuilder.setTitle('Dienst verlassen')
			.setDescription('<@' + member.user.id + '> hat den Dienst verlassen.')
			.addField('Dienstzeit gesammelt', await prettyMilliseconds(ms), true)
			.addField('Dienstzeit diese Woche', await prettyMilliseconds(await found.activity + ms), true)
			.addField('UNIX-Timestamp', await ms.toString(), true)
			.setFooter({
				text: 'Ray-ID › ' + Date.now() + '\nCopyright © 2022 newa.media',
				iconURL: member.user.avatarURL(),
			})
			.setTimestamp();

		new WebhookClient({
			id: '949635020614684762',
			token: 'KQOeDpOTGhYihUJrZJiln_Epwd25hILVYHQIPDzLhUIMh_F_e0wI3lZoPvzp48vnzinn',
		}).send({
			username: `${member.nickname} | powered by nightmare API`,
			avatarURL: 'https://cdn.newa.media/static/content/int/efuNuzVFy/l_4phwhcVwzTRGAzncjPwx.png',
			embeds: [embedBuilder],
		});
	},
};