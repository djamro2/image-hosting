/* global angular */
'use strict';

 angular.module('ImageHosting.controllers', [])

.controller('ImagePageController', ['$scope', '$timeout', 'Upload', 'ImageService', '$location', '$window',
	function($scope, $timeout, Upload, ImageService, $location, $window){

	var vm = this;

	vm.init = function(){
		// nothing right now
	};

	$scope.addViews = function(a, b){
		return a + b + 1;
	};

    $scope.convertSize = function(size) {

        if (size < 1000000) {
            return (size / 1000).toFixed(2) + 'KB';
        } else {
            return (size / 1000000).toFixed(2) + 'MB';
        }
	};

    $scope.goToAmazonLink = function(title){

        var encodedTitle = encodeURIComponent(title);

        var finalLink = "http://www.amazon.com/gp/search?ie=UTF8&camp=1789&creative=9325&index=aps&keywords=" + encodedTitle + "&linkCode=ur2&tag=dealgira-20&linkId=FQYLLJ4UVF6Y2NX4";

        $window.location.href = finalLink;
    };

	$scope.formatDate = function(date, format) {
		var result = moment(new Date(date)).format(format);
		return result;
	};

	$scope.incrementWebViews = function(views) {
		var result = views + 1;
		return result;
	};

    // return true or false if the path says it is/isn't a video gif
    $scope.isVideo = function(filetype) {
        return (filetype === 'WEBM' || filetype === 'GIFV');
    };

    // get data from handlebars
    $scope.setScopeData = function(width, height, title) {

        // data passed in from params
        $scope.width = width;
        $scope.height = height;
        $scope.title = title;

        // other info
        $scope.dimensionRatio = width/height;

    };

	vm.init();

}]);
