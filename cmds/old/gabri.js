module.exports.run = async(bot, message, args, con) => {
	let target = message.mentions.users.first() || message.guild.members.get(args[1]) || message.author;

  message.channel.send('Gabri ... dieser Lauch')
}

module.exports.help = {
	name: "gabri",
	description: "gabri >:(",
	usage: "",
	admin: "0"
}
