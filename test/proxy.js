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
  it('should be a 401 for missing Authorization header with or without X-Cluster-Id', function(done) {
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
  it('should proxy a good request');
});
