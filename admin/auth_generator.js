var crypto = require('crypto');
var uuid = require('uuid');

function generate(str) {
  var hash = crypto.createHash('sha256');
  hash.update(str + uuid.v1() + new Date());
  return hash.digest('hex');
}

module.exports = generate;
