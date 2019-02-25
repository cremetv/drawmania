module.exports.run = async(bot, message, args, con) => {

  let target = message.mentions.users.first() || message.guild.members.get(args[1]) || message.author;

  con.query(`SELECT * FROM userlist WHERE userid = '${target.id}' AND server = '${message.guild.id}'`, (err, rows) => {
		if(err) throw err;

    var lvlmute = rows[0].lvlMute;

		if(lvlmute == 1) {

      sql = `UPDATE userlist SET lvlMute = 0 WHERE userid = '${target.id}' AND server = '${message.guild.id}'`;
      if (target.id == message.author.id) {
          message.channel.send('I unmuted your lvl announcements boi');
      } else {
        message.channel.send(`I unmuted ${target.username}'s' lvl announcements boi`);
      }
		} else {

			sql = `UPDATE userlist SET lvlMute = 1 WHERE userid = '${target.id}' AND server = '${message.guild.id}'`;
      if (target.id == message.author.id) {
          message.channel.send('I muted your lvl announcements boi');
      } else {
        message.channel.send(`I muted ${target.username}'s' lvl announcements boi`);
      }
		}

		con.query(sql, console.log);
	});
}

module.exports.help = {
	name: "lvlmute",
	description: "mute the lvl announcements for yourself",
	usage: "",
	admin: "0"
}
