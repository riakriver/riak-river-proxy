var http = require('http');
var httpProxy = require('http-proxy');
var redis = require('redis');
var ready;

function buildProxy() {
  var proxy = new httpProxy.RoutingProxy();
  var key_prefix = require('./config').key_prefix;

  var redis_opts = {
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || '127.0.0.1'
  };

  var client = redis.createClient(redis_opts.port, redis_opts.host);
  client.on('ready', startServer);

  function checkForCluster(cluster_id, callback) {
    client.get(key_prefix + cluster_id, function(err, reply) {
      if (reply === null) {
        return callback(new Error("Cluster " + cluster_id + " not found"));
      } else {
        return callback(null, reply);
      }
    });
  }

  function handler(req, res){
    var auth = req.headers.authorization;
    var cluster_id = req.headers['x-cluster-id'];
    if (auth && cluster_id){
      checkForCluster(cluster_id, function(err, options) {
        if (err) {
          res.writeHead(404);
          return res.end();
        } else {
          if (auth === options.auth) {
            return proxy.proxyRequest(req, res, options);
          } else {
            res.writeHead(401);
            return res.end();
          }
        }
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
