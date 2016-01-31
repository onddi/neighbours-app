'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'js/private/view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', '$rootScope','DataBaseService','$http', 'UserService', function($scope, $rootScope, DataBaseService, $http, UserService) {

  $rootScope.currentView = 'News';
  $scope.housingname = UserService.getHousing();
  //Side navigation update
  $('.side-nav li').removeClass('active');
  $('#news').addClass('active');
  //Init materialize components
  $('.modal-trigger').leanModal();
  $('input#input_text, textarea#textarea1').characterCounter();

  $scope.init = function(){
      var user = UserService.getUser();
      $scope.user = user;

      var getNews = DataBaseService.news.query({housingId:UserService.getUser().housingId}).$promise;
      getNews.then(function (news) {
        $scope.news = news;
        for(var i = 0; i < news.length; i++){
          $scope.news[i].createdAt = moment($scope.news[i].createdAt).format("DD/MM/YYYY");
        }
       });
   }

  //News edit functions for the admin user

  $('#news-send').click(function(){
        $scope.newnews.housingId = UserService.getUser().housingId;
        $http.post(''+DataBaseService.getBEurl.BEurl+'/news/', $scope.newnews);
        $scope.news.push($scope.newnews);
  });

  $scope.edit = function(item){
    $scope.editnews = item;
    $('#modal2').openModal();
  };

  $('#news-edit-save').click(function(){
        DataBaseService.news.update({ id:$scope.editnews.id }, $scope.editnews);
  });

  $scope.openremoveModal = function(item){
    $scope.removenews = item;
    $('#modal-remove').openModal();
  };

  $('#news-remove-agree').click(function(){
        DataBaseService.news.delete({ id:$scope.removenews.id });
        for(var i = 0; i < $scope.news.length; i++)
          if($scope.news[i].id == $scope.removenews.id)
            $scope.news.splice(i,1);
  })

}])
;
