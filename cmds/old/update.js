const Discord = module.require("discord.js");
module.exports.run = async(bot, message, args, con) => {
  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You dont have permission");

  if (!args[0]) {
    message.channel.send('you need to write something');
  } else {
    message.channel.send(args.join(' '));
    message.delete();
  }

}

module.exports.help = {
	name: "update",
	description: "send a update message",
	usage: "<message>",
	admin: "1"
}
