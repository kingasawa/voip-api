var restify = require('restify');
var socketio = require('socket.io');

var globalSocket ; // chi co 1 socket available

var server = restify.createServer();
var io = socketio.listen(server.server);


function handleVoIP(req, res, next) {
	var params = req.params || {};
	globalSocket.emit('incoming', params );
  	res.json( { "total": globalSocket.length} );
  	next();
}

server.use(restify.queryParser()); // Dung de parse query

server.get('/voip-api/incoming', handleVoIP);
server.post('/voip-api/incoming', handleVoIP);

server.listen(3001, function() {
  console.log('%s listening at %s', server.name, server.url);
});

server.get('/voip-api/index', restify.serveStatic({
  directory: './public',
  file: 'index.html'
}));

server.get(/.*/, restify.serveStatic({
    'directory': './public'
 }));


io.sockets.on('connection', function (socket) {

	// Lap array connections o day




	globalSocket = socket; // ko nen

	console.log('connected');



    globalSocket.emit('news', { hello: 'world' });

    globalSocket.on('my other event', function (data) {
            console.log(data);
    });
});
