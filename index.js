var argo = require('argo');
var log = require('./log');

argo()
  .use(log)
  .target('http://flock-test-patcon.ngrok.com')
  .listen(44332);
