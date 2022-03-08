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
		const embedBuilder = new MessageEmbed()
			.setColor('#04234f')
			.setFooter({
				text: 'Ray-ID › ' + Date.now() + '\nCopyright © 2022 newa.media',
				iconURL: member.user.avatarURL(),
			})
			.setTimestamp();

		embedBuilder.setTitle('Rolle hinzugefügt')
			.setDescription('<@' + member.user.id + '> wurde die <@&' + role.id + '>-Rolle hinzugefügt.');

		// Logging-Webhook: Role added
		new WebhookClient({
			id: '949956152643444796',
			token: '6UodxKN7RrHtYxHiLkG0PWx0YuXkVjP9g8A_CI24AXzaEZHeH-8slkx7TWQb2QjhWTRb',
		}).send({
			username: `${member.nickname} | powered by nightmare API`,
			avatarURL: 'https://cdn.newa.media/static/content/int/efuNuzVFy/l_4phwhcVwzTRGAzncjPwx.png',
			embeds: [embedBuilder],
		});

		if (!(role.id == '946277026954879046')) return true; // If the role !is the "Im Dienst"-Role
		if (!(member.roles.cache.some(userRoles => userRoles.id === '949638519427575829'))) return true; // If the user !has the "Ping-Rolle"-Role
		if (member.bot) return; // If the member is a bot

		// Create a entry in "activities"
		activity.create({
			discordId: member.user.id,
			timestamp: Date.now(),
		});

		// Trys to find a entry in lspds
		const found = await lspd.findOne({
			where: {
				discordId: member.user.id,
			},
		});

		// If it has found a entry in lspds and the found activity-field is 1
		if (found && found.activity == 1) {
			embedBuilder.addField('Dienstzeit diese Woche', 'Erstes Mal im Dienst', true);
		} else { // If not found or the activity-field has an other value than 1
			embedBuilder.addField('Dienstzeit diese Woche', 'Erstes Mal im Dienst', true);
		}

		embedBuilder.setTitle('Dienst betreten')
			.setDescription('<@' + member.user.id + '> hat den Dienst betreten.')
			.addField('UNIX-Timestamp', await Date.now().toString(), true);

		if (!found) {
			await lspd.create({
				discordId: member.user.id,
				serviceNumber: member.nickname.slice(0, 2),
			});

			if (member.roles.cache.some(userRoles => userRoles.id === '946141319217184829')) {lspd.update({
				ga: 'true',
			}, {
				where: {
					discordId: member.user.id,
				},
			});} // GA
			if (member.roles.cache.some(userRoles => userRoles.id === '946141318030196796')) {lspd.update({
				gwd: 'true',
			}, {
				where: {
					discordId: member.user.id,
				},
			});} // GWD
			if (member.roles.cache.some(userRoles => userRoles.id === '946141318629957652')) {lspd.update({
				aa: 'true',
			}, {
				where: {
					discordId: member.user.id,
				},
			});} // AA
			if (member.roles.cache.some(userRoles => userRoles.id === '946141791931994122')) {lspd.update({
				vf: 'true',
			}, {
				where: {
					discordId: member.user.id,
				},
			});} // AA
			if (member.roles.cache.some(userRoles => userRoles.id === '946141319716294726')) {lspd.update({
				la: 'true',
			}, {
				where: {
					discordId: member.user.id,
				},
			});} // AA
		}

		// Logging-Webhook: On-duty
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