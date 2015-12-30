
var path = require('path');

module.exports.getHomePage = function(req,res){
    res.sendFile(path.resolve('./client/views/index.html'));
};

module.exports.getPolicyPage = function(req, res) {
    res.sendFile(path.resolve('./client/views/policy.html'));
};
