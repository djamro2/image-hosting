/**
 * Created by djamr on 3/21/2016.
 */

var moment    = require('moment');

var RecentLog = require('../models/viewsLog');

module.exports.getRecentLog = function(request, response) {

    var id = request.params.id;

    RecentLog.findOne({id: id}, function(error, recentLog) {

        if (error || !recentLog) {
            response.send('Error finding that log.');
        }

        var result = {
            recentLog: recentLog,
            labels: [],
            data: []
        };

        // create the corresponding hour indexes to show in the graph
        var hourIndexes = [];
        var currentHour = Number(moment(new Date()).format("H"));
        for (var i = 0; i < 12; i++) {
            if (currentHour < 0) {
                currentHour = 23;
            }
            hourIndexes.unshift(currentHour);
            currentHour--;
        }

        // create the 'labels' data set
        var timezoneOffset = 1; // /* for eastern time only right now */
        for (var i = 0; i < hourIndexes.length; i++) {

            var hour = String( ((hourIndexes[i]) % 12) + timezoneOffset);

            if (hour === "0") {
                hour = "12";
            }

            if (hourIndexes[i] > 11) {
                hour += "pm";
            } else {
                hour += "am";
            }

            result.labels.push(hour);
        }

        // build the correct data based off of hourIndexes
        var data = [];
        for (var i = 0; i < hourIndexes.length; i++) {
            result.data.push( recentLog.views[ hourIndexes[i] ] );
        }

        response.send(result);
    });

};
