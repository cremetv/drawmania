module.exports.run = async(bot, message, args, con) => {
	message.delete();
}

module.exports.help = {
	name: "delete",
	description: "delelte your message",
	usage: "",
	admin: "1"
}