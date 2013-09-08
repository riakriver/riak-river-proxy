var redis = require('redis');
var redis_opts = require(__dirname + '/../config');
var async = require('async');

function getRedisClient() {
  return redis.createClient(redis_opts.port, redis_opts.host);
}

var owners = {
  create: function(req, res) {
    var client = getRedisClient();
    function exists(cb) {
      client.exists(req.body.owner.id, function(err, status) {
        cb(status === 0 ? null : {
          statusCode: 409,
          message: req.body.owner.id + ' already exists.'
        });
      });
    }
    function touch(cb) {
      client.set(req.body.owner.id, JSON.stringify([]), function(err, status) {
        cb();
      });
    }
    if (req.body.owner && req.body.owner.id) {
      async.series([exists, touch], function(err) {
        if (err) {
          res.send(err.statusCode || 400, {error: err.message});
        } else {
          res.send(200);
        }
      });
    } else {
      res.send(404, {error: 'Owner id missing'});
    }
  },
  delete: function(req, res) {
    var client = getRedisClient();
    client.del(req.params.id, function(err, status) {
      console.log(err, status);
      res.send(200);
    });
  }
};

module.exports = owners;
