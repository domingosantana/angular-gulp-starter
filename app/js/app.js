require('angular');
require('angular-route');
require("jquery"); // Necesario para Bootstrap
require("popper.js"); // Necesario para Bootstrap
require('bootstrap');

angular.module('app', ['ngRoute'])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(true);

  $routeProvider
  .when('/', { templateUrl: 'views/home.html' })
  .otherwise({ redirectTo: '/' });

}]);
