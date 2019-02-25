const Discord = module.require("discord.js");
module.exports.run = async(bot, message, args, con) => {

  if (!args[0]) {
    message.channel.send('gimme a ticket id');
  } else {

    var ticketId = args[0];

    con.query(`SELECT * FROM tickets WHERE id = '${ticketId}'`, (err, rows) => {
          if(err) throw err;

          let author = rows[0].author;
          let userid = rows[0].userid;
          let ticketMessage = rows[0].message;
          let status = rows[0].status;
          let notice = rows[0].notice;
          let editor = rows[0].editor;

          var color = '#ffffff';
          if (status == '0') {
            status = 'open';
            color = '#ffffff';
          } else if (status == '1') {
            status = 'pending';
            color = '#fed330';
          } else if (status == '2') {
            status = 'closed - resolved';
            color = '#20bf6b';
          } else {
            status = 'closed - denied';
            color = '#eb3b5a';
          }

          let embed = new Discord.RichEmbed()
          .setAuthor('Ticket ' + ticketId)
          .setDescription('created by ' + author)
          .setColor(color)
          .addField('message', ticketMessage)
          .addField('Ticket Status', status, true)
          .addField('Notice', notice, true)
          .addField('Edited by', editor)
          .setFooter("beep boop", bot.user.avatarURL);
          message.channel.send({embed: embed});
    });
  }

}

module.exports.help = {
	name: "ticketstatus",
	description: "infos about a ticket",
	usage: "<id>",
	admin: "0"
}
