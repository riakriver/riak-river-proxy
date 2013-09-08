var crypto = require('crypto');

function generate(obj) {
  var hash = crypto.createHash('sha1');
  hash.update(JSON.stringify(obj) + new Date().toString());
  return hash.digest('hex');
}

module.exports = generate;
