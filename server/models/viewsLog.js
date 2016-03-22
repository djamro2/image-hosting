/**
 * Created by djamr on 3/21/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*
 * Schema for the recent log is circular in nature. Keeps track of each count of views in the last
 * 24 hours. The start of each hour is a new period for views to become counted. Since there will
 * always be 24 hours, there are 24 slots for views, and 24 slots for the date. They match up.
 * If the relevant date slot if from yesterday, start the views count over again.
 */

var recentLogSchema = new Schema({
    id: String,
    views: [Number],
    date: [Date]
});

module.exports = mongoose.model('RecentLog', recentLogSchema);
