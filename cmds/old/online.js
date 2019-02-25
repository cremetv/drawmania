const Discord = module.require("discord.js");
module.exports.run = async(bot, message, args, con) => {

	let list = [];

	con.query(`SELECT * FROM userlist WHERE status = '1'`, (err, rows) => {
	    if(err) throw err;

	    if(!rows[0]) return message.channel.send("nobody is online :(");
	    rows.forEach(function(row) {
	    	let userid = row.userid;
			let onlinetime = rows[0].onlinetime;
			// let username = bot.users.get(userid).username;
			let username = message.guild.members.get(userid);
			list.push(`${username}`);
			// list = '.addField(' + list + ')';
	    });
	    let embed = new Discord.RichEmbed().addField('Onlineusers', list);
	    message.channel.send({embed: embed});
	});
}

module.exports.help = {
	name: "online",
	description: "show all online users",
	usage: "",
	admin: "0"
}