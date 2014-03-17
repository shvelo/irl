var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 8080});

wss.broadcast = function(data) {
    for(var i in this.clients)
        this.clients[i].send(data);
};

wss.on('connection', function(ws) {
    ws.on('message', function(message) {
        console.log('received: %s', message);
        wss.broadcast(message);
    });
    ws.on('close', function(){
        console.log("client disconnected");
        wss.broadcast("Client disconnected");
    })
    console.log("client connected");
    wss.broadcast('New client connected');
});