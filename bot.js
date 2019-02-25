const botsettings = require("./botsettings.json");
const Discord = require("discord.js");
const fs = require("fs");
const ffmpeg = require("ffmpeg");
// const mysql = require("mysql");
const Database = require('./utility/db.js');
const config = module.require('./config.js');

// utility functions
const msg = require('./utility/messages.js');
const items = require('./utility/items.js');

const prefix = botsettings.prefix;

const client = new Discord.Client({disableEveryone: true});
client.commands = new Discord.Collection();

const logcolor = '\x1b[46m\x1b[30m%s\x1b[0m';


/****************
* Database Connection
****************/

const db = new Database(config);
db.execute = function( config, callback ) {
    const database = new Database( config );
    return callback( database ).then(
        result => database.close().then( () => result ),
        err => database.close().then( () => { throw err; } )
    );
};


/****************
* Load Commands
****************/
fs.readdir('./cmds/', (err, files) => {
	if (err) console.log(err);

	let jsfiles = files.filter(f => f.split('.').pop() === 'js');
	if (jsfiles.length <= 0) {
		console.log('No commands to load!');
		return;
	}

	console.log(`Loading ${jsfiles.length} commands!`);

	jsfiles.forEach((f, i) => {
		let props = require(`./cmds/${f}`);
		console.log(`${i + 1}: ${f} loaded!`);
		client.commands.set(props.help.name, props);
	});
});


/****************
* Ready
****************/
client.on('ready', async () => {
	console.log('\x1b[32m%s\x1b[0m', `Bot is ready! ${client.user.username}`);
	client.user.setGame(`beep boop`, "https://ice-creme.de");

	// generate invitelink
	try {
		let link = await client.generateInvite(['ADMINISTRATOR']);
		console.log(link);
		console.log(logcolor, '**********');
	} catch (e) {
		console.log(e.stack);
	}


	// drop items
	function placeItemInterval() {
		// 1200000 = 20min
		// 3600000 = 60min
		let delay = getRandomInt(1200000, 3600000)
		// let delay = getRandomInt(1000, 8000);
		console.log(`time to next item drop: ${delay}ms`);
		placeItem();
		setTimeout(placeItemInterval, delay);
	}
	// placeItemInterval();

	function getRandomInt(min, max) {
	  min = Math.ceil(min);
	  max = Math.floor(max);
	  return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function placeItem() {
	  const rand = function(min, max) {
	    return Math.random() * (max - min) + min;
	  }

	  const getRandomItem = function(list, weight) {
	    let total_weight = weight.reduce(function(prev, cur, i, arr) {
	      return prev + cur;
	    });

	    let random_num = rand(0, total_weight);
	    let weight_sum = 0;

	    for (var i = 0; i < list.length; i++) {
	      weight_sum += weight[i];
	      weight_sum = +weight_sum.toFixed(2);

	      if (random_num <= weight_sum) {
	        return list[i];
	      }
	    }
	  }

	  let items = [];
	  let dropchance = [];
	  let values = [];

	  let itemname, drop, value, random_item, valueIndex, valueOfItem;

	  const itemDropServer = client.guilds.find('name', 'cremes filthy bot testing area');
		const itemDropChannel = itemDropServer.channels.find('name', 'general');

	  db.execute(config,
	    database => database.query(`SELECT * FROM items`)
	    .then(rows => {
	      rows.forEach(function(row) {
	        itemname = row.itemname;
	        drop = row.dropchance;
	        value = row.value;
	        items.push(itemname);
	        dropchance.push(drop);
	        values.push(value);
	      });
	    })
	  ).then(() => {
	    random_item = getRandomItem(items, dropchance);

	    valueIndex = items.indexOf(random_item);
	    valueOfItem = values[valueIndex];

	    console.log(random_item);
	    console.log(valueOfItem);

	    let embed = new Discord.RichEmbed()
	    .setTitle(random_item)
	    .setDescription(`value: ${valueOfItem}$`)
	    .setColor('AQUA');
	    itemDropChannel.send('[Dropped Item]', {embed: embed})
	    .then(message => message.react(client.emojis.get('534749124759912449')));

	  }).catch(err => {
	    throw err;
	  });
	}

});


/****************
* Guild Create
****************/
client.on('guildCreate', guild => {
	console.log('guild create');
});


/****************
* Guild Member Add
****************/
client.on('guildMemberAdd', member => {
	console.log('someone joined the server');
});


/****************
* Guild Member Remove
****************/
client.on('guildMemberRemove', member => {
	console.log('someone left the server');
});


/****************
* Guild Member Update
****************/
client.on('guildMemberUpdate', (oldMember, newMember) => {
	console.log('updated member');
});


/****************
* Message
****************/
client.on("message", async message => {
	msg.messageHandler(message);
	msg.directAnswers(message);

	// init commands
	let messageArray = message.content.split(/\s+/g);
	let command = messageArray[0];
	let args = messageArray.slice(1);

	if (!command.startsWith(prefix)) return;

	let cmd = client.commands.get(command.slice(prefix.length));
	if (cmd) cmd.run(client, message, args, db);
});


/****************
* Reaction Add
****************/
client.on("messageReactionAdd", async (messageReaction, user) => {
	items.itemPickup(messageReaction, user);
});


/****************
* Voice State Update
****************/
client.on('voiceStateUpdate', (oldMember, newMember) => {
	console.log('voiceStateUpdate');
});


/****************
* Disconnected
****************/
client.on("disconnected", () => {
	console.log('offline');
  client.user.setStatus("offline");
});


client.login(botsettings.token);
