
/*
 * Left to do before posting again:
 *
 * Improve the right-col (more/better content, make it look more natural and fit in)
 * Clean up layout and sizing for mobile on image page
 * Fix up admin dashboard
 * Facebook share and twitter
 *
 */

var express    = require('express');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');

var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var expressSession = require('express-session');
var bCrypt         = require('bcrypt-nodejs');
var flash          = require('connect-flash');

var local_codes = require('./local_codes');
var initPassport = require('./server/passport/init');
var Image = require('./server/models/image');

var app = express();

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('client'));

// express session
app.use(expressSession({
  secret: 'mySecretKey',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session and displaying in templates
app.use(flash());

// Initialize Passport
initPassport(passport);

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


// ROUTE HANDLING FOR PASSPORT

// As with any middleware it is quintessential to call next() if the user is authenticated
var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
};

app.post('/login', passport.authenticate('login', {
    successRedirect: '/admin/dashboard/1/10',
    failureRedirect: '/',
    failureFlash : true
}));

app.get('/admin/login', function(req, res){
    res.sendFile(__dirname + '/client/views/adminLogin.html');
});

app.get('/admin/dashboard/:page/:perPage', isAuthenticated, function(req, res){
   
    // set default mins 
    var page    = Math.max(1, req.params.page);
    var perPage = Math.max(1, req.params.perPage);

    // get the correct images, depending on page and perpage
    Image.find({})
         .sort('-date')
         .limit(perPage)
         .skip(perPage * (page - 1))
         .exec(function(err, images){

             var params = {
                images: images,
                title: 'Gifmage Admin',
                layout: false,
                perPage: perPage,
                page: page
             };

             res.render('adminDashboard', params);
    });

});


// CLOSE EXPRESS

var sockets = [];
server.on('connection', function(socket){
    sockets.push(socket);
});
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
