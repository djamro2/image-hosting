/* global angular */
'use strict';

var controllers = controllers || angular.module('ImageHosting.controllers', []);

controllers.controller('HomeController', ['$scope', '$timeout', 'Upload', 'ImageService',
	function($scope, $timeout, Upload, ImageService){

	var vm = this;

	$scope.image = {};
	$scope.errorMessage = "";

	$scope.fileName = "no file chosen";

	vm.init = function(){
		ImageService.getRecentImages(function(response){
			$scope.images = response;
		});
	};

	$scope.updateFileName = function() {
		$scope.fileName = $scope.image.file.name;
	};

	$scope.uploadImage = function(file){

		file.upload = Upload.upload({
			url: '/uploadImage',
			data: {file: file,
				   title: $scope.image.title,
			       nsfw: $scope.image.nsfw,
			       isPolicyAgreed: $scope.image.agree}
		});

		file.upload.then(function(response){
			$timeout(function(){
				file.result = response.data;
			});
		}, function(response) {
			if (response.status > 0)
				$scope.errorMsg = response.status + ": " + response.data;
		}, function(evt){
			// Math.min is to fix IE which reports 200% sometimes
      		file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
		});
	};

	vm.init();

}]);
