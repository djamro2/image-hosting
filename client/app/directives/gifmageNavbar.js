'use strict';

var directives = directives || angular.module('ImageHosting.directives', []);

directives.directive('gifmageNavbar', function(){
	return {
	    restrict: 'AE',
        templateUrl: '/views/gifmageNavbar.html',
		replace: 'true',
        link: function(scope, element, attrs) {

        }
    };
});
