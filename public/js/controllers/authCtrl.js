app.controller('authCtrl', [ '$scope','$timeout' ,'authService', '$stateParams','$state', '$location', function($scope, $timeout, authService, $stateParams, $state, $location ) {
    //$scope.username = authService.currentUser.username;
    this.$onInit = function() {
      //$scope.currentUser = false;
      //$scope.currentUser = localStorage.getItem("ticTacUser");        
    }//on init

  $scope.join = function() {
    //add validation
    console.log("joining user? ", $scope.user);
    authService.join($scope.user)
      .then(function(result, error) {
          console.log("signup result ", result);
          if (result.data.errorText) {
              alert(result.data.errorText);
          } else {
            localStorage.setItem('ticTacUser', $scope.user.username);
              //timeout
              $timeout(function () {
                $scope.$apply();
                $location.path('/');
              }, 500);              
          }//else
      });
    };// join/signin

  $scope.login = function() {
    //add validation
    authService.login($scope.user).then(function(result) {
        //console.log(result);
        //console.log("Ctrl response is "+result+" of type "+typeof(result));
        if (result.data===false) {
          alert("Wrong username/password");
        } else {         
          localStorage.setItem('ticTacUser', $scope.user.username);
          //$scope.currentUser = $scope.user.username;         
          $timeout(function () { 
            $location.path('/');   
            window.location.reload(true);                       
            /*$state.go('home', {}, {
              reload: true
            });                       */
          }, 500);
        }//else       
      });
    };//login
  $scope.logout = function() {
    localStorage.removeItem('ticTacUser');
    $scope.currentUser = null;
    $timeout(function () {      
      $state.go('home', {}, {
        reload: true
      });
    }, 500);
    /*console.log("logging out");
    authService.logout($scope.user)
      .then(function() {
        console.log("logged out");
        $state.go('home', {}, {
          reload: true
        });
      }, function(err) {
        alert(err.data);
      });*/
  };//logout
}]);//authCtrl