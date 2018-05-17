app.controller('fameCtrl', [ '$scope', 'fameService', function($scope, fameService) {
    //$scope.username = authService.currentUser.username;
    this.$onInit = function() {
      // get all time scores by default
      $scope.scores = [];      
      console.log("current user is", $scope.currentUser);    
    }//on init
}]);//fameCtrl