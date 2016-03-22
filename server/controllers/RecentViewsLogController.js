/**
 * Created by djamr on 3/21/2016.
 */

var RecentLog = require('../models/viewsLog');

module.exports.getRecentLog = function(request, response) {

    var id = request.params.id;

    RecentLog.findOne({id: id}, function(error, result) {

        if (error || !result) {
            response.send('Error finding that log ' + error);
        } else {
            response.send(result);
        }

    });

};
