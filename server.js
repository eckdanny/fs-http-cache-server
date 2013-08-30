var fs   = require('fs')
  , path = require('path')
  , http = require('http')
  ;

var options = {
  hostname:'mobilebyod.shld.net',
  path: '/stb_dispatcher/service/rest/scantrybuy/getProductDetails?in_upc=884140284212'
};

http.get(options, function (res) {

  console.log(res.headers);

  console.log('Got response: ' + res.statusCode);

  if (res.statusCode === 200) {
    res.pipe(fs.createWriteStream('req.json'));
    res.pipe(fs.createWriteStream('foo.json'));
  }

  // res.setEncoding('utf8');
  // res.on('data', function (data) {
  //   console.log('I got some data:', data);
  // });

}).on('error', function (err) {
  console.log('[ERROR] ' + err.message);
});