var WebSocketServer = require('ws').Server,
    uuid = require('node-uuid'),
    crypto = require('crypto'),
    mongoose = require('mongoose');

var config = JSON.parse(process.env.IRL_CONFIG ||
             '{ "mongodb_url":"mongodb://localhost/test" }');

mongoose.connect(config.mongodb_url);

var Player = mongoose.model('Player', { id: String });

var wss = new WebSocketServer({port: 8080});

wss.broadcast = function(data) {
    for(var i in this.clients)
        this.clients[i].send(data);
};

wss.on('connection', function(ws) {
    var userid = crypto.createHash('sha1').update(uuid.v4()).digest("hex").substring(0,16);
    var player = new Player({ id: userid });
    player.save();

    ws.on('message', function(message) {
        console.log('received: %s from %s', message, userid);
        wss.broadcast(message);
    });

    ws.on('close', function(){
        console.log("client disconnected %s", userid);
        wss.broadcast("Client disconnected "+ userid);
    })

    console.log("client connected %s", userid);
    wss.broadcast('New client connected '+ userid);
});