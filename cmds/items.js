const config = module.require('./../config.js');
const Discord = module.require("discord.js");
module.exports.run = async(client, message, args, con) => {
	let target = message.mentions.users.first() || message.guild.members.get(args[1]) || message.author;

	let items, itemArray, itemAmount, embed, totalValue = 0;

	let ids = []; // all item ids
	let names = []; // all item names
	let values = []; // all item values

	let list = {}; // object with {id : amount}
	let amounts = []; // array of item amounts from itemArray
	let itemnames = []; // array of item names from itemArray
	let itemvalues = []; // array of item values from itemArray

	let displayLimit = 9;
	// let displayLimit;

	con.execute(config,
		database => database.query(`SELECT items FROM userlist WHERE userid = '${target.id}' AND server = '${message.guild.id}'`)
		.then(rows => {
			if (!rows[0]) return message.channel.send('this dude has no items yet');
			items = rows[0].items;
			itemArray = items.split(',');

			itemAmount = itemArray.length;

			// calculate how often the item id is in the itemArray
			function getOccurrence(array, value) {
				let count = 0;
				array.forEach((v) => (v === value && count++));
				return count;
			}

			for (let i = 0; i < itemArray.length; i++) {
				list[itemArray[i]] = getOccurrence(itemArray, itemArray[i]); // insert into amounts obj
			}

			for (key in list) {
				amounts.push(list[key]); // amounts from the object to a array
			}

			return database.query(`SELECT * FROM items`); // go next and select all items from DB
		})
		.then(rows => {
			rows.forEach(function(row) {
				ids.push(row.id);
				names.push(row.itemname);
				values.push(row.value);
			});

		})
	).then(() => {

		// create base embed
		embed = new Discord.RichEmbed()
		.setTitle('Items of')
		.setDescription(target.username)
		.setColor('AQUA')
		.setFooter('beep boop', client.user.avatarURL);

		// for every item in the list obj get the names & values
		for (key in list) {
			let index = ids.indexOf(parseInt(key)); // get the index of the entry
			itemnames.push(names[index]); // push to names array
			itemvalues.push(values[index]); // push to values array
		}

		if (!displayLimit || displayLimit > itemnames.length) {
			displayLimit = itemnames.length;
		}

		// for each item add a embed field
		for (let i = 0; i < displayLimit; i++) {
			embed.addField(itemnames[i], `x${amounts[i]}`, true);
			totalValue += itemvalues[i] * amounts[i]; // calculate the total value of all items
		}

		// if user has more items than display limit
		if (itemnames.length > displayLimit) {
			let diff = itemnames.length - displayLimit;
			embed.addField(`and ${diff} more ...`, 'visit the website to see all items');
		}


		embed.addField(`Total Value:`, `\` ${totalValue}$ \``);

		message.channel.send(`${target.username} has **${itemAmount} Items**`);
		message.channel.send({embed: embed});

	}).catch(err => {
		throw err;
	});

}

module.exports.help = {
	name: "items",
	description: "show the items of a user",
	usage: "[@user]",
	admin: "0"
}
