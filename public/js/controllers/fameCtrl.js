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
            updateScore(response, 0);
        })
    }//getAllScore
    $scope.getDailyScore = function() {
        fameService.getDaily().then(function(response){
            console.log("Daily result");
            updateScore(response, 1);
        })
    }//getDaily
    $scope.getWeeklyScore = function() {
        fameService.getWeekly().then(function(response){
            console.log("weekly result");
            updateScore(response, 2);
        })
    }//getWeekly
    $scope.getMonthlyScore = function() {
        fameService.getMonthly().then(function(response){
            console.log("monthly result");
            updateScore(response, 3);
        })
    }//getMonthly
    function updateScore(arr, index) {
        $scope.scores = [];
        for (var i=0;i<arr.length;i++) {
            $scope.scores.push(arr[i]);
        }//for 
        $scope.scoreIndex = index;
    }//updateScore 
}]);//fameCtrl