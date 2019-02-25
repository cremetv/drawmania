const snekfetch = require("snekfetch");
const fetch = require("node-fetch");
module.exports.run = async(bot, message, args) => {
	const targetUser = message.mentions.users.first() || message.guild.members.get(args[1]) || message.author;
  const target = targetUser.username;
  const user = message.author.username;
  const api = 'https://www.foaas.com';
  const server = message.guild.name;
  const header = {
    'Accept': 'application/json'
  };

  if (args[0] === '-v') {
    fetch('https://www.foaas.com/version', {headers: header})
      .then(res => res.json())
      .then(json => {
        message.channel.send('```MD\n'+json.message+'\n\t'+json.subtitle+'```');
      });
    return;
  }

  fetch(`${api}/operations`)
    .then(res => res.json())
    .then(json => {
      let nr = getRandomInt(0, json.length);

      if (json[nr].url === '/version') {
        nr = getRandomInt(0, json.length);
      }

      let url = api + json[nr].url;
      url = url.replace(':from', user).replace(':name', target).replace(':company', target).replace(':thing', target).replace(':language', 'english').replace(':reference', `${server} 69:420`).replace(':noun', 'dicksucking').replace(':behavior', 'style').replace(':do', 'fuck').replace(':something', 'horse').replace(':tool', 'your brain');
      console.log(url);

      fetch(url, {headers: header})
        .then(res => res.json())
        .then(json => {
          message.channel.send(targetUser + '```MD\n'+json.message+'\n\t'+json.subtitle+'```');
          message.delete();
        });

    });

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}

module.exports.help = {
	name: "fuckoff",
	description: "tell a user to fuck off :)",
	usage: "[@user]",
	admin: "0"
}
