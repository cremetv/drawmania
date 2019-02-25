module.exports.run = async(bot, message, args, con) => {
	let target = message.mentions.users.first() || message.guild.members.get(args[1]) || message.author;

	con.query(`SELECT * FROM userlist WHERE userid = '${target.id}' AND server = '${message.guild.id}'`, (err, rows) => {
		if(err) throw err;

		if(!rows[0]) return message.channel.send("this dude has no level");
		let xp = rows[0].xp;
		let lvl = 1 + Math.sqrt(1 + 8 * xp / 50);
		lvl = lvl / 2;
		lvl = Math.floor(lvl);
		message.channel.send(`${target.username}'s Level is **${lvl}**`);
	});
}

module.exports.help = {
	name: "lvl",
	description: "show the level of a users",
	usage: "[@user]",
	admin: "0"
}