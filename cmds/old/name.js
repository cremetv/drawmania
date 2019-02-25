const Discord = module.require("discord.js");
module.exports.run = async(bot, message, args, con) => {

	let target = message.mentions.users.first() || message.guild.members.get(args[1]) || message.author;
	let guildmember = message.guild.members.get(target.id);

	message.channel.send('target: ' + target);
	message.channel.send('id: ' + target.id);
	message.channel.send('tag: ' + target.tag);
	message.channel.send('username: ' + target.username);
	message.channel.send('discriminator: ' + target.discriminator);
	message.channel.send('nickname: ' + guildmember.nickname);
	message.channel.send('ma nick' + message.author.nickname);
	message.channel.send('ma username' + message.author.username);
	message.channel.send('ma discriminator' + message.author.discriminator);
	
}

module.exports.help = {
	name: "name",
	description: "show all types of your name",
	usage: "",
	admin: "0"
}