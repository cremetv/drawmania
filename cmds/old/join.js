const ffmpeg = require("ffmpeg");
module.exports.run = async(bot, message, args) => {
	var voiceChannel = message.member.voiceChannel;
  voiceChannel.join().then(connection =>
  {
     const dispatcher = connection.playFile('./Audio/gab.mp3');
     dispatcher.on("end", end => {
       voiceChannel.leave();
       });
   }).catch(err => console.log(err));
}

module.exports.help = {
	name: "join",
	description: "i will join your channel - DOESNT WORK ANYWAY",
	usage: "",
  admin: "1"
}
