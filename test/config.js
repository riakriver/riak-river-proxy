var should = require('should');

describe('configuration options', function() {
  var args = {};
  before(function(done) {
    process.env.RIAK_RIVER_PROXY_PORT = 10101;
    require(__dirname + '/../index')(function(port, redis_opts) {
      args.port = port;
      args.redis_opts = redis_opts;
      done();
    });
  });
  it('should start on the desired port', function() {
    args.port.should.be.equal('10101');
  });
  it('should use the correct redis credentials', function() {
    args.redis_opts.port.should.be.equal(6379);
    args.redis_opts.host.should.be.equal('127.0.0.1');
  });
});
