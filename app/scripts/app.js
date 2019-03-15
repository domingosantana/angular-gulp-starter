angular.module('app', ['ngRoute'])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(true);

  $routeProvider
    .when('/', { templateUrl: 'views/home.html', controller: 'MyController' }) // View as File with Controller
    // .when('/view', { template: 'views/view.html' }) // View as Text without Controller
    .otherwise({ redirectTo: '/' });

}]);
