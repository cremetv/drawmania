const Discord = module.require("discord.js");
module.exports.run = async(bot, message, args, con) => {

  if (!args[0]) {
    message.channel.send('you need to write something');
  } else {

    var ticketMsg = args.join(' ');
    var server = message.guild.id;

    con.query(`INSERT INTO tickets (author, userid, message, status, notice, editor, editorId, server) VALUES ('${message.author.username}', '${message.author.id}', '${ticketMsg}', '0', '-', '-', '0', '${server}')`, function(err, result) {

      var ticketId = result.insertId;

      let embed = new Discord.RichEmbed()
      .setAuthor('Ticket created!')
      .setDescription('Ticket id ' + ticketId)
      .setColor('#ffffff')
      .addField('Author', message.author.username, true)
      .addField('Ticket Status', 'open', true)
      .addField('Message', ticketMsg)
      .setFooter("beep boop", bot.user.avatarURL);
      message.channel.send({embed: embed});
    });

    message.channel.send('your ticket was successfully created!');
    message.channel.send('you can check your ticketstatus with `$ticketstatus ID`');
  }

}

module.exports.help = {
	name: "ticket",
	description: "submit ticket",
	usage: "<message>",
	admin: "0"
}
