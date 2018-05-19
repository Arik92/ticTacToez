app.controller('fameCtrl', [ '$scope', 'fameService', function($scope, fameService) {
    //$scope.username = authService.currentUser.username;
    this.$onInit = function() {
        $scope.scoreLabels = ['All Time Score', 'Daily Score' ,'Weekly score', 'Monthly Score'];
        $scope.scoreIndex = 0;
      // get all time scores by default
      $scope.scores = [];      
      console.log("current user is", $scope.currentUser);
      $scope.getAllScore(); 
    }//on init
    $scope.getAllScore = function() {
        fameService.getAllTime().then(function(response){
            console.log("All time result",response);
            $scope.scores = [];
        for (var i=0;i<response.length;i++) {
            $scope.scores.push({
                'username': arr[i].username,
                'score': arr[i].totalscore
            });
        }//for 
        $scope.scoreIndex = 0;           
        })
    }//getAllScore
    $scope.getDailyScore = function() {
        fameService.getDaily().then(function(response){
            console.log("Daily result", response);
            $scope.scores = [];
            for (var i=0;i<response.length;i++) {
                $scope.scores.push({
                    'username': arr[i].username,
                    'score': arr[i].dailyscore
                });
            }//for 
            $scope.scoreIndex = 1; 
        })
    }//getDaily
    $scope.getWeeklyScore = function() {
        fameService.getWeekly().then(function(response){
            console.log("weekly result", response);
            $scope.scores = [];
            for (var i=0;i<response.length;i++) {
                $scope.scores.push({
                    'username': arr[i].username,
                    'score': arr[i].weeklyscore
                });
            }//for 
            $scope.scoreIndex = 2; 
        })
    }//getWeekly
    $scope.getMonthlyScore = function() {
        fameService.getMonthly().then(function(response){
            console.log("monthly result", response);
            $scope.scores = [];
            for (var i=0;i<response.length;i++) {
                $scope.scores.push({
                    'username': arr[i].username,
                    'score': arr[i].monthlyscore
                });
            }//for 
            $scope.scoreIndex = 3; 
        })
    }//getMonthly    
}]);//fameCtrl