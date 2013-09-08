var request = require('request');
var should = require('should');

describe('Admin api', function() {
  var host = '127.0.0.1';
  var url;
  before(function(done) {
    require(__dirname + '/../../admin')(function(port) {
     url = 'http://' + host + ':' + port;
     done();
    })();
  });
  it('should be able to create a cluster', function(done){
    request({
      url: url + '/clusters',
      method: 'POST',
      json: true,
      body: {
        owner: '$4$k+GSA2XV$i6gMmHu2t6qvoVNa/HUDWhQ38sE$',
        cluster: {
          nodes: [{
            host: 'riak.wlaurance.com',
            port: 8098
          }, {
            host: 'basho.wlaurance.com',
            port: 8098
          }, {
            host: 'krumm.wlaurance.com',
            port: 8098
          }]
        }
      }
    }, function(e, r, b) {
      should.equal(e, null);
      r.statusCode.should.be.equal(200);
      b.cluster.should.have.property('id');
      b.cluster.should.have.property('owner', '$4$k+GSA2XV$i6gMmHu2t6qvoVNa/HUDWhQ38sE$');
      done();
    });
  });
  it('should be able to list clusters');
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
