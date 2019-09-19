require('angular');
require('angular-route');

angular.module('app', ['ngRoute'])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(true);

  $routeProvider
  .when('/', { templateUrl: 'views/home.html' })
  .otherwise({ redirectTo: '/' });

}]);
