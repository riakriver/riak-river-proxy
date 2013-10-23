var which = process.argv[2];

function startAdmin() {
  var admin = require(__dirname + '/admin');
  admin()();
}

function startProxy() {
  var proxy = require(__dirname + '/index');
  proxy()();
}

switch(which) {
  case 'all':
    startProxy();
    startAdmin();
    break;
  case 'admin':
    startAdmin();
    break;
  case 'proxy':
    startProxy();
    break;
  default:
    console.log("%s is not a vaild process", which);
}

