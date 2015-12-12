
var express    = require('express');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var multer     = require('multer');

var app        = express();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg') //Appending .jpg
  }
});

var upload = multer({ storage: storage });

app.use(express.static('client'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/views/index.html');
});

app.post('/uploadImage', upload.single('file'), function(req, res, next){

});

var server = app.listen(8000, function () {
  var host = 'localhost';
  var port = server.address().port;
  console.log('Image hosting app listening at http://%s:%s', host, port);
});
