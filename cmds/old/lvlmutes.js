module.exports.run = async(bot, message, args, con) => {

  let target = message.mentions.users.first() || message.guild.members.get(args[1]) || message.author;

  let list = [];

  message.channel.send('`Muted bois (lvl announcements)`')
  con.query(`SELECT * FROM userlist WHERE lvlMute = 1 AND server = '${message.guild.id}' ORDER BY lvl DESC`, (err, rows) => {
        if(err) throw err;
        let i = 1;
        rows.forEach(function(row) {
              let username = row.name;
              list.push(`*${username}*`);
        });
        message.channel.send(list);
  });
}

module.exports.help = {
	name: "lvlmutes",
	description: "list all users with muted lvl announcements",
	usage: "",
	admin: "0"
}
