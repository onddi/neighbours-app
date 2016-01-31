'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ui.materialize',
  'myApp.view1',
  'myApp.view2',
  'myApp.view3',
  'myApp.view4',
  'myApp.view5',
  'myApp.view6',
  'user.services',
  'backend.services',
  'guid.services',
  'sauna.services'
]).
config(['$routeProvider', function( $routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});

  // Initialize collapse button
  $(".button-collapse").sideNav({
      menuWidth: 300, // Default is 240
      edge: 'left', // Choose the horizontal origin
      closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
    });
  // Initialize collapsible (uncomment the line below if you use the dropdown variation)
  $('.side-nav li').click(function(){
    $('.side-nav li').removeClass('active');
    $(this).addClass('active');
  })
}])

.controller('AppCtrl', ['$scope', '$rootScope','DataBaseService','UserService', function($scope, $rootScope, DataBaseService,  UserService) {
  var user = UserService.getUser();
  $scope.housingName = '';

  var housing = DataBaseService.housing.get({id:user.housingId}).$promise;//Get the housings neighbours and add them to userservice for reuse
  housing.then(function(housing_){
    console.log(housing_);
    $scope.housingName = housing_.address;
    UserService.setHousing(housing_.address);

    var getNeighbours = DataBaseService.users.query({housingId:housing_.id}).$promise;//Get the housings neighbours and add them to userservice for reuse
    getNeighbours.then(function(neighbours){
      UserService.setNeighbours(neighbours);
      console.log(neighbours);
    })
  })
}]);
