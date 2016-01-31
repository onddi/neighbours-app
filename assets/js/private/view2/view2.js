'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'js/private/view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', ['$scope', '$rootScope','DataBaseService','$http', 'UserService', '$sce', 'GuidGenerator', function($scope, $rootScope, DataBaseService, $http, UserService, $sce, GuidGenerator) {

  $rootScope.currentView = 'Notes';
  $scope.user = UserService.getUser();

  //Side navigation update
  $('.side-nav li').removeClass('active');
  $('#notes').addClass('active');

  //Init materialize components
  $('.modal-trigger').leanModal();
  $('input#input_text, textarea#textarea1').characterCounter();
  $('.collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });


  $scope.init = function(){
    var getNotes = DataBaseService.note.query({housingId:$scope.user.housingId});
    $('#preloader').show();

    getNotes.$promise.then(function (result) {
      var notes = result;

      for(var x = 0; x < notes.length; x++){
        //Attach value of how long ago was the post made from now
        var fromNow = moment(notes[x].createdAt).fromNow();
        notes[x]['fromNow'] = fromNow;
        notes[x]['parsedContent'] = $sce.trustAsHtml(notes[x].content)
      }

      var neighbours = UserService.getNeighbours();
      //Attach neighbour images and names to the postmaker
      for(var i = 0; i < notes.length; i++)
        for(var j = 0; j < neighbours.length; j++){
          if(notes[i].userId == neighbours[j].id){
            notes[i]['profileimage'] = neighbours[j].gravatarUrl;
            notes[i]['name'] = neighbours[j].name;
            if(!notes[i]['comments'])
              notes[i]['comments'] = new Array();
          }
      }

      //Split the notes into two columns
      var splitNotes = new Array();
      for(var i = 0; i < notes.length; i+=2){
        if(notes[i+1])
          splitNotes.push([notes[i], notes[i+1]]);
        else
          splitNotes.push([undefined, notes[i]]);
      }
      $scope.notes = splitNotes;
      $scope.notesmobile = notes;
      //console.log($scope.notesmobile);
      $('#preloader').hide();

     });
   }

  //Commentfield for mobile
  $scope.commentfield = {};
  //for desktop left column
  $scope.commentfield0 = {};
  //for desktop right column
  $scope.commentfield1 = {};

  $scope.onComment = function(input, index, leftColumn, isMobile) {
    //Which column was commented

    console.log($scope.commentfield);
    //Check which column was commented and empty commentfield
    var columnNum;
    if(leftColumn){
      columnNum = 0;
      $scope.commentfield0[index] = '';
    } else {
      columnNum = 1;
      $scope.commentfield1[index] = '';
    }

    var commented_note;
    //Mobile has its own layout, check if mobile
    if(!isMobile){
      commented_note = $scope.notes[$scope.notes.length-1-index][columnNum];
    }else{
      commented_note = $scope.notesmobile[$scope.notesmobile.length-1-index];
      $scope.commentfield[index] = '';
    }

    var id = GuidGenerator.generate();

    commented_note.comments.push({by:$scope.user.name, content: input, id:id}) //Push to the comment array
    //Update the newly commented note to backend
    DataBaseService.note.update({id:commented_note.id, comment: {by:$scope.user.name, content: input, id:id}}, function(){
      //$scope.init();
    });

  }

  //Function to remove comment from the note
  $scope.deleteComment = function(parent_index, index, leftColumn, isMobile, note_id, comment_id){
    var columnNum;
    if(leftColumn){
      columnNum = 0;
    } else {
      columnNum = 1;
    }

    //console.log($scope.notes[$scope.notes.length-1-parent_index][columnNum].comments);
    //var note_id = $scope.notes[$scope.notes.length-1-parent_index][columnNum].id;
    //var comment_id = $scope.notes[$scope.notes.length-1-parent_index][columnNum].comments[index].id;
    //console.log("noteid: "+ note_id + " commentid " + comment_id);

    if(!isMobile){
      $scope.notes[$scope.notes.length-1-parent_index][columnNum].comments.splice(index, 1);
    }else{
      $scope.notesmobile[$scope.notesmobile.length-1-parent_index].comments.splice(index, 1);
    }

    $http.delete(''+DataBaseService.getBEurl.BEurl+'/note/comment/'+note_id, {params: {commentid: comment_id}}, function(res){
      //console.log(res);
    });
  }

  $scope.showComments = function(id){
    console.log($('#'+id));
    if(!$('#'+id).hasClass( "active" ))
      $('#'+id).click();
  }

  //Publish new note
  $('.note-publish').click(function(){
        //$scope.newnote.content.val().replace( /\n/g, '<br \\>' );
        $scope.newnote.content = $('#newnotecontent').val().replace( /\n/g, '<br \\>' )
        $scope.newnote.topic = 'Topic'; //Topic isn't used currently for notes
        $scope.newnote.housingId = $scope.user.housingId;
        $scope.newnote.userId = $scope.user.id;
        //$scope.newnote['profileimage'] = $scope.user.gravatarUrl;
        console.log($scope.newnote);
        DataBaseService.note.save($scope.newnote,function(res){
          $scope.init();
        });
        //Clear scope values
        $scope.newnote = undefined;
  });

  $scope.deleteNote = function(id){
    DataBaseService.note.delete({ id:id }, function(res){
      $scope.init();
    });
  }

  /* EDITING NOT ENABLED IN THIS VERSION */

  $scope.edit = function(item){
    $scope.editnote = item;
    $('#modal4').openModal();
  };

  $('#note-edit-save').click(function(){
        DataBaseService.note.update({ id:$scope.editnote.id }, $scope.editnote);
  });

  $('#note-edit-remove').click(function(){
        DataBaseService.note.delete({ id:$scope.editnote.id });
        for(var i = 0; i < $scope.notes.length; i++)
          if($scope.notes[i].id == $scope.editnote.id)
            $scope.notes.splice(i,1);
  });

  /* FILE INPUT for images for notes*/
  /* CURRENTLY NOT IN USE */
  $scope.setFile = function(element) {
    $scope.currentFile = element.files[0];
     var reader = new FileReader();

    reader.onload = function(event) {
      $scope.image_source = event.target.result
      $scope.$apply()
    }
    // when the file is read it triggers the onload event above.
    reader.readAsDataURL(element.files[0]);
  }

}])

;
