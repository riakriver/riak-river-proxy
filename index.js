var http = require('http'),
    httpProxy = require('http-proxy'),
    ready;

var handler = function(req, res, proxy){
  var auth = req.headers.authorization;
  var cluster_id = req.headers.x_cluster_id;
  if (auth && cluster_id){
    //check auth with the given cluster id
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

module.exports = function(done) { ready = done; }
