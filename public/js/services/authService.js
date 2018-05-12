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
  
    auth.getCurrentUser = function() {
      return $http.get('/users/currentUser')
        .then(function(response) {
          return response.data;
        })
    }  
  
    return auth;
  });