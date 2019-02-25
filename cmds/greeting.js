module.exports.run = async(bot, message, args, con) => {
	// if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You dont have permission");
	con.query(`SELECT * FROM servers WHERE serverid = '${message.guild.id}'`, (err, rows) => {
		if(err) throw err;

		let sql;
		let wholeargs = message.toString().slice(10);

		if(!wholeargs) return message.channel.send("im missing a greeting message\n$server <some greeting message>");

		if(rows.length < 1) {
			sql = `INSERT INTO servers (serverid, servername, acronym, greeting, memberCount, createdAt, createdTimestamp, defaultRole, iconURL, large, owner, ownerID, region) VALUES ('${message.guild.id}', '${message.guild.name}', '${message.guild.nameAcronym}', '${wholeargs}', ${message.guild.memberCount}, '${message.guild.createdAt}', ${message.guild.createdTimestamp}, '${message.guild.defaultRole}', '${message.guild.iconURL}', ${message.guild.large}, '${message.guild.owner}', ${message.guild.ownerID}, '${message.guild.region}')`;
		} else {
			sql = `UPDATE servers SET serverid = '${message.guild.id}', servername = '${message.guild.name}', acronym = '${message.guild.nameAcronym}', greeting = '${wholeargs}', memberCount = ${message.guild.memberCount}, createdAt = '${message.guild.createdAt}', createdTimestamp = ${message.guild.createdTimestamp}, defaultRole = '${message.guild.defaultRole}', iconURL = '${message.guild.iconURL}', large = ${message.guild.large}, owner = '${message.guild.owner}', ownerID = ${message.guild.ownerID}, region = '${message.guild.region}' WHERE serverid = ${message.guild.id}`;
		}

		con.query(sql, console.log);
		console.log(sql);
		message.channel.send("Greeting message set :heavy_check_mark:")
	});
}

module.exports.help = {
	name: "greeting",
	description: "set the greeting message for new users",
	usage: "{here some text}",
	admin: "1"
}
