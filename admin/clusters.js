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
      
    }
    function addClusterIdToUser(cb) {
      if (req.body.owner) {
        console.log(req.body.owner);
        client.lpushx(req.body.owner, id, function(error, index) {
          cb(index !== 0 ? null : new Error(req.body.owner + ' not found'));
        });
      } else {
        cb(new Error('No owner id provided'));
      }
    }
    async.series([addClusterIdToUser, addCluster], function(error) {
      if (error) {

      } else {

      }
    });
  },
  single: cluster
};

module.exports = clusters;
