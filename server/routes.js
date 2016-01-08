
var HomeController  = require('./controllers/HomeController');
var ImageController = require('./controllers/ImageController');

module.exports = function(app){

    //static routes
    app.get('/', HomeController.getHomePage);
    app.get('/app/views/policy.html', HomeController.getPolicyPage);

    // returns the image page (or image)
    app.get('/image/:id', ImageController.getImagePage);

    // return the image itself
    app.get('/api/image/:id', ImageController.getImage);

    // return last 4 images uploaded
    app.get('/api/recentImages', ImageController.getRecentImages);

    // upload the image file and some data with it
    app.post('/uploadFile', ImageController.uploadFile);

};
