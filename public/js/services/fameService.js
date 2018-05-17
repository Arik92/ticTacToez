app.factory('fameService', function($http) {
    var fame = {};  
    fame.getAllTime = function() {
        return $http.get('/users/alltime').then(function(response){            
          return response.data;
        })//cb 
    }//getAllTime

    fame.getDaily = function() {
        return $http.get('/users/daily').then(function(response){            
          return response.data;
        })//cb 
    }//getDaily

    fame.getWeekly = function() {
        return $http.get('/users/weekly').then(function(response){            
          return response.data;
        })//cb 
    }//getAllTime

    fame.getMonthly = function() {
        return $http.get('/users/monthly').then(function(response){            
          return response.data;
        })//cb 
    }//getAllTime

    /*auth.join = function(user) {
      return $http.post('/users/join', user)
        .then(function(response) {
          return response;
        });
    };   EX reference */ 
  
    return fame;
  });