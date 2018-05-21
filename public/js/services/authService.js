app.factory('authService', function($http) {
    var auth = {};    
    auth.join = function(user) {
      return $http.post('/users/join', user)
        .then(function(response) {
          return response;
        });
    };
  
    auth.login = function(user) {
      return $http.post('/users/login', user)
        .then(function(response) {
          console.log(response.data);
          return response;
        });
    };

    auth.updateWinner = function(winnerName) {  
      var winObj = {
        'winnerName': winnerName
      }//winObj    
      return $http.put('/users/addScore', winObj)
      .then(function(response){
        return response.data;
      })
    }
  
    return auth;
  });