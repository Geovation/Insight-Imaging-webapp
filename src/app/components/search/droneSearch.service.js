(function() {
  'use strict';

  angular
    .module('insight-imaging-webapp')
    .factory('droneSearch', droneSearch);

  /** @ngInject */
  function droneSearch(mapService) {

      var service = {
          searchDrones : searchDrones
      };

      return service;


      ///////////////////////////// LOGIC ////////////////////////////////


      /**
       * getDroneIdentifiers - gets all the drone identifiers so we can hide / show them
       *
       * @param  {type} vmDroneIdentifier - a list of all the markers for drones
       */
      function searchDrones(searchMode, searchCriteria){

        var drones = mapService.getDrones();
        var map = mapService.returnMap();

        for (var i=0; i < drones.length; i++){

          //console.log(searchMode, drones[i], drones[i][searchMode]);
          //console.log(searchCriteria);
          var drone = drones[i];
          var droneIdentifier = drone[searchMode].toLowerCase();
          searchCriteria = searchCriteria.toLowerCase();


          if (searchCriteria && droneIdentifier.indexOf(searchCriteria) === -1 ) { // If the input doest match any part of the Identifier
            if (map.hasLayer(drone)) {
              map.removeLayer(drone);
            }
          }
          else if (droneIdentifier.indexOf(searchCriteria) != -1) {

            map.addLayer(drone); // If the input matches a part of the Identifier
          }
          else if (!searchCriteria) {
            map.addLayer(drone);
          }
        }

      }

  }

})();
