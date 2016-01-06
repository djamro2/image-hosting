
var express    = require('express');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');

var app = express();
var local_codes = require('./local_codes');

// middleware
app.use(express.static('client'));

// handlebars engine
app.engine('handlebars', handlebars({defaultLayout: 'main'}) );
app.set('view engine', 'handlebars');

// routing - needs to be after middleware
require('./server/routes')(app);

var isProduction = process.env.NODE_ENV || false;

if (!isProduction) { 

    var server = app.listen(3000, function () {
      var host = 'localhost';
      var port = server.address().port;
      console.log('Image hosting app listening at http://%s:%s', host, port);
    });

} else if (isProduction === 'production') { 

    var server = app.listen(local_codes.port, local_codes.internal_ip, function () {
      var host = server.address().address;
      var port = server.address().port;
      console.log('Image hosting app listening at http://%s:%s', host, port);
    });

}

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

process.on('uncaughtException', function(err){
    console.log(err);
    console.log("Node caught an exception, not shutting down");
});
