const Discord = module.require("discord.js");
module.exports.run = async (bot, message, args) => {
	let msg = await message.channel.send("doing some magic ...");
	let memeembed = new Discord.RichEmbed()
		.setAuthor('Memes')
		.setDescription('$meme [name] \n$meme whoa')
		.setColor('AQUA')
		.addField('Select ur meme', '*shitnigga* - aww shit nigga \n*option* - Heres an option \n*whoa* - whoa \n*edge* - living on the edge \n*cya* - veilchen cya \n*crab* - triggered crab \n*yulcancer* - cancer yul \n*nogg* - snoop nogg \n*nobama* - boosted nobama \n*edgegirl* - Edgy Meme Girl \n*anticc* - Anti Christ Creme \n*fire* - shits on fire yo \n*kfc* - KFC crew \n*mistake* - Gabri mistake');

	if(args[0] === "shitnigga") {
		await message.channel.send("``$meme`` for the meme list", {file: "http://ice-creme.de/images/discordmemes/shitnigga.jpg"});
		message.delete();
	} else
	if(args[0] === "option") {
		await message.channel.send("``$meme`` for the meme list", {file: "http://ice-creme.de/images/discordmemes/option.jpg"});
		message.delete();
	} else
	if(args[0] === "whoa") {
		await message.channel.send("``$meme`` for the meme list", {file: "http://ice-creme.de/images/discordmemes/whoa.jpg"});
		message.delete();
	} else
	if(args[0] === "edge") {
		await message.channel.send("``$meme`` for the meme list", {file: "http://ice-creme.de/images/discordmemes/yuledge1.jpg"});
		message.delete();
	} else
	if(args[0] === "cya") {
		await message.channel.send("``$meme`` for the meme list", {file: "http://ice-creme.de/images/discordmemes/veilchenblocked.jpg"});
		message.delete();
	} else
	if(args[0] === "crab") {
		await message.channel.send("``$meme`` for the meme list", {file: "http://ice-creme.de/images/discordmemes/crab-triggered.jpg"});
		message.delete();
	} else
	if(args[0] === "yulcancer") {
		await message.channel.send("``$meme`` for the meme list", {file: "http://ice-creme.de/images/discordmemes/yul-cancer.jpg"});
		message.delete();
	} else
	if(args[0] === "nogg") {
		await message.channel.send("``$meme`` for the meme list", {file: "http://ice-creme.de/images/discordmemes/norbert-dogg.png"});
		message.delete();
	} else
	if(args[0] === "nobama") {
		await message.channel.send("``$meme`` for the meme list", {file: "http://ice-creme.de/images/discordmemes/nobama.jpg"});
		message.delete();
	} else
	if(args[0] === "edgegirl") {
		await message.channel.send("``$meme`` for the meme list", {file: "http://ice-creme.de/images/discordmemes/entropia-knife.jpg"});
		message.delete();
	} else
	if(args[0] === "anticc") {
		await message.channel.send("``$meme`` for the meme list", {file: "http://ice-creme.de/images/discordmemes/Anti-Christ_Marcel.png"});
		message.delete();
	} else
	if(args[0] === "fire") {
		await message.channel.send("``$meme`` for the meme list", {file: "http://ice-creme.de/images/discordmemes/shitsonfire.jpg"});
		message.delete();
	} else
	if(args[0] === "kfc") {
		await message.channel.send("``$meme`` for the meme list", {file: "http://ice-creme.de/images/discordmemes/kfc.jpg"});
		message.delete();
	} else
	if(args[0] === "mistake") {
		await message.channel.send("``$meme`` for the meme list", {file: "http://ice-creme.de/images/discordmemes/mistake.jpg"});
		message.delete();
	} else
	// if(args[0] === "") {
	// 	message.channel.send("``$meme`` for the meme list", {file: "http://ice-creme.de/images/discordmemes/"});
	// } else

	await message.channel.send(memeembed);
	msg.delete();
	return;
}

module.exports.help = {
	name: "meme2",
	description: "get some memes",
	usage: "[memename]",
	admin: "0"
}
