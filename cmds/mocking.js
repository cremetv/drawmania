const Discord = module.require("discord.js");
module.exports.run = async(bot, message, args, con) => {

  let newStr = '';

  const mocking = (str) => {
    for (let i = 0; i < str.length; i++) {
      let char = str.charAt(i);
      (Math.random() >= 0.5) ? char = char.toUpperCase() : char = char.toLowerCase();
      newStr += char;
    }
  }

  mocking(args.join(' '));
  message.channel.send(newStr);
  message.delete();
}

module.exports.help = {
	name: "mocking",
	description: "MoCk tHaT ShIT uP",
	usage: "{text}",
	admin: "0"
}
