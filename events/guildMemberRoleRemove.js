/* eslint-disable no-unused-vars */
const logger = require('../utilities/logger');
const { activity, lspd } = require('../database/dbTables');
const prettyMilliseconds = require('pretty-ms');
const { MessageEmbed, WebhookClient } = require('discord.js');

module.exports = {
	name: 'guildMemberRoleRemove',
	once: false,
	async execute(member, role) {
		if (!role.name.includes('Im Dienst')) return;
		if (member.bot) return;
	
		const lastTime = await activity.findOne({ where: { discordId: member.user.id } });
		const currentTime = Date.now();
		const ms = currentTime - lastTime.timestamp;
	
		activity.destroy({ where: { discordId: member.user.id } });

		const found = await lspd.findOne({ where: { discordId: member.user.id } });
		const foundActivity = await found.activity + ms;

		if (found) {
			const affectedRows = await lspd.update({ activity: foundActivity }, { where: { discordId: member.user.id } });
		} else {
			await lspd.create({
				discordId: member.user.id,
				activity: ms,
			});
		}

		const embedBuilder = new MessageEmbed();

		embedBuilder.setColor('#04234f')
			.setAuthor({ name: 'Los Santos Police Department', iconURL: 'https://cdn.newa.media/static/content/int/efuNuzVFy/l_4phwhcVwzTRGAzncjPwx.png' })
			.setTitle(member.nickname + ' hat den Dienst verlassen')
			.setDescription('Die gemessene Dienstzeit betrug ' + prettyMilliseconds(ms) + ' und wurde dem Officer angerechnet.\nDienst diese Woche erledigt › ' + prettyMilliseconds(found.activity) + '\nBerechneter UNIX-Timestamp › ' + ms)
			.setFooter({ text: 'Ray-ID › Event\nCopyright © 2022 newa.media', iconURL: member.user.avatarURL() })
			.setTimestamp();

		const webhookClient = new WebhookClient({ id: '949635020614684762', token: 'KQOeDpOTGhYihUJrZJiln_Epwd25hILVYHQIPDzLhUIMh_F_e0wI3lZoPvzp48vnzinn' });
		
		webhookClient.send({
			username: `${member.nickname} | powered by nightmare API`,
			avatarURL: 'https://cdn.newa.media/static/content/int/efuNuzVFy/l_4phwhcVwzTRGAzncjPwx.png',
			embeds: [embedBuilder],
		});

		logger.info(member.nickname + ' | Die gemessene Dienstzeit betrug ' + prettyMilliseconds(ms) + ' und wurde dem Officer angerechnet.\nDienst diese Woche erledigt › ' + prettyMilliseconds(found.activity) + '\nBerechneter UNIX-Timestamp › ' + ms);
	},
};