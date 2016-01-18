
var multiparty   = require('multiparty');
var fs           = require('fs');
var randomstring = require('randomstring');
var mongoose     = require('mongoose');
var Grid         = require('gridfs-stream');
var moment       = require('moment');
var ffmpeg = require('fluent-ffmpeg');

var Image        = require('../models/image');
var utils        = require('../utils');
var local_codes  = require('../../local_codes');

var main = this;
var Schema = mongoose.Schema;
var conn = mongoose.connection;

// connect to mongoose
mongoose.connect('mongodb://127.0.0.1/imageHosting');

Grid.mongo = mongoose.mongo;
var gfs = Grid(conn.db);

// set the app globally
module.exports.setApp = function(app) {
    main.app = app;
};

// take a file and save to db, and save schema info as well (/uploadFile)
module.exports.uploadFile = function(req, res, next){

    var form = new multiparty.Form();

    form.parse(req, function(err, fields, files){

        var file = files.file[0];
        var contentType = file.headers['content-type'];
        var tmpPath = file.path;
        var extIndex = tmpPath.lastIndexOf('.');
        var extension = (extIndex < 0) ? '' : tmpPath.substr(extIndex);

        // TODO: make sure this isn't the same as something else
        var id = randomstring.generate(8) + extension;

        // tested files that work, add more that work
        var confirmedFileArray = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'video/webm' ];

        // if we don't have this file type confirmed as working, return error
        if (confirmedFileArray.indexOf(contentType) === -1) {
            fs.unlink(tmpPath);
            return res.status(400).send('Unsupported file type.');
        }

        // streaming to gridfs
        var writestream = gfs.createWriteStream({
            filename: id
        });
        fs.createReadStream(tmpPath).pipe(writestream);

        writestream.on('close', function (file) {

            main.getMediaInfo(fields, contentType, tmpPath, function(info){

                //TODO: change names (like model) here and put more logic in getMediaInfo

                var mediaObject = {
                    id: id,
                    title: ((fields.title && fields.title[0]) || ""),
                    isNsfw: ((fields.nsfw && fields.nsfw[0]) || false),
                    size: files.file[0].size,    //in bytes
                    width: info.width,
                    height: info.height,
                    fileType: extension.substr(1).toUpperCase()
                };

                var image = new Image(mediaObject);

                image.save(function(error, result){
                    if (!error)
                        res.send(result); //TODO: do I need this?
                    else {
                        res.status(500).send('Error uploading media object');
                    }
                });

                console.log(file.filename + ' Written To DB');

            });

        });

    });

};

// return the image file (/api/media/:id)
module.exports.getMedia = function(req, res){

    var id = req.params.id;

    gfs.findOne({ filename: id}, function(err, file){

        if (err) return res.status(400).send(err);
        if (!file) return res.status(404).send('');

        var extension = id.split('.')[1];

        if (extension === 'webm') {
            res.set('Content-Type', 'video/' + extension);
        } else {
            res.set('Content-Type', 'image/' + extension);
        }

        var readstream = gfs.createReadStream({
            filename: id
        });

        readstream.on("error", function(err) {
            console.log("Got error while processing stream " + err.message);
            res.end();
        });

        // increment only if not from my own web page
        var refer = req.get('Referer');
        if ((!refer && extension !== 'webm') || ( (refer && refer.indexOf('newarithmetic')) == -1 && (refer && refer.indexOf('localhost') == -1))){
            utils.incrementEmbededViews(id);
        }

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

// get the 4 more popular images
module.exports.getPopularImages = function(req, res){

    Image.aggregate()
          .project({
               "viewsEmbeded": 1,
               "viewsWebsite": 1,
               "id": 1,
               "title": 1,
               "isNsfw": 1,
               "size": 1,
               "width": 1,
               "height": 1,
               "fileType": 1,
               "date": 1,
               "totalViews": { "$add": [ "$viewsEmbeded", "$viewsWebsite" ] }
          })
          .sort("-totalViews")
          .limit(4)
          .exec(function (err, result) {
              res.send(result);
          });
};

// depending on header, return plain image or html page
module.exports.getMediaPage = function(req, res) {

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

            if (extension === 'webm') {
                res.set('Content-Type', 'video/' + extension);
            } else {
                res.set('Content-Type', 'image/' + extension);
            }

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

//return the correct metadata about media object, for now just width and height
main.getMediaInfo = function(fields, contentType, tmpPath, callback) {

    var result = {
        width: 0,
        height: 0
    }

    if (fields.width && contentType !== 'video/webm') {
        result.width = fields.width[0];
    }

    if (fields.height && contentType !== 'video/webm') {
        result.height = fields.height[0];
    }

    //TODO: use node-fluent-ffmpeg to get video metadata
    if (contentType === 'video/webm') {

        if (process.platform === 'win32'){
            ffmpeg.setFfprobePath("c:\\xampp\\ffmpeg\\bin\\ffprobe.exe");
        }

        ffmpeg.ffprobe(tmpPath, function(err, metadata) {

            if (err) {
                console.log(err);
                return;
            }

            result.width = metadata.streams[0].width;
            result.height = metadata.streams[0].height;

            callback(result);
        });

    } else {

        callback(result);

    }

};
