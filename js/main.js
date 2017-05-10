var app = angular.module('sawwit', ['ngRoute', 'ngResource', 'ngFlash'])

//==== Routes ====
app.config(['$routeProvider', function($routeProvider){
  $routeProvider

  // Root: Posts Index
  .when("/", {templateUrl: "partials/posts/post_index.html", controller: "postsController"})

  // else: 404 Error
  .otherwise({templateUrl: "partials/404.html", controller: "appController"});
}]);

//==== Factories ====
// Flash message logging success or failure of API requests
app.factory('Msg', ['$log', 'Flash', function($log, Flash){
  var messageService = {};
  // if success (and appropriate), display confirmation and log API response in console
  messageService.success = function(response){
    Flash.create('success', 'Completed Successfully!', 3000);
    $log.debug(response);
  };

  // if error, show error message and log error to console
  messageService.err = function(err){
    Flash.create('danger', 'There was a problem communicating with our servers. Please try again later.');
    $log.debug(err);
  };

  return messageService;
}]);

// Fetches posts from API service
app.factory('Post', ['$resource', function($resource){
  return $resource('http://jsonplaceholder.typicode.com/posts/:id', {id: '@id'});
}]);

//==== Controllers ====
// Main Application Controller
app.controller('appController', ['$scope', '$log', function($scope, $log){
  $log.debug('appController running');
}]);

// Posts Controller
app.controller('postsController', ['$scope', '$log', 'Post', 'Msg', function($scope, $log, Post, Msg){
  Post.query(
    function(posts){
      $scope.posts = posts.slice(0, 100);
    }, function(err){
      Msg.err(err);
    })
}]);
