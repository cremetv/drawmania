const api = "https://jsonplaceholder.typicode.com/posts";
const snekfetch = require("snekfetch");
const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
	snekfetch.get(api).then(r => {
		let body = r.body;
		let id = Number(args[0]);
		if(!id) return message.channel.send("gimme a ID boi!");
		if(isNaN(id)) return message.channel.send("a valid number pls!");

		let entry = body.find(post => post.id === id);
		if(!entry) return message.channel.send("This entry doesn't exist *sad beep boop*");

		let embed = new Discord.RichEmbed()
			.setAuthor(entry.title)
			.setDescription(entry.body)
			.addField("Author ID", entry.userId)
			.setFooter("Post ID " + entry.id);

		message.channel.send({embed: embed});
	});
}

module.exports.help = {
	name: "json",
	description: "not for you >:(",
	usage: ""
}