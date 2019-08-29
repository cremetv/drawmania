// FIX or Remove

const Discord = module.require("discord.js");
module.exports.run = async(bot, message, args) => {

	const advDay = args[0];
	const phrase = ['', 'bad tattoo', 'animal', 'anime character', 'own character with armor', 'fav game character', 'bad superhero', 'food', 'spaceship', 'your fav/own character in christmas clothes', 'rejected emoji', 'combat scene', 'discord user', 'draw yourself', 'weapon design', 'post apocalyptic', 'dream sidekick', 'architectural structure', 'anger', 'rejected pokemon', 'comic', 'christmas', 'meme', 'underwater', 'christmas with the discord guys'];
	const desctxt = ['', 'draw a really bad tattoo', 'draw a random animal', 'draw a anime character of your choice', 'create a character with armor', 'draw your favourite game character', 'draw a really bad superhero', 'draw some food', 'draw a spaceship', 'draw your favourite character in christmas clothing. or create one yourself', 'draw a rejected emoji', 'draw a combat scene', 'draw a discord user from this server', 'draw yourself :3', 'draw a weapon design', 'draw something post apocalyptic', 'draw the sidekick of your dreams', 'draw something architecture related', 'draw anger', 'draw a rejected pokemon', 'draw a small comic', 'draw christmas', 'redraw a meme', 'draw a underwater scene', 'draw your assigned discord user for the big christmas picture']
	const output = phrase[args[0]];
	const desc = desctxt[args[0]];
	const d = new Date();
	const n = d.getUTCDate();
	const m = d.getUTCMonth() + 1;
	const currTheme = phrase[n];

	if(m != '5') return message.channel.send('not december yet');
	if(advDay === "list") {
		message.channel.send(phrase);
	} else if(advDay <= 24) {
		if(advDay <= n) {
			let advembed = new Discord.RichEmbed()
				.setAuthor('Drawing advent Calendar')
				.setTitle(advDay + ' Dezember')
				.setDescription(output)
				.setColor('AQUA')
				.addField('description', desc)
				.setFooter('beep boop merry christmas kiddos', bot.user.avatarURL)
			message.channel.send(advembed);
			message.channel.setTopic('ADV #' + n + ': ' + currTheme);
			return;
		} else
		message.channel.send('too soon');
	} else
		message.channel.send('1-24 pls');
}

module.exports.help = {
	name: "adv",
	description: "show the advent calendar themes",
	usage: "[1-24]",
	admin: "0"
}
