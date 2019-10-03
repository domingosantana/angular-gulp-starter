require('angular');
require('angular-ui-router');
require("jquery"); // Necesario para Bootstrap
require("popper.js"); // Necesario para Bootstrap
require('bootstrap');

angular.module('app', ['ui.router'])

.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {

  $locationProvider.html5Mode(true);
  $urlRouterProvider.when('', '/');
  $urlRouterProvider.otherwise("/");

  $stateProvider
  .state('app', {
    abstract: true,
    views: {
      "header": { templateUrl: "views/shared/header.html" },
      "": { templateUrl: "index.html" },
      "footer": { templateUrl: "views/shared/footer.html" }
    }
  })
  .state('app.home', {
    url: "/",
    templateUrl: "views/home.html"
  })

}]);
