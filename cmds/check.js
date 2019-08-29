const config = module.require('./../config.js');
const Discord = module.require("discord.js");
module.exports.run = async (bot, message, args, con) => {

  console.log('start testing');

  var allNewcomers = [];
  var newcomerRole = message.member.guild.roles.find(role => role.name == "newcomer");
  message.guild.members.forEach(member => {
      if(member.roles.has(newcomerRole.id) && member.roles.size <= 2) allNewcomers.push(member);
  });

  console.log(allNewcomers[0].roles);
  console.log('Roles: ' + allNewcomers[0].roles.size);

  let embed = new Discord.RichEmbed()
  .setTitle('newcomer test')
  .setDescription(`${allNewcomers.join('\n')}`)
  .setColor(`AQUA`)
  .setFooter('testing', bot.user.avatarURL);

  message.channel.send({embed: embed});

}

module.exports.help = {
	name: "check",
      description: "...",
      usage: "[@user]",
      admin: "0"
}
