
var app = angular.module('ImageHosting',
        ['ImageHosting.factories',
         'ImageHosting.controllers',
         'ImageHosting.directives',
         'ngRoute',
         'ngResource',
         'ngMaterial',
         'ngFileUpload']);

//configuration
app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('orange');
});
