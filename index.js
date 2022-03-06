/* eslint-disable brace-style */
const fs = require('fs');
const {
	Client,
	Collection,
	Intents,
} = require('discord.js');
const {
	token,
} = require('./database/old/config.json');
const {
	globalBlock,
} = require('./database/old/noServe.json');
const logger = require('./utilities/logger');
const logs = require('discord-logs');

process.on('uncaughtException', function(error) {
	logger.error(error);
});

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_PRESENCES,
		Intents.FLAGS.GUILD_MEMBERS,
	],
});

logs(client);

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
	if (globalBlock.includes(interaction.user.id)) {
		interaction.reply({
			content: 'Ein Administrator hat die verwendung meiner Dienste für Dich gesperrt. Bitte respektiere diese Entscheidung.\n*Wenn Du dennoch denkst, dass es sich um einen Fehler handelt, erstelle bitte ein Ticket unter [newa.media/hilfe](https://newa.media/hilfe).*',
			ephemeral: true,
		});
		logger.warn(`${interaction.user.tag} (${interaction.user.id}) hat versucht auf die Anwendung zuzugreifen. Da dieser Benutzer aber per Datenbankabfrage auf der Blacklist erkannt wurde, wurde seine Anfrage nicht bearbeitet.`);
		return true;
	}

	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		logger.error(error);
		if (interaction.replied) {
			await interaction.editReply({
				content: 'Hmm... Irgendwie ist da gerade etwas schief gelaufen. Versuche es später bitte erneut oder melde diesen Fehler.',
				ephemeral: true,
			});
		} else {
			await interaction.reply({
				content: 'Hmm... Irgendwie ist da gerade etwas schief gelaufen. Versuche es später bitte erneut oder melde diesen Fehler.',
				ephemeral: true,
			});
		}
	}
});

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

let state = 0;
const presences = [{
	type: 'PLAYING',
	message: 'mit den eingegangenen Bewerbungen',
},
{
	type: 'WATCHING',
	message: 'auf Eure Aktivität',
},
{
	type: 'LISTENING',
	message: 'Euren Vorschlägen',
},
{
	type: 'COMPETETING',
	message: 'einer Kissenschlacht',
},
];

setInterval(() => {
	state = (state + 1) % presences.length;
	const presence = presences[state];

	client.user.setActivity(presence.message, {
		type: presence.type,
	});
}, 10000);

client.login(token).then(() => {
	client.user.setStatus('online');
});