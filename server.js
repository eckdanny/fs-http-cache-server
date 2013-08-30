var fs   = require('fs')
  , http = require('http')
  ;

http.createServer(function (req, res) {

  var upc = /^\/upc\/(\d{12})$/.exec(req.url);

  if (upc && upc.length === 2) {

    upc = upc.pop();

    fs.exists('cache/'+upc+'.json', function(exists) {

      if (exists) {
        fs.stat('cache/'+upc+'.json', function (err, stats) {

          // console.log('file last modified: ', stats.mtime);

          var mtime = (new Date(stats.mtime)).getTime();

          // Less than a day old
          if ( (Date.now() - mtime) < 1000*60*60*24 ) {

            fs.readFile('cache/'+upc+'.json', function (err, data) {
              if (err) {
                console.log('[ERROR] Could not read file!');
              } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data, 'utf-8');
              }
            });

          // The cached response is stale
          } else {

            console.log('Downloading a fresh copy!');

            var options = {
              hostname:'mobilebyod.shld.net',
              path: '/stb_dispatcher/service/rest/scantrybuy/getProductDetails?in_upc=' + upc
            };

            http.get(options, function (_res_) {

              if (_res_.statusCode === 200) {
                _res_.pipe(res);
                _res_.pipe(fs.createWriteStream('cache/'+upc+'.json'));
              }

            }).on('error', function (err) {
              console.log('[ERROR] ' + err.message);
            });

          }

        });

      } else {

        var options = {
          hostname:'mobilebyod.shld.net',
          path: '/stb_dispatcher/service/rest/scantrybuy/getProductDetails?in_upc=' + upc
        };

        http.get(options, function (_res_) {

          if (_res_.statusCode === 200) {
            _res_.pipe(res);
            _res_.pipe(fs.createWriteStream('cache/'+upc+'.json'));
          }

        }).on('error', function (err) {
          console.log('[ERROR] ' + err.message);
        });

      }
    });

  } else {
    res.writeHead(400, {'Content-Type': 'text/plain'});
    res.end('I only cache requests for requests like /upc/:upcNumber');
  }

}).listen(4000);