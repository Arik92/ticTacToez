app.controller('fameCtrl', [ '$scope', 'fameService', function($scope, fameService) {
    //$scope.username = authService.currentUser.username;
    this.$onInit = function() {
        $scope.scoreLabels = ['All Time Score', 'Daily Score' ,'Weekly score', 'Monthly Score'];
        $scope.scoreIndex = 0;
      // get all time scores by default
      $scope.scores = [];      
      console.log("current user is", $scope.currentUser);    
    }//on init
    $scope.getAllScore = function() {
        fameService.getAllTime().then(function(response){
            console.log("All time result");
            $scope.updateScore(response, 0);
        })
    }//getAllScore
    $scope.getDailyScore = function() {
        fameService.getDaily().then(function(response){
            console.log("Daily result");
            $scope.updateScore(response, 1);
        })
    }//getDaily
    $scope.getWeeklyScore = function() {
        fameService.getWeekly().then(function(response){
            console.log("weekly result");
            $scope.updateScore(response, 2);
        })
    }//getWeekly
    $scope.getMonthlyScore = function() {
        fameService.getMonthly().then(function(response){
            console.log("monthly result");
            $scope.updateScore(response, 3);
        })
    }//getMonthly
    function updateScore(arr, index) {
        for (var i=0;i<arr.length;i++) {

        }//for 
    }//updateScore 
}]);//fameCtrl