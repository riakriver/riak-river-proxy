var should = require('should');

describe('Lookup proxy location', function() {
  before(function(done) {
    process.env.RIAK_RIVER_PROXY_PORT = 8098;
    require(__dirname + '/../index')(function(){ done(); })();
  });
  it('should not proxy a bad request');
  it('should proxy a good request');
});
