'use strict';

angular.module('myApp.view5', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view5', {
    templateUrl: 'js/private/view5/view5.html',
    controller: 'View5Ctrl'
  });
}])

.controller('View5Ctrl', ['$scope', 'UserService', function($scope, UserService) {
  $scope.user = UserService.getUser();
  $('.side-nav li').removeClass('active');
  $('#contact').addClass('active');

  $('.contact-btn').click(function(){
    $('.contact-btn').removeClass('active');
    $(this).addClass('active');
    console.log($(this).attr('id'));
  })

}]);
