var fs = require('fs'),
    sys = require("sys"),
    http = require('http');

http.createServer(function (request, response) {
  fs.readFile(__dirname + "/plans.json", function (err, data) {
    if (err) {
      sys.puts("404");
      response.writeHead(404);
      response.end(JSON.stringify(err));
      return;
    }
    response.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*", 
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"});
    response.end(data);
    sys.puts("accessed");
  });
}).listen(8080);
sys.puts("Server Running on 8080");   
