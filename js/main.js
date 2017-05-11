var app = angular.module('sawwit', ['ngRoute', 'ngResource', 'ngFlash'])

//==== Routes ====
app.config(['$routeProvider', function($routeProvider){
  $routeProvider

  // Root: Posts Index
  .when("/", {templateUrl: "partials/posts/post_index.html", controller: "postsController"})

  // Post show
  .when("/posts/:id", {templateUrl: "partials/posts/post_show.html", controller: "postsController"})

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
app.controller('postsController', ['$scope', '$log', '$filter', '$routeParams', '$http', 'Post', 'Msg', function($scope, $log, $filter, $routeParams, $http, Post, Msg){
  // Find user account by post.userId
  function fetchUser(post){
    $http.get('http://jsonplaceholder.typicode.com/users/' + post.userId).then(function(user){
      post.user = user.data;
    });
  };

  // Iterate through posts and fetch users for each
  function fetchUsers(){
    angular.forEach($scope.posts, function(post, index){
      fetchUser(post);
    });
  };

  // Get first 100 posts from API
  $scope.fetchAllPosts = function(){
    Post.query(
      function(posts){
        $scope.posts = posts;
        fetchUsers();
      }, function(err){
        Msg.err(err);
      }
    );
  };

  // Get post by id
  $scope.fetchPost = function(){
    Post.get({id: $routeParams.id}, function(post){
      fetchUser(post);
      $scope.post = post;
    });
  };
}]);
