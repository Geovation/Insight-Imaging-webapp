(function () {
  'use strict';

  angular
    .module('insight-imaging-webapp')
    .directive('iiMap', iiMap);

  function iiMap(L, firebaseService, baseLayersService, mapService, $mdDialog) {
     return {
       restrict: 'E',
       templateUrl: 'app/main/map/map.directive.html',
       link: link
     };

     function link(scope, element) {

      var map = mapService.returnMap(); // Create the map

    }

  }

})();
