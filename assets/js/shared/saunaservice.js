angular.module('sauna.services',[])
.factory('SaunaService', function() {
  var saunaslot = {};

  var saunaService = {
    getSlot: function(){
      return saunaslot;
    },
    setSlot: function(saunaslot_){
      saunaslot = saunaslot_;
    }
  }
  return saunaService;
});
