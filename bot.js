const botsettings = require("./botsettings.json");
const Discord = require("discord.js");
const fs = require("fs");
const ffmpeg = require("ffmpeg");
const Database = require('./utility/db.js');
const config = module.require('./config.js');

// utility functions
const msg = require('./utility/messages.js');
const items = require('./utility/items.js');

// bot prefix
const prefix = botsettings.prefix;

// create bot
const client = new Discord.Client({disableEveryone: true});
client.commands = new Discord.Collection();

const logcolor = '\x1b[46m\x1b[30m%s\x1b[0m';


/****************
* Websocket
****************/
const socket = require('socket.io')
const express = require('express');
const http = require('http');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: `${__dirname}/web/layouts`
}));
app.set('views', path.join(__dirname, 'web/views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, '/web/public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const server = http.createServer(app).listen(3000, () => {
  console.log(`Express server listening on port 3000`);
});
const io = socket.listen(server);


// index of webinterface
app.get('/', (req, res) => {
  let servers = [];
  let chans = [];

  // get all server
  client.guilds.forEach(s => {
    servers.push({id: s.id, name: s.name, icon: s.icon});
  });

  // get all text channels of the first server
  client.guilds.first().channels
  .filter(c => c.type == 'text')
  .forEach(c => {
    chans.push({id: c.id, name: c.name});
  });

  res.render('index', {
    status: 'online',
    title: 'Welcome',
    servers: servers,
    channels: chans
  });
});

app.post('/getServer', (req, res) => {
  // get all channels for the selected server
  let chans = [];
  let server = client.guilds.get(req.body.serverId);
  let serverChannels = server.channels.filter(c => c.type == 'text')
  .forEach(c => {
    chans.push({id: c.id, name: c.name});
  });
  // send back the data
  res.json(chans);
});

// when user connect to webinterface
io.sockets.on('connection', (socket) => {
  console.log('user connected');

  // on chat message from site
  socket.on('chat message', (data) => {
    let server = client.guilds.get(data.serverId);
    let channel = server.channels.get(data.channelId);

    // send message from webinterface to discord
    if (server && channel) {
      channel.send(data.message);
    }
  });

  // when user disconnects from webinterface
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

});

// discord message to webinterface
client.on("message", async message => {
  if (message.author.bot) return;

  // send message to webinterface
  io.emit('discord message', {message: message.content, author: message.author.username, server: message.channel.guild.name, channel: message.channel.name});
});


/****************
* Music
****************/
global.servers = {};


/****************
* Database Connection
****************/
const db = new Database(config);
db.execute = ( config, callback ) => {
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

  // send status to webinterface
  io.emit('status update', { status: 'online' });

	// generate invitelink
	try {
		let link = await client.generateInvite(['ADMINISTRATOR']);
		console.log(link);
		console.log(logcolor, '**********');
	} catch (e) {
		console.log(e.stack);
	}


	// drop items
	const placeItemInterval = () => {
		let delay = getRandomInt(1200000, 3600000)

		console.log(`time to next item drop: ${delay}ms`);

		placeItem();
		setTimeout(placeItemInterval, delay);
	}
  // currently disabled
	// placeItemInterval();

	const getRandomInt = (min, max) => {
	  min = Math.ceil(min);
	  max = Math.floor(max);
	  return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	const placeItem = () => {
	  const rand = (min, max) => {
	    return Math.random() * (max - min) + min;
	  }

	  const getRandomItem = (list, weight) => {
	    let total_weight = weight.reduce((prev, cur, i, arr) => {
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
	      rows.forEach((row) => {
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
// client.on('guildCreate', guild => {
// 	console.log('guild create');
// });


/****************
* Guild Member Add
****************/
client.on('guildMemberAdd', member => {
	console.log('someone joined the server');
  // TODO: write to DB
});


/****************
* Guild Member Remove
****************/
client.on('guildMemberRemove', member => {
	console.log('someone left the server');
  // TODO: update DB
});


/****************
* Guild Member Update
****************/
client.on('guildMemberUpdate', (oldMember, newMember) => {
	console.log('updated member');
  // TODO: update DB
});


/****************
* Message
****************/
client.on("message", async message => {
  // functions in utility/messages
  // TODO: FIX xp/lvl system something is broke
  if (!message.author.bot) {
    msg.messageHandler(message);
  	msg.directAnswers(message);
  }

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
// item pickup
client.on("messageReactionAdd", async (messageReaction, user) => {
	items.itemPickup(messageReaction, user);
});

// music reactions
client.on('messageReactionAdd', (messageReaction, user) => {
  if (user.bot) return;

  if (!servers[messageReaction.message.guild.id]) {
    servers[messageReaction.message.guild.id] = {
      queue: []
    }
  }
  let server = servers[messageReaction.message.guild.id];

  if (messageReaction.emoji.name === 'play') {
    console.log('play');
    if (server.dispatcher) server.dispatcher.resume();
    messageReaction.message.clearReactions().then(() => {
      messageReaction.message.react(client.emojis.get('551613576435990559')).then(() => {
        messageReaction.message.react(client.emojis.get('551613556601126918'));
      });
    });
    return;
  }
  if (messageReaction.emoji.name === 'pause') {
    console.log('pause');
    if (server.dispatcher) server.dispatcher.pause();
    messageReaction.message.clearReactions().then(() => {
      messageReaction.message.react(client.emojis.get('551613542630162432')).then(() => {
        messageReaction.message.react(client.emojis.get('551613556601126918'));
      });
    });
    return;
  }
  if (messageReaction.emoji.name === 'skip') {
    console.log('skip');
    if (server.dispatcher) server.dispatcher.end();
    messageReaction.message.delete();
    return;
  }
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
  io.emit('status update', { status: 'offline' });
  client.user.setStatus("offline");
});


client.login(botsettings.token);
