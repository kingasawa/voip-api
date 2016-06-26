var restify = require('restify');

function handleVoIP(req, res, next) {
	var params = req.params || {};
//log request
console.log('req', params);


  res.send('hello ' + params.name);
  next();
}

var server = restify.createServer();
server.use(restify.queryParser()); // Dung de parse query

server.get('/voip-api/incoming', handleVoIP);
server.post('/voip-api/incoming', handleVoIP);

server.listen(81, function() {
  console.log('%s listening at %s', server.name, server.url);
});
