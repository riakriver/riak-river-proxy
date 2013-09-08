var request = require('request');
var should = require('should');
var async = require('async');
var helpers = require(__dirname + '/helpers');

describe('Admin api', function() {
  var host = '127.0.0.1';
  var url;
  before(function(done) {
    require(__dirname + '/../../admin')(function(port) {
     url = 'http://' + host + ':' + port;
     request({
       url:url + '/owners',
       method: 'POST',
       json: true,
       body: {
         owner: {
           id: '$4$k+GSA2XV$i6gMmHu2t6qvoVNa/HUDWhQ38sE$'
         }
       }
     }, function(e, r, b) {
       r.statusCode.should.be.equal(200);
       done();
     });
    })();
  });
  after(function(done) {
    request({
      url: url + '/owners/' + encodeURIComponent('$4$k+GSA2XV$i6gMmHu2t6qvoVNa/HUDWhQ38sE$'),
      method: 'DELETE'
    }, function(e, r, b) {
      r.statusCode.should.equal(200);
      done();
    });
  });
  it('should be able to create a cluster', function(done){
    request(helpers.newCluster(url + '/clusters'), function(e, r, b) {
      should.equal(e, null);
      r.statusCode.should.be.equal(200);
      b.cluster.should.have.property('id');
      b.cluster.nodes.should.have.property('length', 3);
      b.should.have.property('owner', '$4$k+GSA2XV$i6gMmHu2t6qvoVNa/HUDWhQ38sE$');
      done();
    });
  });
  it('should be able to list clusters', function(done){
    var clusters;
    function check(cb) {
      request({
        url: url + '/clusters',
        json: true
      }, function(e, r, b) {
        should.equal(e, null);
        r.statusCode.should.be.equal(200);
        b.should.have.property('clusters');
        b.clusters.should.have.property('length', 50);
        clusters = b.clusters;
        console.log(clusters);
        cb();
      });
    }
    function addTestData(cb) {
      var count = 0;
      async.whilst(
        function() { return count < 49; },
        function(callback) {
          var c = helpers.newCluster(url + '/clusters');
          c.body.cluster.count = count++;
          request(c, callback);
        },
        cb
      );
    }
    function rmTestData(cb) {
      async.each(clusters, function(cluster, cb) {
        request({
          url: url + '/clusters/' + encodeURIComponent(cluster.id),
          method: 'DELETE'
        }, cb);
      }, cb);
    }
    async.series([addTestData, check, rmTestData], done);
  });
  it('should be able to list a cluster');
  it('should be able to delete a cluster');
  describe('editing a particular cluster', function() {
    it('should be able to update the auth key');
    describe('editing ssl https properties', function() {
      it('should be able to toggle the https flag');
      it('should be able to change key');
      it('should be able to change cert');
    });
    describe('editing nodes in a cluster', function() {
      it('should be able to add a node in the cluster');
      it('should be able to delete a node in the cluster');
      describe('editing node', function() {
        it('should be able to update the host');
        it('should be able to update the port');
      });
    });
    describe('load balancing', function() {
      it('should be able to change the load balancing algorithm');
      it('should test the load balancing algorithms');
    });
  });
});
