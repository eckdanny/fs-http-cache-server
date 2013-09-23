var http = require('http')
    config = require('./config.js')
  ;

/**
 * Downloads the PDP from the original source
 * @param  {string}   upc UPC numeric string
 * @param  {function} cb  Callback function
 * @return {void}
 */
exports.update = function (upc, cb) {

  // Original Source
  var options = {
    hostname: config.hostname,
    path: config.path + '?in_upc=' + upc
  };

  // Request
  http.get(options, function (res) {
    if (res.statusCode === 200) {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'max-age=86400' });
      cb(res);
    }
  }).on('error', function (err) {
    console.log('[ERROR] ' + err.message);
  });

}
