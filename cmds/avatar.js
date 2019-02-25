module.exports.run = async(bot, message, args) => {
	let msg = await message.channel.send("doing some magic ...");
	let target = message.mentions.users.first() || message.guild.members.get(args[1]) || message.author;

	let type = target.avatarURL.substr(target.avatarURL.length - 13);
	type = type.substring(0, type.length - 10);

	if (type == 'gif') {
		await message.channel.send({files: [
			{
				attachment: target.displayAvatarURL,
				name: 'avatar.gif'
			}
		]});
	} else {
		await message.channel.send({files: [
			{
				attachment: target.displayAvatarURL,
				name: 'avatar.png'
			}
		]});
	}

	msg.delete();

}

module.exports.help = {
	name: "avatar",
	description: "show the avatar of a user",
	usage: "[@user]",
	admin: "0"
}
