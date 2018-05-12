var app = angular.module("ticToeApp", ['ui.router']);

app.config(function($locationProvider, $stateProvider, $urlRouterProvider) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/home');
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/templates/home.html',
      controller: function($rootScope) { //, authFactory
        $rootScope.currentUser =  $rootScope.currentUser = localStorage.getItem("ticTacUser");
        //console.log("user from state of home is: ", authFactory.currentUser.username);
      } //NOTE: maybe remove for authControl?
    })
    .state('play', {
      url: '/play',
      templateUrl: '/templates/gameboard.html', // board would be a page with instructions and the player board
      controller: 'gameCtrl'
    })
    .state('leaderboard', {
      url: '/leaderboard',
      templateUrl: '/templates/leaderboard.html'      
    }) //seems likke a static page for now
    /*.state('create', {
      url: '/create',
      templateUrl: '/templates/createBattle.html',
      controller: 'btlCtrl1'
    })*/
    .state('signup', {
      url: '/signup',
      templateUrl: '/templates/signup.html',
      controller: 'authCtrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: '/templates/login.html',
      controller: 'authCtrl'
    })
    .state('logout', {
      url: '/logout',
      templateUrl: '/templates/home.html',
      controller: 'authCtrl'
    })    
});
app.run([ '$rootScope', function ($rootScope) {
  //$rootScope.currentUser = JSON.parse(localStorage.getItem("ticTacUser"));
   $rootScope.currentUser = localStorage.getItem("ticTacUser");
   console.log("current user", $rootScope.currentUser);
}])