
var express    = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(express.static('client'));

// routing - needs to be after middleware
require('./server/routes')(app);

var server = app.listen(3000, function () {
  var host = 'localhost';
  var port = server.address().port;
  console.log('Image hosting app listening at http://%s:%s', host, port);
});

var sockets = [];
server.on('connection', function(socket){
    sockets.push(socket);
})

var shutDownApp = function() {

    sockets.forEach(function(socket) {
        socket.destroy();
    });

    server.close(function(){
        console.log("Express connection closed");
        process.exit();
    });

    setTimeout( function () {
        console.error("Could not close connections in time, forcefully shutting down");
        process.exit(1);
    }, 20*1000);
};

process.stdin.resume(); //so program doesn't close instantly
process.on('SIGINT', shutDownApp);
process.on('exit', shutDownApp);
//process.on('uncaughtException', shutDownApp);

// todo
//
// add extra fields to image data -> size(in MB), width, height
// incrememnt native views in api/image/:id route
// casually work through current code, error proof and improve
// add some styling improvement to current home page, add title to image
// start working on image page
