

var HomeController           = require('./controllers/HomeController');
var ImageController          = require('./controllers/ImageController');
var RecentViewsLogController = require('./controllers/RecentViewsLogController')

/*
 * Check to see if the current user has an authentication cookie
 */
var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
};

module.exports = function(app){

    ImageController.setApp(app);

    //static routes
    app.get('/', HomeController.getHomePage);
    app.get('/app/views/policy.html', HomeController.getPolicyPage);

    // returns the image page (or image)
    app.get('/:id', ImageController.getMediaPage);

    // retrieve raw media
    app.get('/api/media/:id', ImageController.getMedia);

    // return last 4 images uploaded
    app.get('/api/recentImages', ImageController.getRecentImages);

    // get the 4 most popular images
    app.get('/api/popularImages', ImageController.getPopularImages);

    // every image has a corresponding recent views log, return that single one
    app.get('/api/getRecentViewsLog/:id', RecentViewsLogController.getRecentLog);

    // set the current state of adAllowed to the opposite of the current state
    app.post('/api/allowAd/:id', ImageController.allowAd);

    // upload the image file and some data with it
    app.post('/uploadFile', ImageController.uploadFile);

    // delete content with that id
    app.delete('/api/delete/:id', isAuthenticated, ImageController.deleteFile);

};
