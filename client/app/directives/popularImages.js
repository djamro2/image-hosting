'use strict';

// the purpose of this directive is to create a dynamic
// and responsive (and reusable) container for the popular images

var directives = directives || angular.module('ImageHosting.directives', []);

directives.directive('popularImages', function(ImageService){
	return {
	    restrict: 'E',
        templateUrl: '/views/popularImages.html',
        link: function(scope, element, attrs) {

            var init = function() {

                $(document).ready(function(){
                    $('.popular-image-row').perfectScrollbar({
                        suppressScrollY: true,
                        includePadding: true
                    });
                });

                // get the popular images, put on scope
                ImageService.getPopularImages(function(response){
                    scope.popularImages = response;
                });

                //set the initial max-width of the div
                if (attrs && attrs.maxwidth) {

                    element.children()[0].style.maxWidth = attrs.maxwidth;

                } else if (attrs && attrs.imagewidth) {

                    if (attrs.imagewidth >= 960) {
                        element.children()[0].style.maxWidth = '960px';
                    } else if (attrs.imagewidth <= 500 && attrs.imagewidth/attrs.imageheight >= 1) {
                        element.children()[0].style.maxWidth = '500px';
                    } else if (attrs.imagewidth <= 400) {
                        element.children()[0].style.maxWidth = '400px';
                    } else {
                        element.children()[0].style.maxWidth = attrs.imagewidth;
                    }

                }

            };

            scope.getMediaPage = function(filename) {
                return "/" + filename;
            };

            scope.getMediaSrc = function(filename) {
                return "/api/media/" + filename;
            };

            scope.isVideo = function(filename) {
                return (filename.indexOf('webm') > -1 || filename.indexOf('gifv') > -1);
            };

            init();
        }
    };
});
