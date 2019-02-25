module.exports.run = async(bot, message, args, con) => {

  let list = [];

  // wenn das mit der server id passt das hier einfügen vv
  // `SELECT * FROM tickets WHERE server = '${message.guild.id}'`

  con.query(`SELECT * FROM tickets`, (err, rows) => {
        if(err) throw err;
        let i = 1;
        rows.forEach(function(row) {
          let id = row.id;
          let author = row.author;
          let message = row.message;
          message = message.substring(0,30) + '...';
          let status = row.status;
          list.push('Ticket `ID '+id+'` by **'+author+'** status:'+status+' - ' + message);
        });
        message.channel.send(list);
  });
}

module.exports.help = {
	name: "tickets",
	description: "list all tickets",
	usage: "",
	admin: "0"
}
