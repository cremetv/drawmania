module.exports.run = async(bot, message, args) => {

  let msgWait = await message.channel.send("doing some magic ...");
  let type;

  let emoji = args[0];
  // emoji = emoji.substring(2, emoji.length - 1);
  emoji = emoji.replace('<', '');
  emoji = emoji.replace('>', '');

  console.log('args[0] --------');
  console.log(args[0]);

  console.log('emoji --------');
  console.log(emoji);

  let emojiarray = emoji.split(':');

  if (emojiarray[0] != 'a') {
    type = '.png';
  } else {
    type = '.gif';
  }

  emojiarray.shift();

  console.log('emojiarray --------');
  console.log(emojiarray);

  let msg = await message.channel.send({files: [
    {
      attachment: `https://cdn.discordapp.com/emojis/${emojiarray[1]}${type}`,
      name: `${emojiarray[0]}${type}`
    }
  ]});

  msgWait.delete();

}

module.exports.help = {
	name: "emoji",
	description: "get the big emojis",
	usage: "{emoji}",
	admin: "0"
}
