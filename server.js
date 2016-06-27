var restify = require('restify');
var socketio = require('socket.io');

var server = restify.createServer();
var io = socketio.listen(server.server);

var allClients = [];

function handleVoIP(req, res, next) {
  var params = req.params || {};

  console.log('params.length', Object.keys(params).length);
  console.log('params.length', params);
  if (Object.keys(params).length > 0) {
    for (client in allClients) {
      allClients[client].emit('incoming', params);
    }

    res.json(200, {"total": allClients.length});
  }

  res.json(404, {"total": 0});

  next();
}

server.use(restify.queryParser()); // Dung de parse query

server.get('/incoming', handleVoIP);
server.post('/incoming', handleVoIP);

server.listen(3001, function() {
  console.log('Calling API %s listening at %s', server.name, server.url);
});


server.get(/\/public\/?.*/, restify.serveStatic({
  directory: __dirname, default: 'index.html'
}));

io.sockets.on('connection', function(socket) {

  allClients.push(socket);

  socket.on('disconnect', function() {
    console.log('Got disconnect!');

    var i = allClients.indexOf(socket);
    allClients.splice(i, 1);
  });
});
