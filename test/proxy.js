var should = require('should');
var request = require('request');
var async = require('async');

describe('Lookup proxy location', function() {
  var host = 'http://127.0.0.1', port;
  before(function(done) {
    process.env.RIAK_RIVER_PROXY_PORT = 8098;
    require(__dirname + '/../index')(function(rrp_port){
      done();
      port = rrp_port;
    })();
  });
  it('should not proxy if missing Authorization header with or without X-Cluster-Id - return 401', function(done) {
    var headers = [ {}, {"X-Cluster-Id": "Cluster12345"} ];

    function iterator(headers, callback) {
      function handler(e, r, b) {
        should.strictEqual(e, null);
        should.strictEqual(r.statusCode, 401);
        callback();
      }
      request({
        url: host + ':' + port,
        headers: headers
      }, handler);
    }

    async.each(headers, iterator, done);
  });
  it('should not proxy a bad request with bad cluster id - return 404', function(done) {
    function handler(e, r, b) {
      should.strictEqual(e, null);
      should.strictEqual(r.statusCode, 404);
      done();
    }
    var opts = {
      url: host + ':' + port,
      headers: {
        Authorization: 'BAD AUTH',
        "X-Cluster-Id": 'cluster12345'
      }
    };
    request(opts, handler);
  });
  it('should not proxy a good cluster with bad auth key - return 401', function(done){
    var client = require('redis').createClient();
    var key = require(__dirname + '/../config').cluster_prefix + 'test-cluster401';
    client.set(key, JSON.stringify({
      cluster: {
        authToken:'test-cluster401auth'
      }
    }), function() {
      function handler(e, r, b) {
        should.strictEqual(e, null);
        should.strictEqual(r.statusCode, 401);
        client.del(key, done);
      }
      var opts = {
        url: host + ':' + port,
        headers: {
          Authorization: 'NOT THE PASSWORD',
          "X-Cluster-Id": "test-cluster401"
        }
      };
      request(opts, handler);
    });
  });
  it('should proxy a good request - pass on request - return 200', function(done){
    var http = require('http');
    var client = require('redis').createClient();
    var key = require(__dirname + '/../config').cluster_prefix + 'test-cluster401';

    function serverHandler(req, res) {
      res.writeHead(200, {server: 'test-server-handler'});
      res.end();
    }

    http.createServer(serverHandler).listen(60000, function() {
      client.set(key, JSON.stringify({
        cluster: {
          authToken:'test-cluster401auth',
          nodes: [{
            host: '127.0.0.1',
            port: 60000
          }]
        }
      }), function() {
        function handler(e, r, b) {
          should.strictEqual(e, null);
          should.strictEqual(r.statusCode, 200);
          should.strictEqual(r.headers.server, 'test-server-handler');
          client.del(key, done);
        }
        var opts = {
          url: host + ':' + port,
          headers: {
            Authorization: 'test-cluster401auth',
            "X-Cluster-Id": "test-cluster401"
          }
        };
        request(opts, handler);
      });
    });
  });

  it('should handle a non responsive proxy endpoint - 500', function(done) {
    var client = require('redis').createClient();
    var key = require(__dirname + '/../config').cluster_prefix + 'test-cluster500';
    client.set(key, JSON.stringify({
      cluster: {
        authToken:'test-cluster500auth',
        nodes:[{
          host:'127.0.0.1',
          port: 90000
        }]
      }
    }), function() {
      function handler(e, r, b) {
        should.strictEqual(e, null);
        should.strictEqual(r.statusCode, 500);
        client.del(key, done);
      }
      var opts = {
        url: host + ':' + port,
        headers: {
          Authorization: 'test-cluster500auth',
          "X-Cluster-Id": "test-cluster500"
        }
      };
      request(opts, handler);
    });
  });
});
