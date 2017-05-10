var app = angular.module('sawwit', ['ngRoute', 'ngResource'])

//==== Routes ====
app.config(['$routeProvider', function($routeProvider){
  $routeProvider

  // Root: Posts Index
  .when("/", {templateUrl: "partials/posts/post_index.html", controller: "postsController"})

  // else: 404 Error
  .otherwise({templateUrl: "partials/404.html", controller: "appController"});
}]);

//==== Controllers ====
// Main Application Controller
app.controller('appController', ['$scope', '$log', function($scope, $log){
  $log.debug('appController running');
}]);

// Posts Controller
app.controller('postsController', ['$scope', '$log', function($scope, $log){
  $log.debug('postsController running');
}]);
