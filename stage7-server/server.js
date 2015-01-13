var fs = require('fs'),
    sys = require("sys"),
    http = require('http'),
    url = require('url');

http.createServer(function (request, response) {
  fs.readFile(__dirname + "/plans.json", function (err, dataString) {
    var args;
    var command;
    var data;
    var content;

    if (err) {
      sys.puts("404");
      response.writeHead(404);
      response.end(JSON.stringify(err));
      return;
    }

    data = JSON.parse(dataString);
    response.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*", 
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"});

    // extract the hashtag from the url http://{address}/{hahtag}
    args = url.parse(request.url).pathname.split('/');
    command = args[1];

    if (command === 'plan') {
      content = JSON.stringify(data[args[2]]);
      sys.puts("accessed " + args[2]);
    } 

    else if (command === 'keys') {
      content = JSON.stringify(Object.keys(data));
      sys.puts("accessed keys - " + content);
    }

    else {
      response.writeHead('404');
      response.end('URL not recognized');
    }

    // send the response to client
    response.end(content);
  });
}).listen(8080);
sys.puts("Server Running on 8080");   
