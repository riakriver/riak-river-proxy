var request = require('request');
var should = require('should');
var async = require('async');
var _ = require('underscore');
var helpers = require(__dirname + '/helpers');

describe('Admin api', function() {
  var host = '127.0.0.1';
  var url;
  var owner = {
    id: '$4$k+GSA2XV$i6gMmHu2t6qvoVNa/HUDWhQ38sE$'
  };
  before(function(done) {
    require(__dirname + '/../../admin')(function(port) {
     url = 'http://' + host + ':' + port;
     request({
       url:url + '/owners',
       method: 'POST',
       json: true,
       body: {
         owner: owner
       }
     }, function(e, r, b) {
       r.statusCode.should.be.equal(200);
       done();
     });
    })();
  });
  after(function(done) {
    request({
      url: url + '/owners/' + encodeURIComponent(owner.id),
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
      helpers.checkCluster(b);
      b.cluster.nodes.should.have.property('length', 3);
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
        b.clusters.length.should.be.above(49);
        clusters = b.clusters;
        _.each(clusters, helpers.checkCluster);
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
      async.each(clusters, function(entry, cb) {
        var cluster = entry.cluster;
        request({
          url: url + '/clusters/' + encodeURIComponent(cluster.id),
          method: 'DELETE'
        }, cb);
      }, cb);
    }
    async.series([addTestData, check, rmTestData], done);
  });
  it('should be able to list a cluster', function(done){
    var cluster = helpers.newCluster(url + '/clusters');
    cluster.body.cluster.count = 1000;
    request(cluster, function(e,r,b){
      helpers.checkCluster(b);
      request({
        url: url + '/clusters/' + encodeURIComponent(b.cluster.id),
        json:true
      }, function(e,r,b){
        r.statusCode.should.be.equal(200);
        helpers.checkCluster(b);
        done();
      });
    });
  });
  it('should be able to delete a cluster', function(done){
    var cluster = helpers.newCluster(url + '/clusters');
    cluster.body.cluster.count = 2000;
    request(cluster, function(e,r,b){
      var oneCluster = b.cluster;
      request({
        url: url + '/clusters/' + encodeURIComponent(oneCluster.id),
        method: 'DELETE'
      }, function(e,r,b){
        r.statusCode.should.be.equal(200);
        request({
          url: url + '/clusters/' + encodeURIComponent(oneCluster.id),
          json:true
        }, function(e,r,b){
          r.statusCode.should.be.equal(404);
          done();
        });
      });
    });
  });
  describe('editing a particular cluster', require(__dirname + '/editing-cluster'));
});
