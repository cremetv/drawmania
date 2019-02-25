const Discord = module.require("discord.js");
module.exports.run = async(bot, message, args, con) => {

  let hex, rgb, rgbArr, r, g, b, title;

  // check if hex or rgb
  if (!args[0]) {
    // random
    title = 'Random Color';
    hex = randomColor();
    r = hexToRgb(hex).r;
    g = hexToRgb(hex).g;
    b = hexToRgb(hex).b;

  } else if (args[0].includes('#') || args[0].length == 6 || args[0].length == 3 && !args[1]) {
    // #000000 or 000000 or #000 or 000
    title = 'HEX to RGB';
    hex = args[0];
    hex = hex.replace('#', '');

    if (hex.length == 3) {
      hex = hex + hex;
      console.log('hex 3');
    }

    hex = `#${hex}`;
    console.log(hex);

    if (!/^#[0-9A-F]{6}$/i.test(hex)) {
      console.log('hex not valid');
      message.channel.send('Not a valid HEX code');
      return;
    }

    r = hexToRgb(hex).r;
    g = hexToRgb(hex).g;
    b = hexToRgb(hex).b;

  } else if (args[0].includes(',')) {
    // R,G,B
    title = 'RGB to HEX';
    rgbArr = args[0].split(',');
    r = parseInt(rgbArr[0]);
    g = parseInt(rgbArr[1]);
    b = parseInt(rgbArr[2]);

    hex = rgbToHex(r, g, b);

  } else if (args[0].length <= 3 && args[1].length <= 3 && args[2].length <= 3) {
    // R G B
    title = 'RGB to HEX';
    r = parseInt(args[0]);
    g = parseInt(args[1]);
    b = parseInt(args[2]);

    hex = rgbToHex(r, g, b);
  } else {
    return message.channel.send(`can't use your input. Give me hex \`#XXXXXX | XXXXXX | XXX\` or rgb \`r,g,b | r g b\` `);
  }

  if (r > 255 || g > 255 || b > 255) return message.channel.send(`not a valid rgb code \`(max 255)\``);

  let image = `https://ice-creme.de/randcolor/?r=${r}&g=${g}&b=${b}`;

  let embed = new Discord.RichEmbed()
  .setTitle(title)
  .setThumbnail(`${image}`)
  .setColor(hex)
  .addField(`RGB`, `${r}, ${g}, ${b}`)
  .addField(`Hex`, `${hex}`);
  message.channel.send({embed: embed});

  function randomColor() {
  	let color = '#' + ("000000" + Math.random().toString(16).slice(2, 8).toUpperCase()).slice(-6);
    return color;
  }

  /* HEX to RGB
  ========================================== */
  function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  /* RGB to HEX
  ========================================== */
  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }
}

module.exports.help = {
	name: "color",
	description: "Convert hex/rgb or generate a random color",
	usage: "[r][g][b]",
	admin: "0"
}
