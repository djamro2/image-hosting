

var express    = require('express');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');

var app = express();

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/views/index.html');
});

var server = app.listen(8000, function () {
  var host = 'localhost';
  var port = server.address().port;
  console.log('Image hosting app listening at http://%s:%s', host, port);
});
