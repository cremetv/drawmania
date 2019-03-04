const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path = require('path');

class WebSocket {
  constructor(port, client) {
    this.client = client;

    this.app = express();
    this.app.engine('hbs', hbs({
      extname: 'hbs',
      defaultLayout: 'layout',
      layoutsDir: `${__dirname}/layouts`
    }));
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.set('view engine', 'hbs');
    this.app.use(express.static(path.join(__dirname, 'public')));
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());

    this.registerRoutes();

    this.server = this.app.listen(port, () => {
      console.log(`Websocket listening on ${this.server.address().port}`);
    });
  }

  registerRoutes() {
    this.app.get('/', (req, res) => {

      let channels = [];
      this.client.guilds.first().channels
      .filter(c => c.type == 'text')
      .forEach(c => {
        channels.push({id: c.id, name: c.name});
      });

      res.render('index', {
        title: 'Welcome',
        channels: channels
      });

    });

    this.app.post('/sendMessage', (req, res) => {
      let text = req.body.text;
      let channelID = req.body.channelID;

      let channel = this.client.guilds.first().channels.get(channelID);

      if (channel) {
        channel.send(text);
      }
    });

  }

}

module.exports = WebSocket;
