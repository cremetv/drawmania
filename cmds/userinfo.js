const config = module.require('./../config.js');
const Discord = module.require("discord.js");
module.exports.run = async (bot, message, args, con) => {
  let target = message.mentions.users.first() || message.guild.members.get(args[1]) || message.author;

  let messages, xp, lvl, nextLvl, levelhz, nextLvlXP, levelhzcurrent, currentLvlXp, diff, xpMdiff, needXp, percent;
  let embed = new Discord.RichEmbed();

  con.execute(config,
    database => database.query(`SELECT * FROM userlist WHERE userid = '${target.id}' AND server = '${message.guild.id}'`)
    .then(rows => {

      if (!rows[0]) {
        embed.setTitle(target.username)
        .setDescription(`ID: ${target.id}`)
        .setColor(`AQUA`)
        .setThumbnail(target.avatarURL)
        .addField(`Full username`, `${target.username}#${target.discriminator}`)
        .addField(`Level`, `0`, true)
        .addField(`XP`, `0`, true)
        .addField(`written messages`, `0`)
        .addField(`Created at:`, target.createdAt)
        .setFooter(`beep boop`, bot.user.avatarURL);

      } else {
        messages = rows[0].messages;
        xp = rows[0].xp;
        lvl = 1 + Math.sqrt(1 + 8 * xp / 50);
        lvl = Math.floor(lvl / 2);

        nextLvl = lvl++;

        levelhz = Math.pow(nextLvl, 2);
        nextLvlXP = ((levelhz - nextLvl) * 50) / 2;

        levelhzcurrent = Math.pow(lvl, 2);
        currentLvlXp = ((levelhzcurrent - lvl) * 50) / 2;

        diff = nextLvlXP - currentLvlXp;
        xpMdiff = xp - currentLvlXp;
        needXp = nextLvlXP - xp;
        percent = Math.round((100* xpMdiff) / diff);

        let anzeige = '░░░░░░░░░░';
        if (percent < 10) {
              anzeige = '░░░░░░░░░░';
        } else if (percent < 20) {
              anzeige = '█░░░░░░░░░';
        } else if (percent < 30) {
              anzeige = '██░░░░░░░░';
        } else if (percent < 40) {
              anzeige = '███░░░░░░░';
        } else if (percent < 50) {
              anzeige = '████░░░░░░';
        } else if (percent < 60) {
              anzeige = '█████░░░░░';
        } else if (percent < 70) {
              anzeige = '██████░░░░';
        } else if (percent < 80) {
              anzeige = '███████░░░';
        } else if (percent < 90) {
              anzeige = '████████░░';
        } else if (percent < 100) {
              anzeige = '█████████░';
        }

        let botFooter = ['beep boop', 'oof', `${target.username} is one sexy mf`, `a majestic ${target.username}`, `shiny ${target.username}`, `${lvl} level oof`, `${messages} spams v.v`, `${target.discriminator} baby`];

        embed.setTitle(target.username)
        .setDescription(`ID: ${target.id}`)
        .setColor(`AQUA`)
        .setThumbnail(target.avatarURL)
        .addField(`Full username`, `${target.username}#${target.discriminator}`)
        .addField(`Level`, `**${lvl}** ${anzeige} *${nextLvl}*`, true)
        .addField(`XP`, `${xp}/${nextLvlXP}`, true)
        .addField(`written messages`, messages)
        .addField(`Created at:`, target.createdAt)
        .setFooter(botFooter[Math.floor(Math.random() * botFooter.length)], bot.user.avatarURL);
      }

    })
  ).then(() => {
    message.channel.send({embed: embed});
  }).catch(err => {
    throw err;
  });
}

module.exports.help = {
	name: "userinfo",
      description: "get infos about a user",
      usage: "[@user]",
      admin: "0"
}
