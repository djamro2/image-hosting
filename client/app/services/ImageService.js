/* global angular */
'use strict';

angular.module('ImageHosting.factories', [])

.factory('ImageService', ['$resource', function($resource){

	var Image =  $resource('/api/image/:id', {id: '@Id'}, {
		update: {method: 'PUT'},
		getRecentImages: {
			method: 'GET',
			url: '/api/recentImages',
			isArray: true
		}
	});

	return Image;

}]);
