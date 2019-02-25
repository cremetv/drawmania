const Discord = module.require("discord.js");
module.exports.run = async(bot, message, args, con) => {
  let target = message.author;
  let id = args[0];

  if (!id || isNaN(id)) {
    message.channel.send('write a id to vote')
    return;
  }

  message.channel.send('voted for ' + id);

}

module.exports.help = {
	name: "vote",
	description: "strawpoll",
	usage: "<id>",
	admin: "0"
}
