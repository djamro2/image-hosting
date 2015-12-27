
var express    = require('express');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');

var app = express();

// middleware
app.use(express.static('client'));

// handlebars engine
app.engine('handlebars', handlebars({defaultLayout: 'main'}) );
app.set('view engine', 'handlebars');

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
