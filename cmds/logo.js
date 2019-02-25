module.exports.run = async(bot, message, args) => {
	let msg = await message.channel.send("doing some magic ...");

	if(!message.guild.iconURL) return msg.edit("There's no Server Logo :scream:");

	await message.channel.send({files: [
		{
			attachment: message.guild.iconURL,
			name: "logo.png"
		}
	]});

	msg.delete();
}

module.exports.help = {
	name: "logo",
	description: "show the server icon",
	usage: "",
	admin: "0"
}
