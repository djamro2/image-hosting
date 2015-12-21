
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

// todo
//
// home page is mostly done, prevent user from uploading the same thing multiple times
    // probably just add a lock on the back end after x uploads under x minutes
// start working on image page
    // simply sendFile or render page (angular or express-handlebars)

// future ideas
//
// home page looks very clean but could use more content and screen size proofing
// still need to finalize monetization plan (find numbers on this)
// add more content, comments, accounts, account pages, more images, fix bugs during this
    // work slowly to monetize what I have, then continue building
// consider aws?
