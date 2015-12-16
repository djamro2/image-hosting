'use strict';

var directives = directives || angular.module('ImageHosting.directives', []);

directives.directive('buttonAsInput', function(){
	return {
	    restrict: 'A',
        link: function(scope, element, attrs) {

            var input = element.children()[0];
            var button = element.children()[1];

            button.onclick = function() {
                input.click();
            }
        }
    };
});
