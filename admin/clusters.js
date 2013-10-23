var redis = require('redis');
var async = require('async');
var redis_opts = require(__dirname + '/../config').redis_opts;
var cluster_prefix = require(__dirname + '/../config').cluster_prefix;
var owner_prefix = require(__dirname + '/../config').owner_prefix;
var idGen = require(__dirname + '/id_generator');
var authGen = require(__dirname + '/auth_generator');

function getRedisClient() {
  return redis.createClient(redis_opts.port, redis_opts.host);
}

var cluster = {
  list: function(req, res) {
    var client = getRedisClient();
    client.get(cluster_prefix + req.params.id, function(err, reply){
      res.send(reply ? 200 : 404, JSON.parse(reply));
    });
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
    var authToken = authGen(id);
    function addCluster(cb) {
      req.body.cluster.id = id;
      req.body.cluster.authToken = authToken;
      client.set(cluster_prefix + id, JSON.stringify(req.body), function(err, status) {
        cb();
      });
    }
    function addClusterIdToUser(cb) {
      if (req.body.cluster.owner) {
        client.sadd(owner_prefix + req.body.cluster.owner, id, function(error, index) {
          cb(index !== 0 ? null : {message: id + ' already exists in ' + req.body.cluster.owner});
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
