module.exports.run = async(bot, message, args) => {
	const targetUser = message.mentions.users.first() || message.guild.members.get(args[1]) || message.author;
  let str = args.join(' ');
  console.log(str);

  let spoiler = str.replace(/[^]/g, '||$&||');
  // alert(prompt().replace(/[^]/g,"||$&||"))
  message.channel.send(spoiler);
  message.delete();
}

module.exports.help = {
	name: "spoiler",
	description: "spoiler dis",
	usage: "{message}",
	admin: "0"
}
