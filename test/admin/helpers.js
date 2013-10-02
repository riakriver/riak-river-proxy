var should = require('should');

module.exports = {
  newCluster: function(url){
    return new Object({
      url: url,
      method: 'POST',
      json: true,
      body: {
        cluster: {
          owner: '$4$k+GSA2XV$i6gMmHu2t6qvoVNa/HUDWhQ38sE$',
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
    });
  },
  checkCluster: function(res){
    var cluster = res.cluster;
    cluster.should.have.property('id');
    cluster.should.have.property('nodes');
    cluster.should.have.property('owner');
  }
};
