var http = require('http');
var httpProxy = require('http-proxy');
var redis = require('redis');
var ready;

function buildProxy() {
  var proxy = new httpProxy.RoutingProxy();
  var cluster_prefix = require('./config').cluster_prefix;
  var redis_opts = require('./config').redis_opts;

  var client = redis.createClient(redis_opts.port, redis_opts.host);
  client.on('ready', startServer);

  function checkForCluster(cluster_id, callback) {
    client.get(cluster_prefix + cluster_id, function(err, reply) {
      if (reply === null) {
        return callback(new Error("Cluster " + cluster_id + " not found"));
      } else {
        return callback(null, JSON.parse(reply).cluster);
      }
    });
  }

  function passOnToCluster(req, res, cluster) {
    return proxy.proxyRequest(req, res, cluster.nodes[0]);
  }

  function handler(req, res){
    var auth = req.headers.authorization;
    var cluster_id = req.headers['x-cluster-id'];
    if (auth && cluster_id){
      checkForCluster(cluster_id, function(err, cluster) {
        if (err) {
          res.writeHead(404);
          return res.end();
        } else {
          if (auth === cluster.authToken) {
            return passOnToCluster(req, res, cluster);
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
      if (process.env.NODE_ENV !== 'PRODUCTION' &&
         process.env.NODE_ENV !== 'TESTING') {
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
