var app = angular.module('sawwit', ['ngRoute', 'ngResource'])

//==== Routes ====
app.config(['$routeProvider', function($routeProvider){
  $routeProvider

  // Root: Posts Index
  .when("/", {templateUrl: "partials/posts/post_index.html", controller: "postsController"})

  // else: 404 Error
  .otherwise({templateUrl: "partials/404.html", controller: "appController"});
}]);

//==== Factories ====
app.factory('Post', ['$resource', function($resource){
  return $resource('http://jsonplaceholder.typicode.com/posts/:id', {id: '@id'});
}]);

//==== Controllers ====
// Main Application Controller
app.controller('appController', ['$scope', '$log', function($scope, $log){
  $log.debug('appController running');
}]);

// Posts Controller
app.controller('postsController', ['$scope', '$log', 'Post', function($scope, $log, Post){
  Post.query(
    function(posts){
      $scope.posts = posts;
    }, function(err){
      $log.debug(err);
    })
}]);
