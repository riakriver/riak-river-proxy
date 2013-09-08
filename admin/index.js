var http = require('http');
var express = require('express');
var app = express();
var ready;

function buildServer() {
  var clusters = require(__dirname + '/clusters');

  app.use(express.bodyParser());

  app.get('/clusters', clusters.list);
  app.post('/clusters', clusters.create);
  app.get('/clusters/:id', clusters.single.list);
  app.delete('/clusters/:id', clusters.single.delete);
  app.put('/clusters/:id', clusters.single.update);

  var port = process.env.RIAK_RIVER_PROXY_ADMIN_PORT || 3000;
  http.createServer(app).listen(port, function() {
    if (process.env.NODE_ENV !== 'PRODUCTION') {
      console.log('Riak River Admin Proxy API running on', port);
    }
    if (typeof ready === 'function') ready(port);
  });
}

module.exports = function(done) {
  ready = done;
  return buildServer;
};
