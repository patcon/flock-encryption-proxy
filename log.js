var xpath = require('xpath');
//var DOMParser = require('xmldom').DOMParser;
var libxmljs = require("libxmljs");

module.exports = function(handle) {
  handle('response', function(env, next) {
    env.target.response.getBody(function(err, body) {
      if (!!body) {
        var xml = body.toString();
        console.log(xml);
        var xmlDoc = libxmljs.parseXml(xml);
        var responses = xmlDoc.find("//*[local-name()='response' and namespace-uri()='DAV:']");
        /*
         * responses.forEach(function(res) {
         *   console.log(libxmljs.parseXml(res.toString()).get('//href').text());
         *   console.log(res.toString());
         *   console.log('-------------------');
         * });
         */
      }
      next(env);
    });
  });
};

function xmlToJson(xml) {
  parseString(xml, function (err, result) {
    return result;
  });
}
