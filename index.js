var argo = require('argo');
var log = require('./log');

var proxyPort = 44332;

console.log("Exposed port: " + proxyPort);

argo()
  .use(log)
  .target('http://flock-test-patcon.ngrok.com')
  .listen(proxyPort);
