const config = module.require('./../config.js');
const Discord = module.require("discord.js");
module.exports.run = async (bot, message, args, con) => {

      let list = [];

      message.channel.send('**TOP 10 Level:**')
      con.execute(config,
        database => database.query(`SELECT name, lvl FROM userlist WHERE server = '${message.guild.id}' ORDER BY lvl DESC LIMIT 10`)
        .then(rows => {
          let i = 1;
          rows.forEach(row => {
            let lvl = ('  ' + row.lvl).slice(-3); // add 2 spaces in front so the tab formatting is clean for levels under 100
            list.push(`${i ++}.\tlvl ${lvl}\t${row.name}`);
          });
        })
      ).then(() => {
        message.channel.sendCode('markdown', list.join('\n'));
      }).catch(err => {
        throw err;
      });
}

module.exports.help = {
	name: "top",
      description: "Show the Top 10 Level List",
      usage: "",
      admin: "0"
}
