var redis = require('redis');
var async = require('async');
var redis_opts = require(__dirname + '/../config');
var idGen = require(__dirname + '/id_generator');

function getRedisClient() {
  return redis.createClient(redis_opts.port, redis_opts.host);
}

var cluster = {
  list: function(req, res) {

  },
  delete: function(req, res) {

  },
  update: function(req, res) {

  }
};

var clusters = {
  list: function(req, res) {

  },
  create: function(req, res) {
    var client = getRedisClient();
    var id = idGen(req.body.cluster);
    function addCluster(cb) {
      req.body.cluster.id = id;
      client.set(id, JSON.stringify(req.body.cluster), function(err, status) {
        cb();
      });
    }
    function addClusterIdToUser(cb) {
      if (req.body.owner) {
        client.sadd(req.body.owner, id, function(error, index) {
          cb(index !== 0 ? null : {message: id + ' already exists in ' + req.body.owner});
        });
      } else {
        cb(new Error('No owner id provided'));
      }
    }
    async.series([addClusterIdToUser, addCluster], function(error) {
      res.send(error ? 404:200, error || req.body);
    });
  },
  single: cluster
};

module.exports = clusters;
