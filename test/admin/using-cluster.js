var request = require('request');
var userid = 'blahblahtestuser123456789';
var port;

function usingCluster() {
  describe('adding a cluster through the admin api', function() {
    var clusterId;
    before(function(done) {
      console.log(port);
      done();
    });
    it('should show up in the cluster list');
    it('should return a 5xx error if the host is down');
    it('should be proxyable');
  });
  describe('deleting a cluster through the admin api', function() {
    it('should not be proxyable if removed through admin api');
  });
}

module.exports = function(p) {
  port = p;
  return usingCluster;
};
