(function() {
  'use strict';

  angular
    .module('insight-imaging-webapp')
    .factory('droneSearch', droneSearch);

  /** @ngInject */
  function droneSearch(mapService) {

      var service = {
          getDroneIdentifiers : getDroneIdentifiers
      };

      return service;


      ///////////////////////////// LOGIC ////////////////////////////////


      /**
       * getDroneIdentifiers - gets all the drone identifiers so we can hide / show them
       *
       * @param  {type} vmDroneIdentifier - a list of all the markers for drones
       */
      function getDroneIdentifiers(vmDroneIdentifier){

        var drones = mapService.getDrones();
        var map = mapService.returnMap();
        for (var i=0; i < drones.length; i++){

          var droneIdentifier = drones[i].droneIdentifier.toLowerCase();
          vmDroneIdentifier = vmDroneIdentifier.toLowerCase();

          if (vmDroneIdentifier && droneIdentifier.indexOf(vmDroneIdentifier) === -1 ) { // If the input doest match any part of the Identifier
            if (map.hasLayer(drones[i])) {
              map.removeLayer(drones[i]);
            }
          }
          else if (droneIdentifier.indexOf(vmDroneIdentifier) != -1) {

            map.addLayer(drones[i]); // If the input matches a part of the Identifier
          }
          else if (!vmDroneIdentifier) {
            map.addLayer(drones[i]);
          }
        }

      }

  }

})();
