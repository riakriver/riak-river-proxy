module.exports = {
  newCluster: {
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
  }
};
