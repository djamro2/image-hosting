
var moment = require('moment');

var Image     = require('./models/image');
var RecentLog = require('./models/viewsLog')
var main      = this;

/*
 * Take the id of image (which serves as the id of the log) and update the log
 * Increments current hour count or creates a new slot (which may delete old stuff)
 */
main.updateRecentViewsLog = function(id) {

    RecentLog.findOne( {id: id}, function(error, recentLog) {

        if (error || !recentLog) {
            console.log("Couldn't find this recent log: " + error);
            return;
        }

        // get the current hour, current date of the month
        var todaysDate  = new Date();
        var currentHour = Number(moment(todaysDate).format("H"));
        var currentDate = Number(moment(todaysDate).format("D"));

        // reset views to 0 if needed
        var correspondingDate = Number(moment( new Date ( recentLog.date[currentHour] ) ).format("D"));
        if (correspondingDate !== currentDate) {
            recentLog.views[currentHour] = 0;
        }

        // increment the corresponding views, update the latest date
        recentLog.views[currentHour] = recentLog.views[currentHour] + 1;
        recentLog.date[currentHour] = todaysDate;

        // mark modified so mongoose knows to check contents of the array
        recentLog.markModified('date');
        recentLog.markModified('views');
        recentLog.save();

    });

};

/*
 * Creates a new entry of a recent log for this particular image
 */
module.exports.createNewRecentLog = function(id) {

    // the new data to be passed into the RecentLog constructor
    var newData = {
        id: id,
        date: [],
        views: []
    };

    // create a entry for each time of the day
    for (var i = 0; i < 24; i++) {
        newData.views.push(0);
        newData.date.push(new Date());
    }

    // save the new data
    var recentLog = new RecentLog(newData);
    recentLog.save();

};

// increment num of embeded views of native/embeded image, given the id
module.exports.incrementEmbededViews = function(id){

    Image.findOne({id: id}, function(error, image){

        if (error) {
            console.log("Error on finding image " + error);
            return;
        } else if (!image) {
            console.log("No image found");
            return;
        }

        // update the last 12 hrs log for this image
        main.updateRecentViewsLog(id);

        image.viewsEmbeded = image.viewsEmbeded + 1;
        image.save();
    });
};

// increment num of embeded views of website page, given the id
module.exports.incrementWebsiteViews = function(id){

    Image.findOne({id: id}, function(error, image){

        if (error) {
            console.log("Error on finding image " + error);
            return;
        } else if (!image) {
            console.log("No image found");
            return;
        }

        // update the last 12 hrs log for this image
        main.updateRecentViewsLog(id);

        image.viewsWebsite = image.viewsWebsite + 1;
        image.save();
    });
};
