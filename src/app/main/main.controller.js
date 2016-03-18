(function() {
  'use strict';

  angular
    .module('insight-imaging-webapp')
    .controller('MainController', MainController);

  function MainController(L, firebaseService, baseLayersService, mapService, $mdDialog) {
        var map = mapService.returnMap(); // Create the map
  }

})();
