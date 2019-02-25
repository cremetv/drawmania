const fs = module.require("fs");

module.exports.run = async (bot, message, args) => {
	//Check if command executor has the right permission to do this command.
	if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You dont have permission");

	// Get the mentioned user, return if there is none.
	let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
	if(!toMute) return message.channel.send("You did not specify a user mention or ID!");

	if(toMute.id === message.author.id) return message.channel.send("You can't unmute yourself silly.");
	if(toMute.highestRole.position >= message.member.highestRole.position) return message.channel.send("You can't unmute a superior human beeing :scream:");

	let role = message.guild.roles.find(r => r.name === "Muted Boi");


	if(!role || !toMute.roles.has(role.id)) return message.channel.send(`${message.mentions.users.first()} is not a **muted boi** :thinking:`);

	await toMute.removeRole(role);

	delete bot.mutes[toMute.id];

	fs.writeFile("./mutes.json", JSON.stringify(bot.mutes, null, 4), err => {
		if(err) throw err;
		console.log(`I have unmuted ${toMute.user.tag}.`);
		let robot = message.guild.emojis.find("name", "bestrobot") || ":disappointed:";
		message.channel.send(`${toMute.user.username} is no longer a **muted boi** ${robot}`)
	});
}

module.exports.help = {
	name: "unmute",
	description: "unmute a user",
	usage: "{@user}",
	admin: "1"
}