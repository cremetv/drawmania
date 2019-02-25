const fs = module.require("fs");

module.exports.run = async (bot, message, args) => {
	//Check if command executor has the right permission to do this command.
	if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You dont have permission");

	// Get the mentioned user, return if there is none.
	let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
	if(!toMute) return message.channel.send("You did not specify a user mention or ID!");

	if(toMute.id === message.author.id) return message.channel.send("You can't mute yourself silly.");
	if(toMute.highestRole.position >= message.member.highestRole.position) return message.channel.send("You can't mute a superior human beeing :scream:");

	let role = message.guild.roles.find(r => r.name === "Muted Boi");
	if(!role) {
		try {
			role = await message.guild.createRole({
				name: "Muted Boi",
				color: "#000000",
				permissions: []
			});

			message.guild.channels.forEach(async (channel, id) => {
				await channel.overwritePermissions(role, {
					SEND_MESSAGES: false,
					ADD_REACTIONS: false
				});
			});
		} catch(e) {
			console.log(e.stack);
		}
	}

	if(toMute.roles.has(role.id)) return message.channel.send("Already a **muted boi**!");

	bot.mutes[toMute.id] = {
		guild: message.guild.id,
		time: Date.now() + parseInt(args[1]) * 1000
	}

	await toMute.addRole(role);

	fs.writeFile("./mutes.json", JSON.stringify(bot.mutes, null, 4), err => {
		if(err) throw err;
		if(!args[1]) {
			message.channel.send(`${message.mentions.users.first()} is now a **muted boi** :ok_hand:`);
		} else {
			message.channel.send(`${message.mentions.users.first()} is now a **muted boi** for ${args[1]} seconds :ok_hand:`);
		}
	});
}

module.exports.help = {
	name: "mute",
	description: "mute someone forever or x seconds",
	usage: "{@user} [time]",
	admin: "1"
}
