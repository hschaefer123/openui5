/**
 * UI5 WebSocket minimalistic chat example by Holger Schäfer
 * using node.js and NPM package ws
 */

var express = require('express'),
	path = require('path'),		
	httpPort = process.env.PORT || 80,
	wsPort = 8080,
	app = express();

// all environments
express.static.mime.default_type = "text/xml";
app.use(express.compress());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

// start web socket server
var WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({port: wsPort});

wss.broadcast = function(data) {
    for(var i in this.clients)
        this.clients[i].send(data);
    console.log('broadcasted: %s', data);
};

wss.on('connection', function(ws) {
	ws.on('message', function(message) {
		console.log('received: %s', message);
		wss.broadcast(message);
	});
	ws.send(JSON.stringify(
		{user: 'NODEJS', text: 'Hallo from server'}
	));
});

// start http server
app.listen(httpPort, function(){
  console.log('HTTP Server: http://localhost:' + httpPort);
  console.log('WS Server: ws://localhost:' + wsPort);
});