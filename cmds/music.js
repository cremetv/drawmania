const YTDL = require('ytdl-core');
const Discord = module.require("discord.js");
module.exports.run = async(bot, message, args) => {

  // if the server is not in the queue object
  if (!servers[message.guild.id]) {
    servers[message.guild.id] = {
      queue: []
    }
  }
  let server = servers[message.guild.id];

  /**********************
  * MUSIC PLAY FUNCTION
  **********************/
  const play = (connection, message) => {
    // play first song in queue
    server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: 'audioonly'}));

    // get infos of next song in queue
    let nextSong;
    if (!server.queue[1]) {
      // if no next song display -
      nextSong = '-';
    } else {
      YTDL.getBasicInfo(server.queue[1], (err, info) => {
        nextSong = `[${info.title}](${info.video_url})`;
      });
    }

    // now playing embed
    YTDL.getBasicInfo(server.queue[0], (err, info) => {
      let embed = new Discord.RichEmbed()
      .setTitle(`Now playing: ${info.title}`)
      .setURL(info.video_url)
      .setDescription(`queued by ${message.author.username}`)
      .setColor(`AQUA`)
      .addField(`Next:`, nextSong);
      message.channel.send({embed: embed})
      .then(message => {
        // message.react(bot.emojis.get('551613542630162432')); // PLAY
        message.react(bot.emojis.get('551613576435990559')).then(() => {
          message.react(bot.emojis.get('551613556601126918')); // SKIP
        }); // PAUSE
      });
    });

    // remove currently playing song from queue
    server.queue.shift();

    server.dispatcher.on('end', () => {
      // if another song in queue
      if (server.queue[0]) {
        // play it
        console.log('PLAY ANOTHER');
        console.log(server.queue);
        play(connection, message);

      } else {
        // else disconnect
        console.log('NO OTHER');
        connection.disconnect();
      }
    });
  }

// FIXME: i need only 1 event listener but everytime you write a command the listener gets added
// so for every $m queue => 1 eventlistener
  // bot.on('messageReactionAdd', (messageReaction, user) => {
  //   if (user.bot) return;
  //   if (messageReaction.emoji.name === 'play') {
  //     console.log('play');
  //     return;
  //   }
  //   if (messageReaction.emoji.name === 'pause') {
  //     console.log('pause');
  //     return;
  //   }
  //   if (messageReaction.emoji.name === 'skip') {
  //     console.log('skip');
  //     console.log(server.queue);
  //     skip();
  //     messageReaction.message.delete();
  //     return;
  //   }
  // });


  /**********************
  * JOIN
  **********************/
  if (args[0] === 'j' || args[0] === 'join') {
    // if user is in voice channel
    if (message.member.voiceChannel) {
      // if bot is not already in voice channel
      if (!message.guild.voiceConnection) {

        // join the voice channel of user
        message.member.voiceChannel.join()
          .then(connection => {
            // add the requested song to the queue
            server.queue.push(args[1]);
            // start playing
            play(connection, message);
          });

      }

    } else {
      message.reply('You must be in a voice channel stupid.');
    }
  }


  /**********************
  * LEAVE
  **********************/
  function leave() {
    // if bot is in voice channel
    if (message.guild.voiceConnection) {
      // if user is in voice channel && in same channel && isn't in team
      if (message.member.voiceChannel && message.member.voiceChannel.id != message.guild.voiceConnection.channel.id && !message.member.hasPermission("MANAGE_MESSAGES")) {
        return message.reply('I\'m not in your channel boi.');
      } else if (!message.member.voiceChannel && !message.member.hasPermission("MANAGE_MESSAGES")) {
        return message.reply('You\'re not in a voice channel.');
      }
      message.guild.voiceConnection.disconnect();
    } else {
      message.reply('Im not even in a voice channel tho.');
    }
  }

  if (args[0] === 'l' || args[0] === 'leave') {
    leave();
  }

  /**********************
  * QUEUE
  **********************/
  if (args[0] === 'q' || args[0] === 'queue') {
    if (!args[1]) {
      let embed = new Discord.RichEmbed()
      .setTitle(`Music Queue:`)
      .setColor(`AQUA`)
      .setFooter(`beep boop`, bot.user.avatarURL);

      // add max 5 songs to next in queue list
      for (let i = 0; i < 5; i++) {
        let songName;
        if (server.queue[i]) {
          YTDL.getBasicInfo(server.queue[i], (err, info) => {
            if (err) return console.log(err);
            songName = info.title;
          });
          embed.addField(songName, '-');
        }
      }

      if (!server.queue[0]) {
        embed.addField('no songs in queue', '-');
      }
      message.channel.send({embed: embed});
      return;
    }

    // if link is requested add to queue
    server.queue.push(args[1]);
    YTDL.getBasicInfo(args[1], (err, info) => {
      message.channel.send(`added ${info.title} to the queue`);
    });
  }

  /**********************
  * SKIP
  **********************/
  function skip() {
    if (server.dispatcher) server.dispatcher.end();
  }

  if (args[0] === 's' || args[0] === 'skip') {
    skip();
  }

  /**********************
  * PAUSE
  **********************/
  if (args[0] === 'p' || args[0] === 'pause') {

  }

  /**********************
  * RESUME
  **********************/
  if (args[0] === 'r' || args[0] === 'resume') {

  }

}

module.exports.help = {
	name: "m",
	description: "...",
	usage: "",
	admin: "0"
}
