const Discord = module.require("discord.js");
module.exports.run = async(bot, message, args) => {

  console.log('*************************************');

  // if admin/mod && kein giveaway atm => start giveaway with args = gift
  // else if admin/mod && giveaway atm => darfst nicht mitmachen =)
  // else if kein giveaway atm => theres no giveaway atm
  // else if giveaway atm => collect usernames als claimer
  //     react to -claim of user with
  //     if list of winner full => sry all gifts are gone
  // else error

  let giveaway = false;
  let winners = [];
  let maxUser = args[0];
  if (!maxUser || !/^[0-9]*$/gm.test(maxUser)) {
    maxUser = 5;
    console.log('maxuser ! or not numbers');
  }

  if (!giveaway) {
    console.log('no giveaway');
    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
      // normal user
      console.log('normal user');
      return message.channel.send('there\'s no giveaway at the moment.');

    } else {
      // staff
      console.log('staff');

      if (!args[1]) return message.channel.send('please specify a giveaway item/code');

      args.shift();
      console.log(`args after push ${args}`);
      let gift = args.join(' ');

      console.log(`maxUser: ${maxUser}`);
      console.log(`gift: ${gift}`);

      startGiveaway(gift);
    }
  } else if (giveaway) {
    console.log('giveaway');
    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
      // normal user
      console.log('normal user');

      if (winners.length >= maxUser) {
        console.log('winners.length >= maxUser');
        return message.channel.send('sry all gifts are gone!');
      } else {
        console.log('added to winners array');
        message.react('✅');
        winners.push(message.author.username);
      }

    } else {
      // staff
      console.log('staff');

      if (args[0] == 'stop') {
        // stop giveaway
        giveaway = false;
        console.log(`giveaway stopped by staff. Winnerlist:`);
        console.log(winners);

      } else {
        console.log('not allowed');
        return message.channel.send('beep boop you\'re not allowed in the giveaway.');
      }
    }
  } else {
    message.channel.send('beep boop error occured ._."');
  }

  // after awaitMessages => announce winners

  function startGiveaway(gift) {
    console.log('startGiveaway()');
    giveaway = true;

    let embed = new Discord.RichEmbed()
    .setTitle('Giveaway time!!!')
    .setDescription('type -claim to claim a gift')
    .addField('stuff to giveaway:', gift)
    .setColor('#bada55')
    .setFooter('beep boop', bot.user.avatarURL);
    message.channel.send({embed: embed});

    const filter = message => message.content.startsWith('-claim');

    message.channel.awaitMessages(filter, {max: maxUser, time: 60000, errors: ['time']})
    .then(collected => {
      console.log(`collected size: ${collected.size}`);
      console.log(`winners: ${winners.join(', ')}`);
      message.channel.send(`winners: ${winners.join(', ')}`);
    })
    .catch(collected => {
      console.log(`After a minute, only ${collected.size} out of ${maxUser} voted.`);
      console.log(`winners: ${winners.join(', ')}`);
      message.channel.send(`After a minute, only ${collected.size} out of ${maxUser} voted.`);
      message.channel.send(`winners: ${winners.join(', ')}`);
    });
  }


console.log('*************************************');
}

module.exports.help = {
	name: "claim",
	description: "start a giveaway",
	usage: "[Giveaway Item]",
	admin: "0"
}
