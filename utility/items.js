const Database = require('./db.js');
const config = module.require('./../config.js');
const db = new Database(config);
db.execute = function( config, callback ) {
    const database = new Database( config );
    return callback( database ).then(
        result => database.close().then( () => result ),
        err => database.close().then( () => { throw err; } )
    );
};

module.exports = {
  itemPickup: function (messageReaction, user) {
    if (user.bot) return;

    let reacterId = user.id;

    // if it's a item drop message
    if (messageReaction.message.content.includes('[Dropped Item]') && messageReaction.message.author.bot) {
      // delete the drop message by bot
      messageReaction.message.delete();

      // get the itemname from the embed
      messageReaction.message.embeds.forEach((embed) => {
        let pickedUpItem = embed.title;

        // send collected message
        messageReaction.message.channel.send(`${user.username} collected \`${pickedUpItem}\``);

        // Write in DB
        let currentItemsArray, pickedUpItemId;

        db.execute(config,
          database => database.query(`SELECT items FROM userlist WHERE userid = '${reacterId}' AND server = '${messageReaction.message.guild.id}'`)
          .then(rows => {
            // step 1
            if (rows.length > 0) {
              currentItemsArray = rows[0].items;
              currentItemsArray = currentItemsArray.split(',');

              return database.query(`SELECT id FROM items WHERE itemname = '${pickedUpItem}'`);
            }
          })
          .then(rows => {
            // step 2
            if (rows.length > 0) {
              pickedUpItemId = rows[0].id;
              currentItemsArray.push(pickedUpItemId);

              return database.query(`UPDATE userlist SET items = '${currentItemsArray.join(',')}' WHERE userid = '${reacterId}' AND server = '${messageReaction.message.guild.id}'`);
            }
          })
        ).then(() => {
          // do stuff
          console.log('items added to DB');
        }).catch(err => {
          // errors
          throw err;
        });
      });
    }
  }
}
