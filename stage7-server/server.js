var fs = require('fs'),
    sys = require("sys"),
    http = require('http'),
    url = require('url');

function http404(response, message) {
  response.writeHead('404');
  response.end(message);
  console.log('404 - ' + message);
}

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

    response.writeHead(200, {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*", 
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"});

    data = JSON.parse(dataString);
    // extract the hashtag from the url http://{address}/{hahtag}
    args = url.parse(request.url).pathname.split('/');
    command = args[1];

    if (command === 'plans') {
      var userid = args[2];
      var user = data.users[userid];

      if (!user) {
        http404(response, 'No such user');
        return;
      } 

      var plans = [];
      for (var i = 0; i < user.plans.length; i++) {
         var hashtag = user.plans[i];
         // copy plan to plans
         plans.push(data.plans[hashtag]);
      }
      content = JSON.stringify(plans);
      console.log("accessed user - " + userid);

      // send the response to client
      response.end(content);
    }

    else {
      http404(response, 'URL not recognized');
    }

  });
}).listen(8080);
console.log("Server Running on 8080. Navigate to http://localhost:8080/plans/username to display plans");   
