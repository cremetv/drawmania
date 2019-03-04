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

/*
* Websocket
*/
// const WS = require('./web/web');
// const web = new WS(5665, client);

// const express = require('express');
// const http = require('http').Server(express);
// const socket = require('socket.io')(http);
// const hbs = require('express-handlebars');
// const bodyParser = require('body-parser');
// const path = require('path');
//
// const app = express();
// app.engine('hbs', hbs({
//   extname: 'hbs',
//   defaultLayout: 'layout',
//   layoutsDir: `${__dirname}/web/layouts`
// }));
// app.set('views', path.join(__dirname, 'web/views'));
// app.set('view engine', 'hbs');
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
//
// app.get('/', (req, res) => {
//   let chans = [];
//   client.guilds.first().channels
//   .filter(c => c.type == 'text')
//   .forEach(c => {
//     chans.push({id: c.id, name: c.name});
//   });
//
//   res.render('index', {
//     title: 'Welcome',
//     channels: chans
//   });
// });
//
// // socket.on('connection', function(socket){
// //   console.log('a user connected');
// // });
//
// // http.listen(3000, () => {
// //   console.log(`Websocket listening on 3000`);
// // });
// const server = http.Server(app).listen(app.get('port'), function(){
//   console.log("Express server listening on port " + app.get('port'));
// });
//
// const io = socket.listen(server);
// io.sockets.on('connection', function () {
//   console.log('hello world im a hot socket');
// });
//
// io.on('connection', function(socket){
//   console.log('a user connected');
// });

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
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  let servers = [];
  let chans = [];

  client.guilds.forEach(s => {
    servers.push({id: s.id, name: s.name});
  });

  client.guilds.first().channels
  .filter(c => c.type == 'text')
  .forEach(c => {
    chans.push({id: c.id, name: c.name});
  });

  res.render('index', {
    title: 'Welcome',
    servers: servers,
    channels: chans
  });
});

app.post('/getServer', (req, res) => {
  let chans = [];
  let serverID = req.body.serverID;
  let server = client.guilds.get(serverID);
  let serverChannels = server.channels.filter(c => c.type == 'text')
  .forEach(c => {
    chans.push({id: c.id, name: c.name});
  });
  res.json(chans);
  // io.emit('server select', {chans: chans});
});

const server = http.createServer(app).listen(3000, () => {
  console.log(`Express server listening on port 3000`);
});
const io = socket.listen(server);

io.sockets.on('connection', (socket) => {
  // broadcast to everyone except the connected one
  socket.broadcast.emit('hi');
  console.log('hello world im a hot socket');

  // on chat message from site
  socket.on('chat message', (data) => {
    console.log(`message: ${data.message}`);
    console.log(`serverID: ${data.serverID}`);
    console.log(`channeldID: ${data.channelID}`);
    let server = client.guilds.get(data.serverID);
    let channel = server.channels.get(data.channelID);

    if (server && channel) {
      channel.send(data.message);
    }

    // emit to everyone
    io.emit('some event', { for: 'everyone' });

  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

});

client.on("message", async message => {
  console.log('XXXX MESSAGE XXXX');
  io.emit('discord message', message.content);

  // if (message.mentions.users.first()) {
  //   console.log('someone was mentioned');
  //   console.log(message.content);
  //   console.log('--------');
  //   console.log(message.mentions.users.first());
  //   let msg = message.content.replace(`<@${message.mentions.users.first().id}>`, '');
  //   console.log(msg);
  // }

  if (message.mentions.users.first()) {
    let msg = message.content;

    message.mentions.users.forEach(u => {
      console.log(u);
      msg = msg.replace(`<@${u.id}>`, '').replace(/ +(?= )/g,'');
    });

    console.log(msg);
  }

});


/*
* Music
*/
global.servers = {};

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
  client.user.setStatus("offline");
});


client.login(botsettings.token);
