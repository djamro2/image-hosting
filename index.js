
var express    = require('express');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var multiparty = require('multiparty');
var Grid       = require('gridfs-stream');
var fs         = require('fs');

var app = express();

var Schema = mongoose.Schema;
var conn   = mongoose.connection;
mongoose.connect('mongodb://127.0.0.1/imageHosting');
Grid.mongo = mongoose.mongo;

app.use(express.static('client'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/client/views/index.html');
});

app.post('/uploadImage', function(req, res, next){

    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files){

        var gfs = Grid(conn.db);

        var file = files.file[0];
        var contentType = file.headers['content-type'];
        var tmpPath = file.path;
        var extIndex = tmpPath.lastIndexOf('.');
        var extension = (extIndex < 0) ? '' : tmpPath.substr(extIndex);

        // uuid is for generating unique filenames.
        var fileName = 'someImageFile' + extension;
        var destPath = 'C:\\Users\\Daniel\\Desktop\\workspace\\image-hosting\\uploads\\' + fileName;

        // Server side file type checker.
        if (contentType !== 'image/png' && contentType !== 'image/jpeg') {
            fs.unlink(tmpPath);
            return res.status(400).send('Unsupported file type.');
        }

        // streaming to gridfs
        var writestream = gfs.createWriteStream({
            filename: fileName
        });
        fs.createReadStream(tmpPath).pipe(writestream);

        writestream.on('close', function (file) {
            // do something with `file`
            console.log(file.filename + ' Written To DB');
            res.send('Sample return');
        });
    });

});

var server = app.listen(8000, function () {
  var host = 'localhost';
  var port = server.address().port;
  console.log('Image hosting app listening at http://%s:%s', host, port);
});
