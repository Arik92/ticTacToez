app.controller('authCtrl', [ '$scope', '$state','authService', '$stateParams','$location', function($scope, $state, authService, $stateParams, $location ) {
    //$scope.username = authService.currentUser.username;
  $scope.join = function() {
    //add validation
    console.log("joining user? ", $scope.user);
    authService.join($scope.user)
      .then(function(result, error) {
          console.log("signup result ", result);
          if (result.data.errorText) {
              alert(result.data.errorText);
          } else {
              //timeout
              $state.go('home');
          }
      });
  };// join/signin

  $scope.login = function() {
    //add validation
    authService.login($scope.user)
      .then(function(result) {
       console.log("login result", result);
       //$state.go('home');
      });
  };//login
  $scope.logout = function() {
    console.log("logging out");
    authService.logout($scope.user)
      .then(function() {
        console.log("logged out");
        $state.go('home', {}, {
          reload: true
        });
      }, function(err) {
        alert(err.data);
      });
  };//logout
}]);//authCtrl