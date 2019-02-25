const fetch = require("node-fetch");
const api = 'https://api.adviceslip.com/advice';
module.exports.run = async(bot, message, args) => {

  let url = api;

  if (args[0] === '' || args[0] == undefined) {
  } else {
    url = url + '/search/' + args.join('%20');
  }

  console.log(url);

  fetch(url)
    .then(res => res.json())
    .then(json => {

      console.log(json);

      if (json.message) {
        message.channel.send(json.message.text);
        return;
      }

      if (json.total_results == 1) {
        message.channel.send(json.slips[0].advice);
      } else {
        message.channel.send(json.slip.advice);
      }
    });

}

module.exports.help = {
	name: "advice",
	description: "get advice",
	usage: "[searchTerm]",
	admin: "0"
}
