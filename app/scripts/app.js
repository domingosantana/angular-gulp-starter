angular.module('app', ['ngRoute'])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(true);

  $routeProvider
    .when('/', { controller: 'MyController', templateUrl: 'views/home.html' }) // View as File with Controller
    // .when('/otro', { template: 'Otra vista' }) // View as Text without Controller
    .otherwise({ redirectTo: '/' });

}]);
