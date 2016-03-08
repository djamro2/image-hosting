
var app = angular.module('gifmage',
        ['gifmage.factories',
         'gifmage.controllers',
         'gifmage.directives',
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
