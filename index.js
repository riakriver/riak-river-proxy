var http = require('http');
var httpProxy = require('http-proxy');
var redis = require('redis');
var ready;

function buildProxy() {
  var proxy = new httpProxy.RoutingProxy();

  var redis_opts = {
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || '127.0.0.1'
  };

  var client = redis.createClient(redis_opts.port, redis_opts.host);
  client.on('ready', startServer);

  function handler(req, res){
    var auth = req.headers.authorization;
    var cluster_id = req.headers['x-cluster-id'];
    if (auth && cluster_id){
      //check auth with the given cluster id
      proxy.proxyRequest(req, res, {
        host: 'localhost',
        port: 10001
      });
    } else {
      res.writeHead(401);
      res.end();
    }
  }

  var port = process.env.RIAK_RIVER_PROXY_PORT || 8098;

  function startServer() {
    var server = http.createServer(handler).listen(port, function(){
      if (process.env.NODE_ENV !== 'PRODUCTION') {
        console.log('Riak River Proxy running on', port);
        console.log('Riak River Proxy Redis running on', redis_opts);
      }
      if (typeof ready === 'function') ready(port, redis_opts);
    });
  }
}

function exported(done) {
  ready = done;
  return buildProxy;
}

module.exports = exported;
