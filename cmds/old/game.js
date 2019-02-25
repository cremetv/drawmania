const Discord = require("discord.js");
module.exports.run = async(bot, message, args, con) => {
	let target = message.mentions.users.first() || message.guild.members.get(args[1]) || message.author;

	message.channel.send(`${target} spielt ${target.presence.game.name}`);
	console.log(target.presence);
}

module.exports.help = {
	name: "game",
	description: "-",
	usage: "",
	admin: "0"
}