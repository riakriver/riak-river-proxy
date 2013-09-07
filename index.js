var http = require('http'),
    httpProxy = require('http-proxy'),
    ready;

var proxy = new httpProxy.RoutingProxy();

var handler = function(req, res){
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
};

var port = process.env.RIAK_RIVER_PROXY_PORT || 8098;

http.createServer(handler).listen(port, function(){
  console.log('Riak River Proxy running on', port);
  if (typeof ready === 'function') ready();
});

module.exports = function(done) { ready = done; };
