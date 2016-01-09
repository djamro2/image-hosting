/* global angular */
'use strict';

 angular.module('ImageHosting.controllers', [])

.controller('ImagePageController', ['$scope', '$timeout', 'Upload', 'ImageService', '$location',
	function($scope, $timeout, Upload, ImageService, $location){

	var vm = this;

	vm.init = function(){
		//nothing right now
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

	$scope.formatDate = function(date, format) {
		var result = moment(new Date(date)).format(format);
		return result;
	};

	$scope.incrementWebViews = function(views) {
		var result = views + 1;
		return result;
	};

    // return true or false if the path says it is/isn't a video gif
    $scope.isVideo = function() {
        return ($location.absUrl().indexOf('webm') > -1 || $location.absUrl().indexOf('gifv') > -1);
    };

	vm.init();

}]);
