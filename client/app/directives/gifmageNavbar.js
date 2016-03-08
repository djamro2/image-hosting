'use strict';

var directives = directives || angular.module('gifmage.directives', []);

directives.directive('gifmageNavbar', function(){
	return {
	    restrict: 'AE',
        templateUrl: '/views/gifmageNavbar.html',
		replace: 'true',
        link: function(scope, element, attrs) {

        }
    };
});
