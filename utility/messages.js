const Database = require('./db.js');
const config = module.require('./../config.js');
const db = new Database(config);
db.execute = ( config, callback ) => {
    const database = new Database( config );
    return callback( database ).then(
        result => database.close().then( () => result ),
        err => database.close().then( () => { throw err; } )
    );
};


module.exports = {
  messageHandler: (message) => {
    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;

    // add xp
    addXp(message);
  },
  directAnswers: (message) => {
    // write direct Answers to chat messages without prefix
    let msgC = message.content.toLowerCase();

    if (msgC.includes('owo') || msgC.includes('uwu')) {
      let answers = ['This is a Weeb-free-christian Server!', 'Begone Weeb!', 'stfu', 'disgusting', 'ugh', 'reeeee', 'stay of this server trash human'];
      message.channel.send(answers[Math.floor(Math.random() * answers.length)]);

    } else if (msgC.includes('gabri')) {
      let answers = ['o kurwa', 'don\'t say his name!', 'anyone asked for some pickles?', 'disgusting', 'oh kurwa', 'ugh'];
      message.channel.send(answers[Math.floor(Math.random() * answers.length)]);

    } else if (msgC.includes('norbert')) {
      let answers = ['cutie', 'praise the chicken lord', 'sexy norb ;)', ':3'];
      message.channel.send(answers[Math.floor(Math.random() * answers.length)]);

    } else if (msgC.includes('kys')) {
      let answers = ['go for it!', 'pls don\'t', 'noo', 'no u', 'do it now!', 'no killing on this server. This is a christian Server!', 'yeah nobody likes you anyway'];
      message.channel.send(answers[Math.floor(Math.random() * answers.length)]);

    } else if (msgC.includes('lol')) {
      message.channel.send('lul');

    } else if (msgC.includes('vsauce')) {
      let answers = ['michael here', 'sauce me daddy', 'heyyyy', 'saucy', 'ugh', 'reeeee', 'HeY VSaUcE mIChAEl HeRE!1', 'sauuuce', 'eat the sauce', 'vsauce gud'];
      message.channel.send(answers[Math.floor(Math.random() * answers.length)]);
    }
  }
}




const addXp = (message) => {

  let currentXp, currentLvl, lvl, messages;

  db.execute(config,
    database => database.query(`SELECT * FROM userlist WHERE userid = ${message.author.id} AND server = ${message.guild.id}`)
    .then(rows => {
      // step 1
      if (rows.length < 1) {
        let guildMember = message.guild.members.get(message.author.id);
        return database.query(`INSERT INTO userlist (userid, name, nick, discriminator, status, messages, avatar, onlinetime, lvl, xp, server) VALUES ('${message.author.id}', '${message.author.username}', '${guildMember.nickname}', '${message.author.discriminator}', '0', '0', '${message.author.displayAvatarURL}', '0', '1', '0', '${message.guild.id}')`);
        console.log(`${message.author.id} is writing but not in DB`);
        console.log(`${message.author.id} inserted in DB`);

      } else {
        let guildMember = message.guild.members.get(message.author.id);
        currentXp = rows[0].xp;
        currentLvl = rows[0].lvl;
        lvl = 1 + Math.sqrt(1 + 8 * currentXp / 50);
        lvl = Math.floor(lvl / 2);
        messages = rows[0].messages + 1;

        if (currentLvl >= 0) {
          let lvlMute = rows[0].lvlMute;
          if (currentLvl < lvl && lvlMute != 1) message.reply(`is now **Level ${lvl}**`);

          database.query(`UPDATE userlist SET lvl = ${lvl} WHERE userid = '${message.author.id}' AND server = ${message.guild.id}`);
          // message.reply(`currLvl: ${currentLvl} - lvl: ${lvl}`);
        }

        // console.log(`currentXp: ${currentXp} - generateXp: ${generateXp}`)

        return database.query(`UPDATE userlist SET xp = ${currentXp + generateXp(20, 30)}, messages = ${messages}, avatar = '${message.author.displayAvatarURL}', nick = '${guildMember.nickname}' WHERE userid = ${message.author.id} AND server = ${message.guild.id}`);
      }
    })
    .then(rows => {
      // console.log(rows);
    })
  ).then(() => {
    // do stuff
  }).catch(err => {
    // errors
    throw err;
  });
}


const generateXp = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
