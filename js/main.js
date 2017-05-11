var app = angular.module('sawwit', ['ngRoute', 'ngResource', 'ngFlash'])

//==== Routes ====
app.config(['$routeProvider', function($routeProvider){
  $routeProvider

  // Root: Posts Index
  .when("/", {templateUrl: "partials/posts/post_index.html", controller: "postsController"})

  // Post show
  .when("/posts/:id", {templateUrl: "partials/posts/post_show.html", controller: "postsController"})

  // User show
  .when("/users/:id", {templateUrl: "partials/users/user_show.html", controller: "usersController"})

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
  return $resource('http://jsonplaceholder.typicode.com/posts/:id', {id: '@id'}, {
    update: {method: 'PUT'}
  });
}]);

// Fetches comments from API service
app.factory('Comment', ['$resource', function($resource){
  return $resource('http://jsonplaceholder.typicode.com/comments/:id', {id: '@id'})
}]);

//==== Controllers ====
// Main Application Controller
app.controller('appController', ['$scope', '$log', function($scope, $log){
}]);

// Posts Controller
app.controller('postsController', ['$scope', '$log', '$filter', '$routeParams', '$http', 'Post', 'Comment', 'Msg',
  function($scope, $log, $filter, $routeParams, $http, Post, Comment, Msg){
  // Find user account by post.userId
  function fetchUser(post){
    $http.get('http://jsonplaceholder.typicode.com/users/' + post.userId).then(function(user){
      post.user = user.data;
    });
  };

  // Check if post is 'liked'
  function liked(post){
    if (post.favorite){
      post.liked = true;
    }else{
      post.liked = false;
    }
  };

  // Iterate through posts and fetch users for each
  function getMoreData(){
    angular.forEach($scope.posts, function(post, index){
      fetchUser(post);
      liked(post);
    });
  };

  // Get comments for post
  function fetchComments(post){
    Comment.query({postId: post.id},
      // success
      function(comments){
        $scope.comments = comments;
      // error
    }, function(err){
        Msg.err();
        $log.debug(err);
    })
  };

  // Get posts from API
  $scope.fetchAllPosts = function(){
    Post.query(
      // success
      function(posts){
        $scope.posts = posts;
        getMoreData();
      // error
      }, function(err){
        Msg.err(err);
      }
    );
  };

  // Get post by id
  $scope.fetchPost = function(){
    Post.get({id: $routeParams.id}, function(post){
      fetchUser(post);
      fetchComments(post);
      liked(post);
      $scope.post = post;
    });
  };

  // Update post
  function updatePost(post){
    Post.update({
      id: post.id,
      liked: post.liked
      // Log response to console (for testing)
    }, function(response){
      $log.debug(response);
    });
  };

  // Allow user to like post
  $scope.likePost = function(post){
    post.liked = true;
    updatePost(post);
  };

  // Allow user to unlike post
  $scope.unlikePost = function(post){
    post.liked = false;
    updatePost(post);
  };
}]);

app.controller('usersController', ['$scope', '$log', '$http', '$routeParams', 'Post', 'Msg', function($scope, $log, $http, $routeParams, Post, Msg){
  // Get all posts per user
  function recentPosts(){
    Post.query({userId: $scope.user.id},
    // success
    function(posts){
      $scope.recentPosts = posts;
    // error
  }, function(err){
    Msg.err();
    $log.debug(err);
  });
  };

  // Enable edit fuctionality
  $scope.editUser = function(){
    $scope.edit = true;
  };

  // Fetch user from API service
  $scope.fetchUser = function(){
    $http.get('http://jsonplaceholder.typicode.com/users/' + $routeParams.id).then(function(response){
      $scope.user = response.data;
      recentPosts();
    });
  };

  // Update user
  $scope.updateUser = function(user){
    $http.put("http://jsonplaceholder.typicode.com/users/" + user.id, {
      id: user.id,
      name: user.name,
      username: user.username
    }).then(function(response){
      $scope.edit = false;
      Msg.success();
      $log.debug(response);
    });
  };
}]);
