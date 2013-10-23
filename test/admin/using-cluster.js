var request = require('request');
var userid = 'blahblahtestuser123456789';
var portfinder = require('portfinder');
var async = require('async');
var should = require('should');
var adminPort;

function usingCluster() {
  var fakeServer;
  var cluster;
  var adminURI = 'http://127.0.0.1:' + adminPort;
  describe('adding a cluster through the admin api', function() {
    before(function(done) {
      function startFakeServer(cb) {
        var http = require('http');
        portfinder.getPort(function(err, port) {
          fakeServer = {
            handle: http.createServer(function(req, res){
              res.writeHead(200, {server: 'test-server-handler-' + port});
              res.end();
            }),
            port: port
          };
          fakeServer.handle.listen(port, cb);
        });
      }

      function addTestCluster(cb) {
        request.post({
          url: adminURI + '/owners',
          json: true,
          body: {
            owner: {
              id: userid
            }
          }
        }, function(e,r,b) {
          request.post({
            url: adminURI + '/clusters',
            json: true,
            body: {
              cluster: {
                owner: userid,
                nodes: [{
                  host: '127.0.0.1',
                  port: fakeServer.port
                }]
              }
            }
          }, function(e,r,b) {
            cluster = b.cluster;
            cb();
          });
        });
      }
      async.parallel([startFakeServer, addTestCluster], done);
    });
    it('should show up in the cluster list', function(done){
      request({
        url: adminURI + '/clusters/' + encodeURIComponent(cluster.id),
        json: true
      }, function(e,r,b) {
        r.statusCode.should.be.equal(200);
        JSON.stringify(b.cluster).should.be.equal(JSON.stringify(cluster));
        done();
      });
    });
    it('should return a 5xx error if the host is down');
    it('should be proxyable');
  });
  describe('deleting a cluster through the admin api', function() {
    it('should not be proxyable if removed through admin api');
  });
}

module.exports = function(p) {
  adminPort = p;
  return usingCluster;
};
