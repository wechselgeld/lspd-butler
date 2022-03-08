const {
	SlashCommandBuilder,
} = require('@discordjs/builders');
const {
	MessageEmbed,
	WebhookClient,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sanktion')
		.setDescription('Sanktioniert einen Officer')
		.addUserOption(option =>
			option.setName('officer')
				.setDescription('Der Officer, welche sanktioniert werden soll')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('sanktion')
				.setDescription('Der neue Benutzername')
				.setRequired(true)),

	async execute(interaction) {
		const member = interaction.options.getMember('officer');
		const sanction = interaction.options.getString('sanktion');

		await interaction.reply({
			content: `10-4, wurde gemacht. Ich habe <@${member.id}> die ausgewählte Sanktion ausgesprochen..`,
			ephemeral: true,
		});

		const embedBuilder = new MessageEmbed()
			.setColor('#04234f')
			.setFooter({
				text: `Ray-ID › ${interaction.id}\nCopyright © 2022 newa.media`,
				iconURL: interaction.user.avatarURL(),
			})
			.setTimestamp();

		embedBuilder.setTitle('Sanktion')
			.setDescription(`Sehr geehrte Kolleginnen & Kollegen,
			zur Kenntnisnahme, es erfolgte **eine sanktionierung**.
			
			<@${member.id}> ➙ ${sanction}
            
			*Die Strafen, welche dafür erbracht werden müssen:*`);

		new WebhookClient({
			id: '948516199057203211',
			token: 'FPu3M2uN5OSEmCM9ZDgKSAQvIReB36Xql0qjxiaDK5aqCayPCHLz1k8Gk-mXuUOwky87',
		}).send({
			content: `<@${member.id}>`,
			username: `${interaction.member.nickname} | powered by nightmare API`,
			avatarURL: 'https://cdn.newa.media/static/content/int/efuNuzVFy/l_4phwhcVwzTRGAzncjPwx.png',
			embeds: [embedBuilder],
		});

		embedBuilder.setTitle('Beförderung')
			.setDescription(`<@${member.id}> ➙ ${sanction}`);

		new WebhookClient({
			id: '948516060347367424',
			token: 'LEoYNgnkTWLxf_gZkx4L0yC362pXVlMCdgfVnSNwJzi6Dqc-tl1_GKFU-r_XtKk1h-gf',
		}).send({
			username: `${interaction.member.nickname} | powered by nightmare API`,
			avatarURL: 'https://cdn.newa.media/static/content/int/efuNuzVFy/l_4phwhcVwzTRGAzncjPwx.png',
			embeds: [embedBuilder],
		});
	},
};