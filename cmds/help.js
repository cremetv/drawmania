const fs = require("fs");
const Discord = require("discord.js");

module.exports.run = async(bot, message, args, con) => {

	fs.readdir("./cmds/", (err, files) => {
		if(err) console.error(err);

		let jsfiles = files.filter(f => f.split(".").pop() === "js");
		if(jsfiles.length <= 0) {
			console.log("No commands to load!");
			return;
		}

		var namelist = "";
		var desclist = "";
		var usage = "";
		var admin = "";

		let list = [];

		let result = jsfiles.forEach((f, i) => {
			let props = require(`./${f}`);
			namelist = props.help.name;
			desclist = props.help.description;
			usage = props.help.usage;
			admin = props.help.admin;

			list.push(`${namelist}\n==========\n${desclist}\n\t$${namelist} ${usage}\n\n`);

			con.query(`SELECT * FROM commands WHERE name = '${props.help.name}'`, (err, rows) => {
				if(err) throw err;

				let sql;

				if (rows.length < 1) {
					sql = `INSERT INTO commands (name, description, cmdUsage, admin) VALUES ("${props.help.name}", "${props.help.description}", "${props.help.usage}", "${props.help.admin}")`;
				} else {
					sql = `UPDATE commands SET name = "${props.help.name}", description = "${props.help.description}", cmdUsage = "${props.help.usage}", admin = "${props.help.admin}" WHERE name  = "${props.help.name}"`;
				}

				con.query(sql);
				console.log(sql);
			});
		});

		message.react("✉");

		if (list.length > 40) {
			var list1 = list.slice(20, 40);
			var list2 = list.slice(40);
			list = list.slice(0, 20);
			message.author.send('```MARKDOWN\n' + `# Here's some help for you #\n**Drawmania Bot**\n*made by creme :3*\n\n` + list.join("") + '```');
			message.author.send('```MARKDOWN\n' + list1.join("") + '```');
			message.author.send('```MARKDOWN\n' + list2.join("") + '```');
			console.log('>40');
		} else {
			var list1 = list.slice(20);
			list = list.slice(0, 20);
			message.author.send('```MARKDOWN\n' + `# Here's some help for you #\n**Drawmania Bot**\n*made by creme :3*\n\n` + list.join("") + '```');
			message.author.send('```MARKDOWN\n' + list1.join("") + '```');
			console.log('>20<40');
		}
	});
}

module.exports.help = {
	name: "help",
	description: "show all commands",
	usage: "",
	admin: "0"
}
