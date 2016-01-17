
var HomeController  = require('./controllers/HomeController');
var ImageController = require('./controllers/ImageController');

module.exports = function(app){

    ImageController.setApp(app);

    //static routes
    app.get('/', HomeController.getHomePage);
    app.get('/app/views/policy.html', HomeController.getPolicyPage);

    // returns the image page (or image)
    app.get('/:id', ImageController.getMediaPage);

    // other sorts of media (like webm)
    app.get('/api/media/:id', ImageController.getMedia);

    // return last 4 images uploaded
    app.get('/api/recentImages', ImageController.getRecentImages);

    // get the 4 most popular images
    app.get('/api/popularImages', ImageController.getPopularImages);

    // upload the image file and some data with it
    app.post('/uploadFile', ImageController.uploadFile);

};
