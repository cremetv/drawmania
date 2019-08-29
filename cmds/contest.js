const Discord = module.require("discord.js");
module.exports.run = async(bot, message, args, con) => {
	let target = message.mentions.users.first() || message.guild.members.get(args[1]) || message.author;

  let embed = new Discord.RichEmbed()
  .setAuthor('Contest!')
  .setDescription('Topic: Draw your Furry OC')
  .setColor('AQUA')
  .addField('Start', '30.03.18', true)
  .addField('Deadline', '15.04.18', true)
  .addField('Notice:', '-')
  .setFooter("beep boop good luck", bot.user.avatarURL);
  message.channel.send({embed: embed});
}

module.exports.help = {
	name: "contest",
	description: "show contest info",
	usage: "",
	admin: "0"
}
