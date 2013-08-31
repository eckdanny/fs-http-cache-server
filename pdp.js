var http = require('http');

/**
 * Downloads the PDP from the original source
 * @param  {string}   upc UPC numeric string
 * @param  {function} cb  Callback function
 * @return {void}
 */
exports.update = function (upc, cb) {

  // Original Source
  var options = {
    hostname:'mobilebyod.shld.net',
    path: '/stb_dispatcher/service/rest/scantrybuy/getProductDetails?in_upc=' + upc
  };

  // Go get it!
  http.get(options, function (res) {
    if (res.statusCode === 200) {
      cb(res);
    }
  }).on('error', function (err) {
    console.log('[ERROR] ' + err.message);
  });

}
