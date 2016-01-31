angular.module('user.services',[])
.factory('UserService', function() {
  var user = window.SAILS_LOCALS.me;
  var neighbours = [];
  var housing = '';

  var userService = {
    getUser: function(){
      return user;
    },
    setUser: function(user_){
      user = user_;
    },
    getNeighbours: function(){
      return neighbours;
    },
    setNeighbours: function(neighbours_){
      neighbours = neighbours_;
    },
    getHousing: function(){
      return housing;
    },
    setHousing: function(housing_){
      housing = housing_;
    }
  }
  return userService;
});
