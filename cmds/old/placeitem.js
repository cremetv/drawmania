const Discord = module.require("discord.js");
module.exports.run = async(bot, message, args, con) => {

  // select a random item from DB
  // send in channel

  message.channel.send('[Dropped Item] asd')
  .then(message => message.react("✉"));
  // message.react("✉");

	// con.query(`SELECT * FROM userlist WHERE userid = '${target.id}' AND server = '${message.guild.id}'`, (err, rows) => {
	// 	if(err) throw err;
  //
	// 	if(!rows[0]) return message.channel.send("this dude has no items yet");
  //   var itemArray = rows[0].items;
  //   itemArray = itemArray.split(',');
  //
  //   var itemAmount = itemArray.length;
  //
  //   let list = {};
  //   let sortable = [];
  //
  //   function getOccurrence(array, value) {
  //     var count = 0;
  //     array.forEach((v) => (v === value && count++));
  //     return count;
  //   }
  //
  //   for (let i = 0; i < itemArray.length; i++) {
  //     list[itemArray[i]] = getOccurrence(itemArray, itemArray[i]);
  //   }
  //
  //   message.channel.send(`${target.username} has **${itemAmount} Items**`);
  //
  //   let embed = new Discord.RichEmbed()
  //   .setAuthor('items of')
  //   .setDescription(target.username)
  //   .setColor('AQUA')
  //   .setFooter("beep boop", bot.user.avatarURL);
  //
  //   for (key in list) {
  //     con.query(`SELECT * FROM items WHERE id = '${key}'`, (err, rows) => {
  //       let itemname = rows[0].itemname;
  //       embed.addField(itemname, `x${list[key]}`, true);
  //     });
  //   }
  //   message.channel.send({embed: embed});
  //
	// });
}

module.exports.help = {
	name: "placeitem",
	description: "place a item",
	usage: "",
	admin: "0"
}
