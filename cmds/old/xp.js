module.exports.run = async(bot, message, args, con) => {
	let target = message.mentions.users.first() || message.guild.members.get(args[1]) || message.author;

	con.query(`SELECT * FROM userlist WHERE userid = '${target.id}' AND server = '${message.guild.id}'`, (err, rows) => {
		if(err) throw err;

		if(!rows[0]) return message.channel.send("this dude has no xp yet");
		let xp = rows[0].xp;
		message.channel.send(`${target.username} has **${xp} XP**`);
	});
}

module.exports.help = {
	name: "xp",
	description: "show the xp of a user",
	usage: "[@user]",
	admin: "0"
}