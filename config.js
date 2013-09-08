var key_prefix = 'riak-river-port-proxy-';

var config = {
  owner_prefix: key_prefix + 'owners-',
  cluster_prefix: key_prefix + 'cluster-',
  redis_opts: {
    port: process.env.REDIS_PORT || 6379,
    host: process.env.REDIS_HOST || '127.0.0.1'
  }
};

module.exports = config;
