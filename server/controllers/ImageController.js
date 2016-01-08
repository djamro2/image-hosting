
var multiparty   = require('multiparty');
var fs           = require('fs');
var randomstring = require('randomstring');
var mongoose     = require('mongoose');
var Grid         = require('gridfs-stream');
var moment       = require('moment');

var Image        = require('../models/image');
var utils        = require('../utils');
var local_codes  = require('../../local_codes');

var main = this;
var Schema = mongoose.Schema;
var conn = mongoose.connection;

// connect to mongoose
if (process.env.NODE_ENV === 'production') {
    var connectionString = 'mongodb://' + local_codes.internal_ip + ':' + local_codes.data_port + '/imageHosting';
    mongoose.connect(connectionString);
} else {
    mongoose.connect('mongodb://127.0.0.1/imageHosting');
}

Grid.mongo = mongoose.mongo;
var gfs = Grid(conn.db);

// take a file and save to db, and save schema info as well (/uploadFile)
module.exports.uploadFile = function(req, res, next){

    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files){

        var file = files.file[0];
        var contentType = file.headers['content-type'];
        var tmpPath = file.path;
        var extIndex = tmpPath.lastIndexOf('.');
        var extension = (extIndex < 0) ? '' : tmpPath.substr(extIndex);

        // todo - make sure this isn't the same as something else
        var id = randomstring.generate(8) + extension;

        // tested images that work, add more that work
        var confirmedImageArray = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif' ];

        // decide actions based on file type
        if (confirmedImageArray.indexOf(contentType) > -1) {
            main.uploadImage(file, files, fields, tmpPath, extension, id, res);
        } else if (contentType.indexOf('gifv') > -1) {
            main.uploadGifv(res);
        } else {
            fs.unlink(tmpPath);
            return res.status(400).send('Unsupported file type.');
        }
    });

};

// return the image file (/api/images/:id)
module.exports.getImage = function(req, res){

    var id = req.params.id;

    gfs.findOne({ filename: id}, function(err, file){
        if (err) return res.status(400).send(err);
        if (!file) return res.status(404).send('');

        var extension = id.split('.')[1];

        res.set('Content-Type', 'image/' + extension);

        var readstream = gfs.createReadStream({
            filename: id
        });

        readstream.on("error", function(err) {
            console.log("Got error while processing stream " + err.message);
            res.end();
        });

        // increment only if not from my own web page
        var refer = req.get('Referer');
        if (!refer || (refer.indexOf('newarithmetic') == -1 && refer.indexOf('localhost') == -1))
            utils.incrementEmbededViews(id);

        readstream.pipe(res);
    });
};

// for now return the last 4 image data, maybe use param field in the future
module.exports.getRecentImages = function(req, res){

    Image.find({})
         .sort('-date')
         .limit(4)
         .exec(function(err, result){
             res.send(result);
    });
};

// depending on header, return plain image or html page
module.exports.getImagePage = function(req, res) {

    var id = req.params.id;

    // figure out where certain request are coming from: (TEMP)
    if (!req.get('Accept')){
        console.log('null accept params referer: ' + req.get('Referer'));
    }
    if (req.get('Accept') === '*/*'){
        console.log('accept all params referer: ' + req.get('Referer'));
    }

    // from the webpage
    if (req.get('Accept') && req.get('Accept').indexOf('text/html') > -1) {

        Image.findOne({ id: id }, function(error, image){
            utils.incrementWebsiteViews(id);
            res.render('imagePage', image);
        });

    // natively, embeded
    } else {

        gfs.findOne({ filename: id}, function(err, file){
            if (err) return res.status(400).send(err);
            if (!file) return res.status(404).send('');

            var extension = id.split('.')[1];

            res.set('Content-Type', 'image/' + extension);

            var readstream = gfs.createReadStream({
                filename: id
            });

            readstream.on("error", function(err) {
                console.log("Got error while processing stream " + err.message);
                res.end();
            });

            utils.incrementEmbededViews(id);

            readstream.pipe(res);
        });
    }

};

main.uploadImage = function(file, files, fields, tmpPath, extension, id, res) {

    // streaming to gridfs
    var writestream = gfs.createWriteStream({
        filename: id
    });
    fs.createReadStream(tmpPath).pipe(writestream);

    writestream.on('close', function (file) {

        var imageObject = {
            id: id,
            title: ((fields.title && fields.title[0]) || ""),
            isNsfw: ((fields.nsfw && fields.nsfw[0]) || false),
            size: files.file[0].size,    //in bytes
            width: fields.width[0] || 0,
            height: fields.height[0] || 0,
            fileType: extension.substr(1).toUpperCase()
        };

        var image = new Image(imageObject);

        image.save(function(error, result){
            if (!error)
                res.send(result);
            else {
                res.status(500).send('Error uploading image');
            }
        });

        console.log(file.filename + ' Written To DB');

    });
};

// TODO
main.uploadGifv = function(res) {

};
