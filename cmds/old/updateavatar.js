module.exports.run = async(bot, message, args, con) => {

	let target = message.mentions.users.first() || message.guild.members.get(args[1]) || message.author;
	let guildmember = message.guild.members.get(target.id);

	con.query(`SELECT * FROM userlist WHERE userid = '${target.id}'`, (err, rows) => {
		if(err) throw err;

		if(rows.length < 1) {
			sql = `INSERT INTO userlist (userid, name, nick, discriminator, status, onlinetime, lvl, xp, messages, avatar) VALUES ('${target.id}', '${target.username}', '${guildmember.nickname}', '${target.discriminator}', '0', '0', '1', '0', '0', '${target.displayAvatarURL}')`;
			console.log(`set nick & avatar of ${target.username}`);
			message.channel.send(`updated nickname & avatar of ${target.username}`);
		} else {
			let xp = rows[0].xp;
			let addxp = parseInt(args[1]);
			let sumxp = xp + addxp;
			let newlvl = Math.round((sumxp / 1000) + 1);

			sql = `UPDATE userlist SET nick = '${guildmember.nickname}', avatar = '${target.displayAvatarURL}', discriminator = '${target.discriminator}' WHERE userid = '${target.id}'`;
			
			console.log(`updated nick & avatar of ${target.username}`);
			message.channel.send(`updated nickname & avatar of ${target.username}`);
		}

		con.query(sql, console.log);
	});
}

module.exports.help = {
	name: "upava",
	description: "update avatar & nickname",
	usage: "{@user}",
	admin: "0"
}