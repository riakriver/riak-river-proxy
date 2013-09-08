  module.exports = {
    key_prefix: 'riak-river-port-proxy-',
    redis_opts: {
      port: process.env.REDIS_PORT || 6379,
      host: process.env.REDIS_HOST || '127.0.0.1'
    }
  };
