const config = module.require('./../config.js');
const Discord = module.require("discord.js");
module.exports.run = async(bot, message, args, con) => {
  let target = message.mentions.users.first() || message.guild.members.get(args[1]) || message.author;

  let fighter1, fighter2, lvl1, lvl2, diff, winner;

  const botFooter = ['Beep Boop don\'t hurt me', 'im innocent!', 'oof', 'no hurt me'];

  con.execute(config,
    database => database.query(`SELECT name, lvl FROM userlist WHERE userid = '${target.id}' AND server = '${message.guild.id}'`)
    .then(rows => {

      if (!rows[0]) return message.channel.send('you have no level!');

      fighter1 = rows[0].name;
      lvl1 = rows[0].lvl;

      return database.query(`SELECT name, lvl FROM userlist WHERE server = '${message.guild.id}' ORDER BY RAND() LIMIT 1`);
    })
    .then(rows => {

      if (!rows[0]) return message.channel.send('the enemy has no level ugh.');

      fighter2 = rows[0].name;
      lvl2 = rows[0].lvl;

    })
  ).then(() => {
    diff = lvl1 - lvl2;
    (diff >= 0) ? winner = fighter1 : winner = fighter2;
    (diff < 0) ? diff = diff * -1 : null;

    let embed = new Discord.RichEmbed()
    .setTitle('RANDOM USER BATTLE!')
    .setColor('#EF3340')
    .addField(fighter1, `LVL: ${lvl1}`, true)
    .addField('vs', '⚔️', true)
    .addField(fighter2, `LVL: ${lvl2}`, true)
    // .addField('⚔️', 'and the winner is ...')
    .addField(`Winner: ${winner}`, `with ${diff} more lvl`, true)
    .setFooter(botFooter[Math.floor(Math.random() * botFooter.length)], bot.user.avatarURL);
    message.channel.send({embed: embed});
  }).catch(err => {
    throw err;
  });

}

module.exports.help = {
	name: "battle",
	description: "Fight a random user!",
	usage: "{user}",
	admin: "0"
}
