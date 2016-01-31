'use strict';

angular.module('myApp.view6', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view6', {
    templateUrl: 'js/private/view6/view6.html',
    controller: 'View6Ctrl'
  });
}])

.controller('View6Ctrl', ['$scope', 'UserService', 'DataBaseService', function($scope, UserService, DataBaseService) {
  $scope.user = UserService.getUser();
  $('.side-nav li').removeClass('active');
  $('#profile').addClass('active');

  $scope.init = function(){
    $scope.editphone = false;
    $scope.editemail = false;

    if($scope.user.showPhone)
      $scope.checked = $scope.user.showPhone;
    else {
      $scope.checked = true;
    }
  }

  $scope.editnumber = function() {
    $scope.editphone = !$scope.editphone;
  }

  $scope.editmail = function() {
    $scope.editemail = !$scope.editemail;
  }

  $scope.showPhone = function(){
    $scope.checked = !$scope.checked;
    $scope.user.showPhone = $scope.checked;
  }

  $scope.save = function(){
    DataBaseService.users.update({ id:$scope.user.id }, $scope.user, function(res){
      console.log(res);
    });
  }

  /* FILE INPUT for images -- Attribution: https://stackoverflow.com/questions/18754943/preview-image-before-uploading-angularjs*/
  $scope.setFile = function(element) {
    $scope.currentFile = element.files[0];
     var reader = new FileReader();

    reader.onload = function(event) {
      $scope.user.gravatarUrl = event.target.result
      $scope.$apply()
      $scope.save();
    }
    // when the file is read it triggers the onload event above.
    reader.readAsDataURL(element.files[0]);
  }

}]);
