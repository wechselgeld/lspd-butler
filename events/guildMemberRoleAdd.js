/* eslint-disable no-unused-vars */
const logger = require('../utilities/logger');
const { activity } = require('../database/dbTables');

module.exports = {
	name: 'guildMemberRoleAdd',
	once: false,
	async execute(member, role) {
		if (!role.id == '946277026954879046') return;
		if (member.bot) return;
    
		activity.create({
			discordId: member.user.id,
			timestamp: Date.now(),
		});
	},
};