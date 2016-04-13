import http from 'http';
import httpProxy from 'http-proxy';
import url from 'url';
import crypto from 'crypto';

let proxy = httpProxy.createProxyServer({});

let server = http.createServer(function(req, res) {

  let parsedUrl = url.parse(req.url, true);

  /**
   * We want to proxy our requests to Marvel's API,
   * but we need to add our API key as a querystring parameter.
   *
   * 1. Add your API key to parsedUrl.query by adding a
   *    property called apikey to it.
   *
   * 2. Set parsedUrl.search to null. We want to make sure it
   *    uses our querystring params, and if search is set, it
   *    will ignore them.
   *
   * 3. Marvel requires a number of additional fields from us
   *    when making requests from a server. First, add a property
   *    ts to parsedUrl.query. Set it to something that changes every
   *    request, like the current date converted to an epoch timestamp.
   *    Google that. Save this value to a variable!
   *
   * 4. We need to build a hash for the Marvel API that combines our
   *    ts, our private key and our public key. There's a variable
   *    below called data that's set to an empty string. Instead, set it
   *    to the value of ts plus your private key plus your public key.
   *    ORDER IS SUPER IMPORTANT! ADD THE STRINGS TOGETHER IN THAT ORDER!
   *
   * 5. Below where data is set, we're converting it into an MD5 hash. I've
   *    provided this code. hash now contains the value you want to send in
   *    your querystring. Add hash as a property to parsedUrl.query
   *
   * 6. Set req.url to url.format(parsedUrl)
   *
   *    This is how we apply the changes we made
   *
   * 4. You should be able to run npm run marvel and visit localhost:8000
   *    in your browser. At /v1/public/characters?name=Falcon you should
   *    see data for Falcon.s
   */

   parsedUrl.query.apikey = "0fd87f40d6dd1419e4153fe1a1c9cf04";
   // make ts
   let ts = +new Date();
   // set ts on parsedUrl
   parsedUrl.query.ts = ts;
   // fill in data
   let data = ts + "ea79758e117ccbcb31838b7a6401ee5a8be932900fd87f40d6dd1419e4153fe1a1c9cf04";
   let hash = crypto.createHash('md5').update(data).digest("hex");
   // set hash on parsedUrl
   parsedUrl.query.hash = hash;

   parsedUrl.search = null;
   req.url = url.format(parsedUrl);

   proxy.web(req, res, {
     target: 'http://gateway.marvel.com:80'
   });

});

server.listen(8000);
