
var mongoose = require('mongoose');

module.exports = mongoose.model('Image', {
	id: String,
    title: String,
	isNsfw: Boolean,
	adAllowed: Boolean,
	size: Number,
	fileType: String,
	width: {type: Number, default: 0},
	height: {type: Number, default: 0},
	viewsEmbeded: {type: Number, default: 0 },
    viewsWebsite: {type: Number, default: 0 },
	date: {type: Date, default: Date.now }
});
