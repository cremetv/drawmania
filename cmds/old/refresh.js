module.exports.run = async(bot, message, args, con) => {
	con.query(`SELECT * FROM servers WHERE serverid = '${message.guild.id}'`, (err, rows) => {
		if(err) throw err;

		con.query(`UPDATE servers SET servername = '${message.guild.name}', acronym = '${message.guild.nameAcronym}', memberCount = ${message.guild.memberCount}, defaultRole = '${message.guild.defaultRole}', iconURL = '${message.guild.iconURL}', large = ${message.guild.large} WHERE serverid = ${message.guild.id}`);

		console.log(`updated ${message.guild.name}'s infos`)
	});
}

module.exports.help = {
	name: "refresh",
	description: "refresh server infos",
	usage: "",
	admin: "1"
}