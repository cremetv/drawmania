module.exports.run = async(bot, message, args, con) => {
	if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You dont have permission");

	let target = message.mentions.users.first() || message.guild.members.get(args[1]) || message.author;

	con.query(`SELECT * FROM userlist WHERE userid = '${target.id}' AND server = '${message.guild.id}'`, (err, rows) => {
		if(err) throw err;

		if(rows.length < 1) {
			let setxp = parseInt(args[1]);
			let newlvl = Math.round((setxp / 1000) + 1);
			sql = `INSERT INTO userlist (userid, name, nick, discriminator, status, onlinetime, lvl, xp, messages, avatar, server) VALUES ('${target.id}', '${target.username}', '${target.nickname}', '${target.discriminator}', '0', '0', ${newlvl}, ${setxp}, '0', '${target.displayAvatarURL}', ${message.guild.id})`;
			console.log(`Entry created & ${setxp} XP set`);
			message.channel.send(`set **${target.username}'s** XP to **${setxp}**!`);
		} else {
			let setxp = parseInt(args[1]);
			let newlvl = Math.round((setxp / 1000) + 1)

			sql = `UPDATE userlist SET xp = ${setxp}, lvl = ${newlvl} WHERE userid = '${target.id}' AND server = '${message.guild.id}'`;
			
			console.log(`set **${target.username}'s** XP to **${setxp}**!`);
			message.channel.send(`set **${target.username}'s** XP to **${setxp}**!`);
		}

		con.query(sql, console.log);
	});
}

module.exports.help = {
	name: "setxp",
	description: "set the xp of a user",
	usage: "{@user} {xp}",
	admin: "1"
}