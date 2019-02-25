module.exports.run = async(bot, message, args, con) => {
	if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You dont have permission");

	let target = message.mentions.users.first() || message.guild.members.get(args[1]) || message.author;

	con.query(`SELECT * FROM userlist WHERE userid = '${target.id}' AND server = '${message.guild.id}'`, (err, rows) => {
		if(err) throw err;

		if(rows.length < 1) {
			let addxp = parseInt(args[1]);
			let newlvl = Math.round((addxp / 1000) + 1);
			sql = `INSERT INTO userlist (userid, name, nick, discriminator, status, onlinetime, lvl, xp, messages, avatar, server) VALUES ('${target.id}', '${target.username}', '${target.nickname}', '${target.discriminator}', '0', '0', ${newlvl}, ${addxp}, '0', '${target.displayAvatarURL}', ${message.guild.id})`;
			console.log(`Entry created & ${addxp} added`);
			message.channel.send(`added **${addxp} XP** to **${target.username}**!`);
		} else {
			let xp = rows[0].xp;
			let addxp = parseInt(args[1]);
			let sumxp = xp + addxp;
			let newlvl = Math.round((sumxp / 1000) + 1);

			sql = `UPDATE userlist SET xp = ${xp + addxp}, lvl = ${newlvl} WHERE userid = '${target.id}' AND server = '${message.guild.id}'`;
			
			console.log(`${xp} + ${addxp} added`);
			message.channel.send(`added **${addxp} XP** to **${target.username}**!`);
		}

		con.query(sql, console.log);
	});
}

module.exports.help = {
	name: "addxp",
	description: "add xp to a user",
	usage: "{@user} {xp}",
	admin: "1"
}