'use strict';

angular.module('myApp.view3', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view3', {
    templateUrl: 'js/private/view3/view3.html',
    controller: 'view3Ctrl'
  });
}])

.controller('view3Ctrl', ['$scope', '$rootScope', '$http', 'DataBaseService', 'UserService', 'SaunaService', 'GuidGenerator', function($scope, $rootScope, $http, DataBaseService, UserService, SaunaService, GuidGenerator) {
  $rootScope.currentView = "Sauna";
  $('.side-nav li').removeClass('active');
  $('#sauna').addClass('active');

   var calendar;
   var events; //events array that is aggregated from eventdata
   var eventdata;// raw eventdata from backend
   var cancelled;
   var currentDate;
   var today;
   var neighbours;

   //Data object that can be accessed by modals
   $scope.data = {
     date: null,
     slot: null
   }

   //Object for formatting dates
   var format = {
     dateLong : 'DD-MM-YYYY HH:mm:ss',
     dateShort : 'DD-MM-YYYY',
     timeLong : 'HH:mm:ss',
     timeShort : 'HH:mm'
   }

   $scope.init = function(){
     var user = DataBaseService.sauna.query({housingId:UserService.getUser().housingId});

     user.$promise.then(function (result) {
         eventdata = result;
         today = moment(new Date()).format(format.dateShort);
         neighbours = UserService.getNeighbours();
         initCalendar(today);
      });
    }

   //A function to upload the reserved extra (not weekly) sauna turns
   var uploadTimeslot = function(calendarslot){
     var saunaslot = calendarslot.start.format(format.dateLong);
     var userId = UserService.getUser().id;

     $http.put(''+DataBaseService.getBEurl.BEurl+'/sauna/extra/'+userId, {userId: userId, timeslot: saunaslot}, function(res){
       console.log(res.data);
     });
   }

   var aggregateSaunaTurns = function(backendResults){
     var aggregatedSlots = [];
     var aggregatedSlot;
     var timeslot, baseSlots, backgroundColor, refid;

     //Each user has a base sauna turn eg. thursday 19-21
     baseSlots = backendResults;
     for(var i = 0; i < baseSlots.length; i++){
       //Find lastname for the saunaslot from neighbours
       for(var j = 0; j < neighbours.length; j++){
         if(baseSlots[i].userId == neighbours[j].id)
           baseSlots[i].lastname = neighbours[j].name.split(' ').slice(-1).join(' ');
       }
       //Set the color of the timeslot (user or neighbour)
       if(baseSlots[i].userId == UserService.getUser().id){
        baseSlots[i].backgroundColor = '#FFF8A5';
        baseSlots[i].refid = UserService.getUser().id;
       }
       else {
        baseSlots[i].backgroundColor = '#d9e6e7';
        baseSlots[i].refid = 0;
       }
       aggregatedSlots = aggregatedSlots.concat(addWeeklySlots(baseSlots[i]));
     }

     return aggregatedSlots;
   }

   //Each user has one base sauna turn eg. thursday 19-21.
   //From this slot we can aggregate turns to be displayed each week in the calendar
   //In addition there are extra sauna slots outside of base sauna turns
   var addWeeklySlots = function(baseSlot_){
     var weeklySlots = [];
     var baseSlot = baseSlot_;
     var tempTimeslot;
     //Add the same timeslot to different weeks
     for(var j = 0; j < 60; ){
       //Start time
       var start = moment(baseSlot.timeslot, format.dateLong);
       start.add(j, 'days');
       //End time 1.5 hours from startme
       var end = start.clone();
       end = end.add(1.5, 'hours')
       tempTimeslot = {
         id : baseSlot.id+j,
         title : baseSlot.lastname,
         start : start.format(format.dateLong),
         end : end.format(format.dateLong),
         backgroundColor: baseSlot.backgroundColor,
         textColor : '#FFF',
         refid: baseSlot.refid
       }
       //Subtract the moment days added
       start.subtract(j, 'days');

       var is_it_cancelled = false;
       for(var x = 0; x < baseSlot.cancelled.length; x++)
        if(baseSlot.cancelled[x] == tempTimeslot.start){
          //console.log(baseSlot.cancelled[x]);
          is_it_cancelled = true;
          break;
        }

       if(!is_it_cancelled)
        weeklySlots.push(tempTimeslot);
       j+=7
     }

     //Also add all the extra turns that there are
     var extra_turns = baseSlot.extra;
     for(var k = 0; k < extra_turns.length; k++){
       //Start time
       var start = moment(extra_turns[k], format.dateLong);
       //End time 1.5 hours from startme
       var end = start.clone();
       end = end.add(1.5, 'hours')
       tempTimeslot = {
         id : baseSlot.id+k+100,
         title : baseSlot.lastname,
         start : start.format(format.dateLong),
         end : end.format(format.dateLong),
         backgroundColor: baseSlot.backgroundColor,
         textColor : '#FFF',
         refid: baseSlot.refid
       }
       weeklySlots.push(tempTimeslot);
     }
     return weeklySlots;
   }

   //Add an extra sauna turn to the calendar
   var addExtraSaunaslot = function(date, time){
     var start = moment(date + ' ' + time, format.dateLong);
     var end = start.clone();
     end = end.add(1.5, 'hours')
     //Check if the reservation overlays the current slots
     for(var i = 0; i < events.length; i++){
       if(end.isBetween(moment(events[i].start,format.dateLong),moment(events[i].end,format.dateLong))){
         //If there is an overlay return without reserving turn
         return;
       }
     }
     //Edit to the right format
     start.format(format.dateLong);
     end.format(format.dateLong);
     var slot = {
       id : GuidGenerator.generate(),
       title : UserService.getUser().name.split(' ').slice(-1).join(' '),
       start : start,
       end : end,
       backgroundColor: '#FFF8A5',
       textColor : '#000',
       refid: UserService.getUser().id
     }

     uploadTimeslot(slot);

     //Push changes to eventdata locally as well (no need for refresh)
     for(var index in eventdata){
       if(eventdata[index].userId == UserService.getUser().id)
        eventdata[index].extra.push(date + ' ' + time)
     }

     events.push(slot);
     calendar.data().easycal.refresh(events);
   }

   var initCalendar = function(startDate){
     currentDate = startDate;
     //Aggregate the event data to cover multiple weeks

     if(eventdata){
      events = aggregateSaunaTurns(eventdata);
     } else {
       events = [];
     }

    //Initilization of the easycal calendar library
     calendar = $('.mycal').easycal({
       startDate : currentDate, // OR 31/10/2104
       timeFormat : 'HH:mm',
       columnDateFormat : 'dddd, DD MMM',
       minTime : '16:00:00',
       maxTime : '23:30:00',
       slotDuration : 30,
       timeGranularity : 15,

       //Clicked free sauna turn slot
       dayClick : function(el, date, startTime){
         SaunaService.setSlot({date:date, slot: startTime});
         $('#modal8').openModal({
            dismissible: true, // Modal can be dismissed by clicking outside of the modal
            opacity: .5, // Opacity of modal background
            in_duration: 300, // Transition in duration
            out_duration: 200, // Transition out duration
            ready: function() {}, // Callback for Modal open
            complete: function() {} // Callback for Modal close
          });
         $('*[data-date="'+today+'"]').addClass("today");
       },

       //Clicked an existing sauna turn
       eventClick : function(el, eventId, eventRefId){
         //console.log('Event was clicked with id: ' + eventId + ' ' + eventRefId);
         //console.log(el.children().attr('data-event-id'));
          //find[i].css( "background-color", "red" );
         //el.attr('style', 'background-color: red !important');

         if(eventRefId == UserService.getUser().id){
           var find = $(".ec-event[data-event-id='" + eventId + "']");
           var datadate = find.parent().parent().attr('data-date');
           var datatime = find.first().find(".ec-time-range").text();
           var datatitle = find.first().find(".ec-event-title").text();

           SaunaService.setSlot({date:datadate, slot: datatime, title: datatitle, eventid: eventId, eventrefid: eventRefId});

           $('#modal7').openModal({
              dismissible: true, // Modal can be dismissed by clicking outside of the modal
              opacity: .5, // Opacity of modal background
              in_duration: 300, // Transition in duration
              out_duration: 200, // Transition out duration
              ready: function() {
                console.log(SaunaService.getSlot());
              }, // Callback for Modal open
              complete: function() {
                //eventClicked(eventId, eventRefId)
              } // Callback for Modal close
            });
          }
       },
       events : events
     });
     //Add border to current date
     $('*[data-date="'+today+'"]').addClass("today");
   }

   //The easycal has its own scope so the slot values need to be fetched
   //from this scope
   $scope.getSelectedSlot = function(){
     //The saunaslot set in dayClick or eventClick
     var slot = SaunaService.getSlot();
     $scope.data.date = slot.date;
     $scope.data.slot = slot.slot;
     $scope.data.title = slot.title;
     $scope.data.eventid = slot.eventid;
     $scope.data.eventrefid = slot.eventrefid;
   }

   $scope.reserveSlot = function(date, startTime){
    addExtraSaunaslot(date, startTime);
   }

   $scope.releaseSlot = function(eventId, eventRefId, date, time){
     //console.log(time.substr(0,time.indexOf(' '))+':00');
     time = time.substr(0,time.indexOf(' '))+':00';
     var timeslot = moment(date + ' ' + time, format.dateLong);
     DataBaseService.sauna.update({userId:eventRefId, timeslot: timeslot.format(format.dateLong)}, function(res){
       console.log(res);
     });
     console.log(eventRefId);

     //Push changes to eventdata locally as well
     for(var index in eventdata){
       if(eventdata[index].userId == UserService.getUser().id)
        eventdata[index].cancelled.push(date + ' ' + time)
     }

     //Splice the event from the events array
     for(var i = 0; i < events.length; i++)
       if(eventId == events[i].id && eventRefId == UserService.getUser().id){
         events.splice(i,1);
       }

     calendar.data().easycal.refresh(events);
     //Add border to current date
     $('*[data-date="'+today+'"]').addClass("today");
   }

   //Buttons to control the current week displayed
   $('#back').click(function(){
       calendar.data().easycal.destroy();
       var previousPage = moment(currentDate, "DD-MM-YYYY")
                         .subtract(7, 'day')
                         .format(format.dateShort);
       initCalendar(previousPage);
   });

   $('#next').click(function(){
       calendar.data().easycal.destroy();
       var nextPage = moment(currentDate, "DD-MM-YYYY")
                         .add(7, 'day')
                         .format(format.dateShort);
       initCalendar(nextPage);
   });


}]);
