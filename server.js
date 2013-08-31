var fs   = require('fs')
  , http = require('http')
  , pdp = require('./pdp')
  , PORT = 4000
  ;

http.createServer(function (req, res) {

  var upc = /^\/upc\/(\d{12})$/.exec(req.url);

  // Bad Request
  if (!upc || (upc.length !== 2) ) {

    res.writeHead(400, {'Content-Type': 'text/plain'});
    res.end('I only cache requests for valid UPCs at the URI /upc/:upcNumber');

  } else {

    upc = upc.pop();
    fs.exists('cache/'+upc+'.json', function(exists) {

      // Cached
      if (exists) {

        // Determine if cache is stale
        fs.stat('cache/'+upc+'.json', function (err, stats) {
          var mtime = (new Date(stats.mtime)).getTime();

          // Fresh
          if ( (Date.now() - mtime) < 1000*60*60*24 ) {
            fs.readFile('cache/' + upc + '.json', function (err, data) {
              if (err) {
                console.log('[ERROR] Could not read file!');
              } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data, 'utf-8');
                console.log('[INFO] Replied with cached reponse for UPC: ' + upc);
              }
            });

          // Stale
          } else {
            pdp.update(upc, function (data) {
              data.pipe(res);
              data.pipe(fs.createWriteStream('cache/' + upc + '.json'));
              // data.on('close', function () {
              //   console.log('[INFO] Updated cache for UPC: ' + upc);
              // });
              console.log('[INFO] Updated cache for UPC: ' + upc);
            });
          }
        });

      // Not Cached
      } else {
        pdp.update(upc, function (data) {
          data.pipe(res);
          data.pipe(fs.createWriteStream('cache/' + upc + '.json'));
          console.log('[INFO] Created cached response for UPC: ' + upc);
        });
      }
    });
  }
}).listen(PORT);

console.log('[INFO] Server started on port: ' + PORT);
