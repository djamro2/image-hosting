/* global angular */
'use strict';

angular.module('ImageHosting.controllers', [])

.controller('HomeController', ['$scope', '$timeout', 'Upload', 'ImageService', '$location',
	function($scope, $timeout, Upload, ImageService, $location){

	var vm = this;

	var _URL = window.URL || window.webkitURL;

	$scope.image = {};
	$scope.errorMessage = "";
	$scope.successImageId = "";

	$scope.fileName = "no file chosen";

	vm.init = function(){
		//nothing here right now
	};

	$scope.updateImageInfo = function(file){

		if (!file)
			return;

		$scope.fileName = file.name;

		if ($scope.errorMessage.indexOf('select an image') > -1){
			$scope.errorMessage = '';
		}

		Upload.imageDimensions(file).then(function(d){
			$scope.image.width = d.width;
			$scope.image.height = d.height;
		});
	};

	$scope.uploadFile = function(file){

		if (!file) {
			$scope.errorMessage = "Please select an image to upload";
			return;
		}

		if (!$scope.image.agree) {
			$scope.errorMessage = "Please confirm that the image does not violate the policy";
			return;
		}

		file.upload = Upload.upload({
			url: '/uploadFile',
			data: {file: file,
				   title: $scope.image.title,
			       nsfw: $scope.image.nsfw,
			       isPolicyAgreed: $scope.image.agree,
			   	   width: $scope.image.width,
			   	   height: $scope.image.height}
		});

		file.upload.then(function(response){
			$timeout(function(){
				file.result = response.data;
			});
			if (response.statusText === "OK"){
				$scope.successImageId = response.data.id;
				$scope.errorMessage = '';
			}
		}, function(response) {
			if (response.status > 0) {
				$scope.errorMsg = response.status + ": " + response.data;
				$scope.errorMessage = 'There was a problem uploading this image';
			}
		}, function(evt){
			// Math.min is to fix IE which reports 200% sometimes
      		file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
		});
	};

	$scope.$watch('image.agree', function(newVal, oldVal){
		if (newVal && $scope.errorMessage.indexOf('policy') > -1){
			$scope.errorMessage = '';
		}
	});

	vm.init();

}]);
