var WebSocketServer = require('ws').Server,
crypto = require('crypto'),
mongoose = require('mongoose');

var config = JSON.parse(process.env.IRL_CONFIG ||
 '{ "mongodb_url":"mongodb://localhost/test" }');

mongoose.connect(config.mongodb_url);

var Player = mongoose.model('Player', {});

var wss = new WebSocketServer({port: 8080});

wss.broadcast = function(data) {
  for(var i in this.clients)
    this.clients[i].send(data);
};

wss.on('connection', function(ws) {
  var player = new Player();
  player.save();

  ws.on('message', function(message) {
    console.log('received: %s from %s', message, player._id);
    wss.broadcast(message);
  });

  ws.on('close', function(){
    console.log("client disconnected %s", player._id);
    wss.broadcast("Client disconnected "+ player._id);
  })

  console.log("client connected %s", player._id);
  wss.broadcast('New client connected '+ player._id);
});