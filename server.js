var fs   = require('fs')
  , path = require('path')
  , http = require('http')
  ;

var options = {
  host: 'www.google.com',
  port: 80,
  method: 'GET',
  path: '/index.html'
};

http.get(options, function (res) {

  console.log('Got response: ' + res.statusCode);

  if (res.statusCode === 200) {
    res.pipe(fs.createWriteStream('req.json'));
  }

  // res.setEncoding('utf8');
  // res.on('data', function (data) {
  //   console.log('I got some data:', data);
  // });

}).on('error', function (err) {
  console.log('[ERROR] ' + err.message);
});