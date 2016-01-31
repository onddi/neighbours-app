'use strict';

angular.module('myApp.view4', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view4', {
    templateUrl: 'js/private/view4/view4.html',
    controller: 'view4Ctrl'
  });
}])

.controller('view4Ctrl', ['$scope', '$rootScope','DataBaseService','UserService','$http', function($scope, $rootScope, DataBaseService, UserService, $http) {
  $rootScope.currentView = "Neighbours";
  $('.side-nav li').removeClass('active');
  $('#neighbours').addClass('active');

  var neighbours = UserService.getNeighbours();

  $scope.init = function(){
      $scope.neighbours = neighbours;
   }
}]);
