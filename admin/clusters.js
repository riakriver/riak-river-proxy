var redis = require('redis');
var async = require('async');
var redis_opts = require(__dirname + '/../config').redis_opts;
var cluster_prefix = require(__dirname + '/../config').cluster_prefix;
var owner_prefix = require(__dirname + '/../config').owner_prefix;
var idGen = require(__dirname + '/id_generator');

function getRedisClient() {
  return redis.createClient(redis_opts.port, redis_opts.host);
}

var cluster = {
  list: function(req, res) {

  },
  delete: function(req, res) {
    var client = getRedisClient();
    client.del(cluster_prefix + req.params.id, function(err, status) {
      res.send(status ? 200 : 404);
    });
  },
  update: function(req, res) {

  }
};

var clusters = {
  list: function(req, res) {
    var client = getRedisClient();
    var results = [];
    function transform(key, callback) {
      client.get(key, function(err, reply) {
        results.push(JSON.parse(reply));
        callback();
      });
    }
    client.keys(cluster_prefix + '*', function(err, reply) {
      async.each(reply, transform, function(err) {
        res.send({clusters: results});
      });
    });
  },
  create: function(req, res) {
    var client = getRedisClient();
    var id = idGen(req.body.cluster);
    function addCluster(cb) {
      req.body.cluster.id = id;
      client.set(cluster_prefix + id, JSON.stringify(req.body.cluster), function(err, status) {
        cb();
      });
    }
    function addClusterIdToUser(cb) {
      if (req.body.owner) {
        client.sadd(owner_prefix + req.body.owner, id, function(error, index) {
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
