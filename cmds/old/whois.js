module.exports.run = async(bot, message, args) => {
	let users = bot.users;

	let searchTerm = args[0];
	if(!searchTerm) return message.channel.send("gimme a id to search!");

	let matches = users.filter(u => u.id.toLowerCase().includes(searchTerm.toLowerCase()));
	let result = matches.map(u => u.id);
	let code = "``";
	if(result.length > 1) return message.channel.send(`${code}${searchTerm}${code} could be: \n${matches.map(u => u.tag).join(", ")}`);

	message.channel.send(`**${searchTerm}** is **<@${result}>**`);
}

module.exports.help = {
	name: "whois",
	description: "search for a user with the id or parts of the id",
	usage: "{id | number}",
	admin: "0"
}