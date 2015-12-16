
var HomeController  = require('./controllers/HomeController');
var ImageController = require('./controllers/ImageController');

module.exports = function(app){

    app.get('/', HomeController.getHomePage);

    // returns the image page (or image)
    app.get('/image/:id', ImageController.getImagePage);

    // return the image itself
    app.get('/api/image/:id', ImageController.getImage);

    // return last 4 images uploaded
    app.get('/api/recentImages', ImageController.getRecentImages);

    // upload the image file and some data with it
    app.post('/uploadImage', ImageController.uploadImage);

};
