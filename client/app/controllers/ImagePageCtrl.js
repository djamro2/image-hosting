/* global angular */
'use strict';

 angular.module('gifmage.controllers', [])

.controller('ImagePageController', ['$scope', '$timeout', 'Upload', 'ImageService', '$location', '$window',
	function($scope, $timeout, Upload, ImageService, $location, $window){

	var vm = this;

	vm.init = function(){
		// nothing right now
	};

	$scope.addViews = function(a, b){
        var result = (a+b+1);
        return result.toLocaleString();
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

    /* 
     * take in info about the image and change other values to accomodate
     */
    $scope.initializePageStyle = function(width, height) {

        // if image is smaller than min-width, set the height to be equal
        if (width && width < 720) {

            var paddingWidth = ((720 - width) / 2);
            var image_container = document.getElementById('image-container');
            image_container.style.height = height + (paddingWidth) + "px";

        }

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

    /*
     * Take in an id, and id the parameters fit, set as background url. Otherwise, revert to normal
     */
    $scope.setBackground = function(id) {

        if (!id) {
            return;
        }

        if ( id.indexOf('png') != -1 || id.indexOf('PNG') != -1 || 
             id.indexOf('jpeg') != -1 || id.indexOf('JPEG') != -1|| 
             id.indexOf('jpg') != -1 || id.indexOf('JPG') != -1) {

            var title_bar = document.getElementById('title-bar-background');
            var title_contents = document.getElementById('title-contents');
            
            title_bar.style.backgroundImage = "URL(/api/media/" + id + ")";
            title_contents.style.backgroundColor = 'rgba(0, 0, 0, .23)';

         } else { /* no transparent background, white background */

            var title_contents = document.getElementById('title-contents');
            title_contents.style.color = 'black';

         }

    };

	vm.init();

}]);
