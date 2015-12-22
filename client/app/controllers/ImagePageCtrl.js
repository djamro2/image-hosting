/* global angular */
'use strict';

var controllers = controllers || angular.module('ImageHosting.controllers', []);

controllers.controller('ImagePageController', ['$scope', '$timeout', 'Upload', 'ImageService',
	function($scope, $timeout, Upload, ImageService){

	var vm = this;

	vm.init = function(){
		//nothing right now
	};

	vm.init();

}]);
