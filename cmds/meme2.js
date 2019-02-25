const apiKey = '537a7a79-c7f0-49ee-af1b-6d213c882b96';
const fetch = require("node-fetch");
const Discord = module.require("discord.js");
const botsettings = require("./../botsettings.json");
const prefix = botsettings.prefix;

module.exports.run = async(bot, message, args) => {

  console.log(args[0]);

  if (args[0] === '' || args[0] == undefined) {
    message.channel.send('usage:\n```MD\n'+prefix+'meme trending                         \tget current trending memes\n'+prefix+'meme top                              \tget the top 10 memes\n'+prefix+'meme new                              \tget the newest memes\n'+prefix+'meme search {searchTerm}              \tsearch for memes\n'+prefix+'meme {memeName or memeID}             \tshow the meme\n'+prefix+'meme create {memeID} {text1} ; [text2]\tcreate a meme with text (second line is optional)\n#e.g '+prefix+'meme create 4415281 when you make cool memes ; and everyone is using them wrong```');
    return;
  }

  if (args[0] === 'search') {
    args.shift();

    let limit = 10;
    let url = `http://version1.api.memegenerator.net//Generators_Search?q=${args.join('%20')}&pageIndex=0&pageSize=10&apiKey=${apiKey}`;

    fetch(url)
      .then(res => res.json())
      .then(json => {

        if (json.success === true && json.result.length > 0) {
          let results = json.result;

          (results.length < limit) ?  limit = results.length : null;

          let output = [];

          for (let i=0; i < limit; i++) {
            output.push(`${results[i].generatorID.toString().padEnd(9)}\t\t${results[i].displayName}`);
          }

          message.channel.send('Search results for `'+args.join(' ')+'`\n```MD\n#ID      \t\tname\n----------------------------------\n' + output.join('\n') + '```');

        } else {
          message.channel.send('Sry no memes found :(');
        }

      });

    return;
  } // end search


  if (args[0] === 'create') {
    let msg = await message.channel.send("doing some magic ...");
    args.shift();

    let generatorID = args[0];

    args.shift();

    let texts = args.join('#-#');
    let textarr = texts.split(';');
    let text0 = textarr[0].replace(/#-#/g, ' ').trim();
    let text1 = textarr[1];

    console.log(text1);

    if (text1 != undefined) {
      text1 = text1.replace(/#-#/g, ' ').trim();

      text0url = `&text0=${encodeURIComponent(text0)}`;
      text1url = `&text1=${encodeURIComponent(text1)}`;
    } else {
      text0url = `&text1=${encodeURIComponent(text0)}`;
      text1url = '';
    }

    let url = `http://version1.api.memegenerator.net//Instance_Create?languageCode=en&generatorID=${generatorID}${text0url}${text1url}&apiKey=${apiKey}`;

    fetch(url)
      .then(res => res.json())
      .then(json => {

        let type = json.result.imageUrl.substr(json.result.imageUrl.toString().length - 4);

        message.channel.send({files: [
          {
            attachment: json.result.instanceImageUrl,
            name: json.result.displayName + type
          }
        ]});
        msg.delete();
      },
      err => {
        errorHandling(err);
      });

    return;
  } // end create


  if (args[0] === 'top') {
    let url = `http://version1.api.memegenerator.net//Generators_Select_ByPopular?pageIndex=0&pageSize=10&days=&apiKey=${apiKey}`;

    fetch(url)
      .then(res => res.json())
      .then(json => {
        if (json.success === true && json.result.length > 0) {
          let results = json.result;

          let output = [];

          for (let i=0; i < json.result.length; i++) {
            output.push(`${results[i].generatorID.toString().padEnd(9)}\t\t${results[i].displayName}`);
          }
          message.channel.send('Top 10 Memes:```MD\n#ID      \t\tname\n----------------------------------\n' + output.join('\n') + '```');

        } else {
          message.channel.send('Sry no memes found :(');
        }
      },
      err => {
        errorHandling(err);
      });

    return;
  } // end top 10

  if (args[0] === 'new') {
    let url = `http://version1.api.memegenerator.net//Generators_Select_ByNew?pageIndex=0&pageSize=10&apiKey=${apiKey}`;

    fetch(url)
      .then(res => res.json())
      .then(json => {
        if (json.success === true && json.result.length > 0) {
          let results = json.result;

          let output = [];

          for (let i=0; i < json.result.length; i++) {
            output.push(`${results[i].generatorID.toString().padEnd(9)}\t\t${results[i].displayName}`);
          }
          message.channel.send('Newest Memes:```MD\n#ID      \t\tname\n----------------------------------\n' + output.join('\n') + '```');

        } else {
          message.channel.send('Sry no memes found :(');
        }
      },
      err => {
        errorHandling(err);
      });

    return;
  } // end new

  if (args[0] === 'trending') {
    let url = `http://version1.api.memegenerator.net//Generators_Select_ByTrending`;

    fetch(url)
      .then(res => res.json())
      .then(json => {
        if (json.success === true && json.result.length > 0) {
          let results = json.result;

          let output = [];

          for (let i=0; i < json.result.length; i++) {
            output.push(`${results[i].generatorID.toString().padEnd(9)}\t\t${results[i].displayName}`);
          }
          message.channel.send('Trending Memes:```MD\n#ID      \t\tname\n----------------------------------\n' + output.join('\n') + '```');

        } else {
          message.channel.send('Sry no memes found :(');
        }
      },
      err => {
        errorHandling(err);
      });

    return;
  } // end new


  // direct meme input eg. /meme name   || /meme id
  let msg = await message.channel.send("doing some magic ...");
  let url;
  if (/^\d+$/.test(args[0])) {
    url = `http://version1.api.memegenerator.net//Generator_Select_ByUrlNameOrGeneratorID?generatorID=${args[0]}&apiKey=${apiKey}`;
  } else {
    url = `http://version1.api.memegenerator.net//Generator_Select_ByUrlNameOrGeneratorID?&urlName=${args.join('-')}&apiKey=${apiKey}`;
  }
  fetch(url)
    .then(res => res.json())
    .then(json => {

      if (json.success === true && !isEmpty(json.result)) {

        let type = json.result.imageUrl.substr(json.result.imageUrl.toString().length - 4);

        let imageName = json.result.displayName.replace(/"/g, '') + type;

        message.channel.send(' ', {files: [
          {
            attachment: json.result.imageUrl,
            name: imageName
          }
        ]});
        msg.delete();

      } else {
        message.channel.send(`Sry no memes found :(\ntry ${prefix}meme search [meme]`);
      }

    },
    err => {
      errorHandling(err);
    });

  function isEmpty(obj) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  function errorHandling(err) {
    console.log(err);
    message.channel.send('beep boop error:`'+err.code+'`');
  }

}

module.exports.help = {
	name: "meme",
	description: "search memes, make memes, live memes",
	usage: "search {searchTerm} | top | new | trending | create {memeID} {topText} {;} [bottomText] | {memeName/memeID}",
	admin: "0"
}
