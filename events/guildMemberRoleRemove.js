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
		const embedBuilder = new MessageEmbed()
			.setColor('#04234f')
			.setFooter({
				text: 'Ray-ID › ' + Date.now() + '\nCopyright © 2022 newa.media',
				iconURL: member.user.avatarURL(),
			})
			.setTimestamp();

		embedBuilder.setTitle('Rolle entfernt')
			.setDescription('<@' + member.user.id + '> wurde die <@&' + role.id + '>-Rolle entfernt.');

		// Logging-Webhook: Role removed
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

		// Finds the created entry in "activities" when the officer got on-duty
		const lastTime = await activity.findOne({
			where: {
				discordId: member.user.id,
			},
		});

		if (lastTime) {
			const currentTime = Date.now();
			const ms = await currentTime - lastTime.timestamp;
	
			// Deletes the generated entry in "activities" so the officer can get a new one
			activity.destroy({
				where: {
					discordId: member.user.id,
				},
			});
	
			// Finds a entry in "lspds" with the member-id
			const found = await lspd.findOne({
				where: {
					discordId: member.user.id,
				},
			});
	
			if (found) { // If a entry was found
				// Edites the "activity"-field & the "lifetimeActivity"-field of the found found entry in "lspds"
				await found.update({
					activity: found.activity + ms,
					lifetimeActivity: found.activity + ms,
				});
			} else { // If it wasn't found
				// Creates a entry
				await lspd.create({
					discordId: member.user.id,
					activity: ms,
				});
			}

			embedBuilder.addField('Dienstzeit gesammelt', await prettyMilliseconds(ms), true)
				.addField('UNIX-Timestamp', await ms.toString(), true);
		}

		embedBuilder.setTitle('Dienst verlassen')
			.setDescription('<@' + member.user.id + '> hat den Dienst verlassen.');

		// Logging-Webhook: Off-duty
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