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
	name: 'guildMemberNicknameUpdate',
	once: false,
	async execute(member, oldNickname, newNickname) {
		const embedBuilder = new MessageEmbed();

		embedBuilder.setColor('#04234f')
			.setTitle('Nickname geändert')
			.setDescription('<@' + member.user.id + '>\'s Nickname wurde geändert.')
			.addField('Alter Name', oldNickname, true)
			.addField('Neuer Name', newNickname, true)
			.setFooter({
				text: 'Ray-ID › ' + Date.now() + '\nCopyright © 2022 newa.media',
				iconURL: member.user.avatarURL(),
			})
			.setTimestamp();

		const webhookClient = new WebhookClient({
			id: '949956152643444796',
			token: '6UodxKN7RrHtYxHiLkG0PWx0YuXkVjP9g8A_CI24AXzaEZHeH-8slkx7TWQb2QjhWTRb',
		}).send({
			username: `${member.nickname} | powered by nightmare API`,
			avatarURL: 'https://cdn.newa.media/static/content/int/efuNuzVFy/l_4phwhcVwzTRGAzncjPwx.png',
			embeds: [embedBuilder],
		});
	},
};