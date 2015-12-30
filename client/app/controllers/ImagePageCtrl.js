/* global angular */
'use strict';

 angular.module('ImageHosting.controllers', [])

.controller('ImagePageController', ['$scope', '$timeout', 'Upload', 'ImageService',
	function($scope, $timeout, Upload, ImageService){

	var vm = this;

	vm.init = function(){
		//nothing right now
	};

	$scope.addViews = function(a, b){
		return a + b + 1;
	}

	$scope.incrementWebViews = function(views) {
		var result = views + 1;
		return result;
	};

	$scope.convertSize = function(size) {
		var result = (size / 1000).toFixed(2) + 'kb';
		return result;
	};

	$scope.formatDate = function(date, format) {
		var result = moment(new Date(date)).format(format);
		return result;
	};

	vm.init();

}]);
