module.exports.run = async(bot, message, args, con) => {
	console.log(bot.users); //returns all u
}

module.exports.help = {
	name: "log",
	description: "log users",
	usage: "",
	admin: "1"
}